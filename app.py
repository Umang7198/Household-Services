import os
from models import User, Service, ServiceRequest  # Adjust the import path according to your project structure
from config import app, db
from flask_migrate import Migrate
from flask_cors import CORS
import routes
from celery import Celery
from extensions import celery_app
import tasks
# Function to add predefined admin data
def add_admin():
    # Predefined admin data
    admins = [
        {
            "name": "Admin",
            "email": "admin@householdservices.com",
            "mobile": "9876543211",
            "username": "admin",
            "password": "admin",
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

# celery = celery_init_app(app)


app.config.from_mapping(
    CELERY=dict(
        broker_url="redis://localhost:6379/1",
        result_backend="redis://localhost:6379/2",
        enable_utc=False,
        timezone="Asia/Kolkata",
        broker_connection_retry_on_startup=True
    ),
)

# celery_app = Celery(app.name)
celery_app.conf.update(app.config["CELERY"])

class ContextTask(celery_app.Task):
    def _call_(self, *args, **kwargs):
        with app.app_context():
            return self.run(*args, **kwargs)



celery_app.Task = ContextTask
celery_app.autodiscover_tasks(['tasks'])



# Main block
if __name__ == '__main__':
    with app.app_context():
        # Create tables based on models if they don't exist
        db.create_all()
        # Add admin data to the database
        add_admin()
    # Run the Flask app

    app.run(debug=True)


