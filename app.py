import os
from models import User, Professional, Service, ServiceRequest  # Adjust the import path according to your project structure
import routes
from config import app, db
from flask_migrate import Migrate
from flask_cors import CORS

migrate = Migrate(app, db)
# CORS(app)

# Function to add predefined admin data
def add_admin():
    # Predefined admin data
    admins = [
        {
            "name": "Admin",
            "email": "admin@householdservices.com",
            "mobile": "9876543210",
            "username": "admin",
            "password": "Admin@123",
            "role": "admin",
            "address": "N/A",  # Provide a default address for admin
            "pin": "000000"  # Provide a default pin for admin
        },
        # Add more admins if required
    ]

    for admin in admins:
        if not User.query.filter_by(username=admin['username']).first():
            new_admin = User(
                name=admin['name'],
                email=admin['email'],
                mobile=admin['mobile'],
                username=admin['username'],
                password=admin['password'],
                role=admin['role'],
                address=admin['address'],  # Include address
                pin=admin['pin']  # Include pin
            )
            db.session.add(new_admin)
    
    try:
        db.session.commit()
        print("Admin(s) added to the database.")
    except Exception as e:
        db.session.rollback()
        print(f"Error adding admin: {e}")

# Main block
if __name__ == '__main__':
    with app.app_context():
        # Create tables based on models if they don't exist
        db.create_all()
        # Add admin data to the database
        add_admin()
    # Run the Flask app
    app.run(debug=True)