from models import db, User,Service,ServiceRequest
from werkzeug.security import check_password_hash, generate_password_hash
from config import app,db
from flask import Flask, request, redirect, render_template, url_for, session,abort,flash,jsonify

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/logout', methods=['GET'])
def logout():
    try:
        session.clear()  # Clear the session
        return jsonify({'msg': 'Logged out successfully', 'status': 'success'}), 200
    except Exception as e:
        return jsonify({'msg': str(e), 'status': 'error'}), 500



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # Role should be passed along with the login details

    # Query the user by username
    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({'msg': 'User not found', 'status': 'fail'}), 401

    # Check if the role matches and password is correct
    if user.role == role and user.password== password:
        session['user_id'] = user.id  # Save user ID in the session
        return jsonify({'msg': f'{role.capitalize()} login successful', 'status': 'success'}), 200
    else:
        return jsonify({'msg': 'Invalid credentials or role', 'status': 'fail'}), 401

@app.route('/service-request', methods=['POST'])
def create_service_request():
    data = request.get_json()
    service_id = data.get('service_id')
    customer_id = data.get('customer_id')
    professional_id = data.get('professional_id', None)  # Optional field

    service_request = ServiceRequest(
        service_id=service_id,
        customer_id=customer_id,
        professional_id=professional_id
    )
    db.session.add(service_request)
    db.session.commit()

    return jsonify({'msg': 'Service request created', 'status': 'success'}), 201


@app.route('/service', methods=['POST'])
def add_service():
    # Get data from the request
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    base_price = data.get('base_price')
    time_required = data.get('time_required')

    # Check if required fields are provided
    if not all([name, base_price, time_required]):
        return jsonify({'msg': 'Missing required fields', 'status': 'fail'}), 400

    # Create a new service instance
    service = Service(
        name=name,
        description=description,
        base_price=base_price,
        time_required=time_required
    )

    # Add the service to the database
    try:
        db.session.add(service)
        db.session.commit()
        return jsonify({'msg': 'Service added successfully', 'status': 'success'}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of any error
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500


@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()  # Fetch all services from the database
    service_list = [
        {
            'id': service.id,
            'name': service.name,
            'base_price': service.base_price
        } for service in services
    ]
    return jsonify(service_list), 200


@app.route('/service/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'msg': 'Service not found', 'status': 'error'}), 404

    data = request.get_json()
    service.name = data.get('name')
    service.base_price = data.get('base_price')
    service.description = data.get('description')
    service.time_required = data.get('time_required')

    try:
        db.session.commit()
        return jsonify({'msg': 'Service updated successfully', 'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Failed to update service: {str(e)}', 'status': 'error'}), 500

@app.route('/service/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'msg': 'Service not found', 'status': 'error'}), 404

    try:
        db.session.delete(service)
        db.session.commit()
        return jsonify({'msg': 'Service deleted successfully', 'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Failed to delete service: {str(e)}', 'status': 'error'}), 500




@app.route('/register/professional', methods=['POST'])
def register_professional():
    data = request.get_json()
    
    name = data.get('name')
    service_id = data.get('service_id')
    experience = data.get('experience')
    description = data.get('description')
    address = data.get('address')
    pin = data.get('pin')
    password=data.get('password')
    email=data.get('email')
    mobile=data.get('mobile')
    username=data.get('username')
    # Basic validation
    if not all([name, service_id, experience, address, pin]):
        return jsonify({'msg': 'Missing required fields', 'status': 'fail'}), 400
    
    # Create a new user with the role 'professional'
    try:
        new_professional = User(
            name=name,
            username=username,
            role='professional',  # Role is set to 'professional'
            service_id=service_id,
            experience=experience,
            description=description,
            address=address,
            pin=pin,
            email=email,
            mobile=mobile,
            # You might want to hash the password, or set it properly
            password=password  # For now, use a default password (can be updated later)
        )
        
        db.session.add(new_professional)
        db.session.commit()

        return jsonify({'msg': 'Professional registered successfully', 'status': 'success'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500

@app.route('/professionals/unverified', methods=['GET'])
def get_unverified_professionals():
    # Fetch professionals with verified=False
    unverified_professionals = User.query.filter_by(role='professional', verified=False).all()
    
    professionals_list = [
        {
            'id': professional.id,
            'name': professional.name,
            'service_name': professional.service.name if professional.service else None,  # Get the service name from the related Service model
            'experience': professional.experience,
            'description': professional.description,
            'address': professional.address,
            'pin': professional.pin
        } for professional in unverified_professionals
    ]
    return jsonify(professionals_list), 200


@app.route('/professional/approve/<int:professional_id>', methods=['PUT'])
def approve_professional(professional_id):
    professional = User.query.filter_by(id=professional_id, role='professional').first()
    
    if not professional or professional.verified:
        return jsonify({'msg': 'Professional not found or already verified', 'status': 'fail'}), 404
    
    try:
        professional.verified = True
        db.session.commit()
        return jsonify({'msg': 'Professional approved successfully', 'status': 'success'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500

@app.route('/professional/reject/<int:professional_id>', methods=['DELETE'])
def reject_professional(professional_id):
    professional = User.query.filter_by(id=professional_id, role='professional').first()

    if not professional or professional.verified:
        return jsonify({'msg': 'Professional not found or already verified', 'status': 'fail'}), 404

    try:
        db.session.delete(professional)
        db.session.commit()
        return jsonify({'msg': 'Professional rejected and deleted successfully', 'status': 'success'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500


@app.route('/register/customer', methods=['POST'])
def register_customer():
    data = request.get_json()

    # Extract data from the request
    name = data.get('name')
    email = data.get('email')
    mobile = data.get('mobile')
    username = data.get('username')
    password = data.get('password')
    address = data.get('address')
    pin = data.get('pin')
    
    # Basic validation
    if not all([name, email, mobile, username, password, address, pin]):
        return jsonify({'msg': 'Missing required fields', 'status': 'fail'}), 400

    # Check if the username or email already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({'msg': 'User with this email or username already exists', 'status': 'fail'}), 400


    # Create a new customer
    try:
        new_customer = User(
            name=name,
            email=email,
            mobile=mobile,
            username=username,
            password=password,
            address=address,
            pin=pin,
            role='customer'  # Role is set to 'customer'
        )
        
        db.session.add(new_customer)
        db.session.commit()

        return jsonify({'msg': 'Customer registered successfully', 'status': 'success'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500
