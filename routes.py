from models import db, User,Service,ServiceRequest,ServiceCategory,professional_services
from werkzeug.security import check_password_hash, generate_password_hash
from config import app,db
from flask import Flask, request, redirect, render_template, url_for, session,abort,flash,jsonify
from datetime import datetime,date
from sqlalchemy import func

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
        return jsonify({
                    'msg': f'{role.capitalize()} login successful', 
                    'status': 'success', 
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'email': user.email
                    }
                }), 200
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
    category_id = data.get('category_id')  # Get the category_id from the request

    if not all([name, base_price, time_required, category_id]):
        return jsonify({'msg': 'Missing required fields', 'status': 'fail'}), 400

    service = Service(
        name=name,
        description=description,
        base_price=base_price,
        time_required=time_required,
        category_id=category_id  # Associate service with category
    )

    try:
        db.session.add(service)
        db.session.commit()
        return jsonify({'msg': 'Service added successfully', 'status': 'success'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error occurred: {str(e)}', 'status': 'fail'}), 500

@app.route('/service-categories', methods=['GET'])
def get_service_categories():
    try:
        # Assuming you have a model named ServiceCategory
        categories = ServiceCategory.query.all()
        result = [{'id': category.id, 'name': category.name} for category in categories]
        return jsonify(result), 200
    except Exception as e:
        # Log the error for debugging
        app.logger.error(f"Error fetching service categories: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/services', methods=['GET'])
def get_services_by_category():
    category_id = request.args.get('category')
    if category_id:
        services = Service.query.filter_by(category_id=category_id).all()
    else:
        services = Service.query.all()

    services_list = [{
        "id": service.id,
        "name": service.name,
        "base_price": service.base_price,
        "time_required":service.time_required,
        "categoryName": service.category.name  # Assuming Service has a relationship with Category
    } for service in services]

    return jsonify(services_list)



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
    password = data.get('password')
    email = data.get('email')
    mobile = data.get('mobile')
    username = data.get('username')

    # Basic validation
    if not all([name, service_id, experience, address, pin, password, email, mobile, username]):
        return jsonify({'msg': 'Missing required fields', 'status': 'fail'}), 400

    try:
        # Find the selected service
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'msg': 'Invalid service selected', 'status': 'fail'}), 400

        # Create a new professional (User with role 'professional')
        new_professional = User(
            name=name,
            username=username,
            role='professional',  # Role is set to 'professional'
            experience=experience,
            description=description,
            address=address,
            pin=pin,
            email=email,
            mobile=mobile,
            password=password  # Consider hashing the password for security
        )

        # Add the service to the professional's services (many-to-many relationship)
        new_professional.professional_services.append(service)

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
            'services': [{'id': service.id, 'name': service.name} for service in professional.professional_services],  # 'services' not 'professional_services'
            'experience': professional.experience,
            'description': professional.description,
            'address': professional.address,
            'pin': professional.pin
        } for professional in unverified_professionals
    ]
    # print(jsonify(professionals_list))
    return jsonify(professionals_list), 200

@app.route('/professional/<int:professional_id>', methods=['GET'])
def get_professional(professional_id):
    # Fetch the professional by ID, ensuring they are unverified
    professional = User.query.filter_by(id=professional_id, role='professional').first()
    
    if not professional:
        return jsonify({'msg': 'Professional not found or already verified'}), 404

    # Prepare the professional's details
    professional_data = {
        'id': professional.id,
        'name': professional.name,
        'email': professional.email,
        'mobile': professional.mobile,
        'address': professional.address,
        'pin': professional.pin,
        'experience': professional.experience,
        'description': professional.description,
        'services': [{'id': service.id, 'name': service.name} for service in professional.professional_services],  # List of services
        'rating': professional.rating,
        'workload': professional.workload,
        'date_created': professional.date_created
    }
    return jsonify(professional_data), 200


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

@app.route('/service-requests', methods=['GET'])
def get_service_requests():
    # Query all service requests
    service_requests = ServiceRequest.query.filter(ServiceRequest.service_status != 'rejected').all()

    # Convert each service request to a dictionary with necessary details
    request_list = []
    for request in service_requests:
        request_data = {
            'id': request.id,
            'service_name': request.service.name,  # Service name
            'customer_name': request.customer.name,  # Customer's name
            'professional_name': request.professional.name if request.professional else 'Not assigned',  # Professional's name if assigned
            'service_status': request.service_status,  # Status of the request
            'date_of_request': request.date_of_request,
            'date_of_completion': request.date_of_completion,
            'price': request.price,
            'rating': request.rating,
            'review': request.review
        }
        request_list.append(request_data)
    # Return the list of service requests as a JSON response
    return jsonify(request_list), 200

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


@app.route('/service-categories', methods=['POST'])
def create_category():
    try:
        data = request.json
        name = data.get('name')
        description = data.get('description')

        # Ensure that name is provided
        if not name:
            return jsonify({'msg': 'Category name is required'}), 400

        # Create new category
        new_category = ServiceCategory(name=name, description=description)
        db.session.add(new_category)
        db.session.commit()

        return jsonify({'msg': 'Category added successfully'}), 201
    except Exception as e:
        return jsonify({'msg': 'An error occurred while adding the category', 'error': str(e)}), 500

@app.route('/service-categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        category = ServiceCategory.query.get(category_id)
        if not category:
            return jsonify({'msg': 'Category not found'}), 404
        
        data = request.json
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)

        db.session.commit()

        return jsonify({'msg': 'Category updated successfully'}), 200
    except Exception as e:
        return jsonify({'msg': 'An error occurred while updating the category', 'error': str(e)}), 500

@app.route('/service-categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        category = ServiceCategory.query.get(category_id)
        if not category:
            return jsonify({'msg': 'Category not found'}), 404

        db.session.delete(category)
        db.session.commit()

        return jsonify({'msg': 'Category deleted successfully'}), 200
    except Exception as e:
        return jsonify({'msg': 'An error occurred while deleting the category', 'error': str(e)}), 500



def find_best_professional(service_id, customer_pin):
    # Debug step: Log the service_id and customer_pin
    print(f"Service ID: {service_id}, Customer Pin: {customer_pin}")
    
    # Step 1: First try to find professionals in the same pin code
    best_professional = db.session.query(User).join(professional_services).filter(
        professional_services.c.service_id == service_id,  # Match the service
        User.role == 'professional',
        User.verified == True,
        User.pin == customer_pin
    ).order_by(User.rating.desc(), User.workload.asc()).first()

    # # Debug step: Check if a professional was found
    # if best_professional:
    #     print(f"Best professional found in same pin: {best_professional.name}")
    # else:
    #     print("No professional found in same pin code")

    # Step 2: If no professional is found in the same pin code, expand the search
    if not best_professional:
        best_professional = db.session.query(User).join(professional_services).filter(
            professional_services.c.service_id == service_id,  # Match the service
            User.role == 'professional',
            User.verified == True
        ).order_by(User.rating.desc(), User.workload.asc()).first()

        # Debug step: Check if a professional was found in nearby pins
        # if best_professional:
        #     print(f"Best professional found in other pins: {best_professional.name}")
        # else:
        #     print("No professional found in other pins either")
    
    return best_professional




@app.route('/book-service', methods=['POST'])
def book_service():
    customer_id = request.json.get('customer_id')
    service_id = request.json.get('service_id')
    
    # Fetch customer information
    customer = User.query.get(customer_id)
    service = Service.query.get(service_id)

    if not customer or customer.role != 'customer':
        return jsonify({'success': False, 'message': 'Invalid customer'}), 400
    
    # Find the best professional based on the logic provided
    best_professional = find_best_professional(service_id, customer.pin)
    print(best_professional)
    if not best_professional:
        return jsonify({'success': False, 'message': 'No professionals available'}), 400
    
    # Create a new ServiceRequest
    try:
        service_request = ServiceRequest(
            service_id=service_id,
            customer_id=customer.id,
            professional_id=best_professional.id,
            price=service.base_price,
            date_of_request=datetime.now()  # Example price, you can replace this with actual pricing logic
        )
        
        # Update professional's workload
        best_professional.workload += 1
        
        db.session.add(service_request)
        db.session.commit()

        # Return a success response with the professional's name
        return jsonify({'success': True, 'message': 'Service booked successfully', 'professional': best_professional.name}), 200

    except Exception as e:
        db.session.rollback()  # Roll back changes in case of an error
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/professional/today-services', methods=['GET'])
def get_today_services():
    professional_id = request.args.get('professional_id')
    # print(professional_id)
    if not professional_id:
        return jsonify({'msg': 'Missing professional ID'}), 400

    # Ensure the professional exists
    professional = User.query.filter_by(id=professional_id, role='professional').first()
    # print(professional)
    if not professional:
        return jsonify({'msg': 'Unauthorized or professional not found'}), 403

    # print(datetime.date.today())
    today_services = ServiceRequest.query.filter(
    ServiceRequest.professional_id == professional_id,
    ServiceRequest.service_status == 'requested',
    func.date(ServiceRequest.date_of_request) == date.today()
    ).all()
    # print(today_services)
    service_data = [
        {
            'id': service.id,
            'customerName': service.customer.name,
            'phone': service.customer.mobile,
            'location': f"{service.customer.address}, {service.customer.pin}",
        } for service in today_services
    ]
    return jsonify(service_data), 200

@app.route('/professional/closed-services', methods=['GET'])
def get_closed_services():
    professional_id = request.args.get('professional_id')

    if not professional_id:
        return jsonify({'msg': 'Missing professional ID'}), 400

    # Ensure the professional exists
    professional = User.query.filter_by(id=professional_id, role='professional').first()
    if not professional:
        return jsonify({'msg': 'Unauthorized or professional not found'}), 403

    # Fetch closed services for the professional
    closed_services = ServiceRequest.query.filter_by(
        professional_id=professional_id,
        service_status='closed'
    ).all()

    # Prepare the data to return
    service_data = []
    for service in closed_services:
        service_data.append({
            
            'customerName': service.customer.name,
            'phone': service.customer.mobile,
            'location': f"{service.customer.address}, {service.customer.pin}",
            'date': service.date_of_completion.strftime('%Y-%m-%d') if service.date_of_completion else 'Not Completed',
            'rating': {
                'score': service.rating,
                'review': service.review
            } if service.rating is not None else 'Not Rated'
        })
    
    return jsonify(service_data), 200


# Accept Service Route
@app.route('/professional/accept-service', methods=['POST'])
def accept_service():
    service_id = request.json.get('service_id')
    service = ServiceRequest.query.get(service_id)

    if service:
        service.service_status = 'accepted'
        db.session.commit()
        return jsonify({'message': 'Service accepted'}), 200
    return jsonify({'error': 'Service not found'}), 404




# Reject Service Route
@app.route('/professional/reject-service', methods=['POST'])
def reject_service():
    service_id = request.json.get('service_id')
    service = ServiceRequest.query.get(service_id)

    if service:
        service.service_status = 'rejected'
        professional = User.query.get(service.professional_id)
        if professional and professional.workload > 0:
            professional.workload -= 1

        db.session.commit()        
        return jsonify({'message': 'Service rejected and deleted'}), 200
    return jsonify({'error': 'Service not found'}), 404

@app.route('/service-history', methods=['GET'])
def get_service_history():
    # Get customer_id from query parameters
    customer_id = request.args.get('customer_id')

    if not customer_id:
        return jsonify({'error': 'Customer ID is required'}), 400

    # Fetch service history for the customer
    service_requests = ServiceRequest.query.filter_by(customer_id=customer_id).order_by(ServiceRequest.date_of_request.desc()) .all()

    # Prepare the response data
    service_history = []
    for service_request in service_requests:
        service_history.append({
            'id': service_request.id,
            'name': service_request.service.name,  # Assuming service has a name field
            'professional': service_request.professional.name,  # Assuming a relationship to User (professional)
            'phone': service_request.professional.mobile,  # Professional phone number
            'status': service_request.service_status,  # Status of the service (Requested, Active, Accepted, Closed)
        })

    return jsonify(service_history), 200

@app.route('/close-service/<int:service_id>', methods=['POST'])
def close_service(service_id):
    service_request = ServiceRequest.query.get(service_id)

    if not service_request:
        return jsonify({'error': 'Service not found'}), 404

    print(service_request)
    # Mark the service as closed
    if service_request.service_status != 'closed':
        service_request.service_status = 'closed'
        service_request.date_of_completion = datetime.now()  # Set the current date and time

        professional = User.query.get(service_request.professional_id)
        if professional and professional.workload > 0:
            professional.workload -= 1

        db.session.commit()

    return jsonify({'success': True}), 200

@app.route('/rating/<int:service_request_id>', methods=['GET'])
def get_rating_data(service_request_id):
    # Query the service request by its ID
    service_request = ServiceRequest.query.get(service_request_id)

    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404

    # Fetch related customer and professional details
    customer = User.query.get(service_request.customer_id)
    professional = User.query.get(service_request.professional_id)
    service = Service.query.get(service_request.service_id)

    # Prepare the response data
    response_data = {
        'service_request_id': service_request.id,
        'customer': {
            'id': customer.id,
            'name': customer.name,
            'phone': customer.mobile,
        },
        'professional': {
            'id': professional.id,
            'name': professional.name,
            'phone': professional.mobile,
            'rating': professional.rating,
        },
        'service': {
            'id': service.id,
            'name': service.name,
            'description': service.description,
        },
        'rating': {
            'score': service_request.rating,
            'review': service_request.review,
        }
    }

    return jsonify(response_data), 200

@app.route('/submit-rating', methods=['POST'])
def submit_rating():
    data = request.json  # Get the JSON data from the request

    # Extract required fields
    service_request_id = data.get('requestId')
    rating_value = data.get('rating')
    review_text = data.get('remarks')

    # Check if the service request exists
    service_request = ServiceRequest.query.get(service_request_id)
    if not service_request:
        return jsonify({'error': 'Service request not found'}), 404

    # Update rating and review in the service request
    service_request.rating = rating_value
    service_request.review = review_text
    service_request.service_status = 'closed'
    service_request.date_of_completion = datetime.now()

    # Update the professional's average rating
    professional = User.query.get(service_request.professional_id)
    if professional:
        # Calculate the new average rating for the professional
        total_ratings = db.session.query(func.count(ServiceRequest.rating)).filter(
            ServiceRequest.professional_id == professional.id,
            ServiceRequest.rating.isnot(None)  # Only count completed services with a rating
        ).scalar()

        avg_rating = db.session.query(func.avg(ServiceRequest.rating)).filter(
            ServiceRequest.professional_id == professional.id,
            ServiceRequest.rating.isnot(None)
        ).scalar()

        # Update the professional's rating
        professional.rating = avg_rating

    db.session.commit()  # Commit the transaction

    return jsonify({'success': True}), 200


@app.route('/customer/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    # Fetch the customer by ID
    customer = User.query.filter_by(id=customer_id, role='customer').first()

    if not customer:
        return jsonify({'msg': 'Customer not found'}), 404

    # Prepare the customer's details
    customer_data = {
        'id': customer.id,
        'username':customer.username,
        'password':customer.password,
        'name': customer.name,
        'email': customer.email,
        'mobile': customer.mobile,
        'address': customer.address,
        'pin': customer.pin,
        'date_created': customer.date_created.strftime('%Y-%m-%d %H:%M:%S')  # Format date as needed
    }

    return jsonify(customer_data), 200

# Flask backend routes (example)

# Combined route to search for customers or professionals based on role
@app.route('/search/users', methods=['GET'])
def search_users():
    role = request.args.get('role')
    query = request.args.get('name')
    
    # Validate role and query
    if not role or role not in ['customer', 'professional']:
        return jsonify({'msg': 'Invalid or missing role'}), 400
    
    if not query:
        return jsonify({'msg': 'No search query provided'}), 400
    
    # Perform search based on the role
    users = User.query.filter(User.role == role, User.name.ilike(f"%{query}%")).all()
    
    if users:
        if role == 'customer':
            # Return customer-specific data
            user_data = [
                {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'mobile': user.mobile,
                    'username':user.username,
                    'password':user.password,
                    'address':user.address,
                    'pin':user.pin,
                    'date_created':user.date_created,

                }
                for user in users
            ]
        elif role == 'professional':
            # Return professional-specific data including services, rating, and workload
            user_data = [
                {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'mobile': user.mobile,
                    'username':user.username,
                    'password':user.password,
                    'services': [{'id': service.id, 'name': service.name} for service in user.professional_services],
                    'rating': user.rating,
                    'workload': user.workload,
                    'address':user.address,
                    'pin':user.pin,
                    'date_created':user.date_created,
                }
                for user in users
            ]
        return jsonify(user_data), 200
    else:
        return jsonify({'msg': f'No {role}s found'}), 404

@app.route('/search/service-requests', methods=['GET'])
def search_service_requests():
    query = request.args.get('request')
    if not query:
        return jsonify({'msg': 'No search query provided'}), 400
    
    service_requests = ServiceRequest.query.join(Service).filter(
        Service.name.ilike(f"%{query}%")
    ).all()
    
    if service_requests:
        request_data = [
            {
                'id': req.id,
                'service_name': req.service.name,
                'customer_name': req.customer.name,
                'professional_name': req.professional.name if req.professional else 'Not assigned',
                'status': req.service_status,
                'price': req.price,
                'date_of_request': req.date_of_request.strftime('%Y-%m-%d'),
                'date_of_completion': req.date_of_completion.strftime('%Y-%m-%d') if req.date_of_completion else None,
                'rating':req.rating,
                'review':req.review,
            }
            for req in service_requests
        ]
        return jsonify(request_data), 200
    else:
        return jsonify({'msg': 'No service requests found'}), 404

@app.route('/delete/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    # Logic to delete user from database
    # Assuming you have a User model
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'msg': 'User deleted successfully'}), 200
    return jsonify({'msg': 'User not found'}), 404
