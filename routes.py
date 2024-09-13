from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import check_password_hash, generate_password_hash

auth_routes = Blueprint('auth_routes', __name__)

@app.route('/')
def index():
    return render_template('index.html')



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
    if user.role == role and check_password_hash(user.password, password):
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
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    base_price = data.get('base_price')
    time_required = data.get('time_required')
    professional_id = data.get('professional_id')

    service = Service(
        name=name,
        description=description,
        base_price=base_price,
        time_required=time_required,
        professional_id=professional_id
    )
    db.session.add(service)
    db.session.commit()

    return jsonify({'msg': 'Service added', 'status': 'success'}), 201
