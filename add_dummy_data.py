from app import app  # Import your app from wherever it is defined
from models import db, ServiceCategory, Service, User, ServiceRequest
from datetime import datetime

with app.app_context():
    # Clear existing data (Optional, but useful for a clean start)
    db.drop_all()
    db.create_all()

    # Add Service Categories
    categories = [
        ServiceCategory(name="Home Cleaning", description="Cleaning services for residential properties"),
        ServiceCategory(name="Electrical Services", description="Electrical installation and repair services"),
        ServiceCategory(name="Plumbing", description="Plumbing services for residential and commercial properties"),
        ServiceCategory(name="Appliance Repair", description="Repair services for home appliances"),
        ServiceCategory(name="Beauty and Wellness", description="Beauty and wellness services at home"),
        ServiceCategory(name="Pest Control", description="Professional pest control services for homes and businesses")
    ]
    db.session.add_all(categories)
    db.session.commit()

    # Add Services
    services = [
        Service(name="Deep Cleaning", description="Thorough cleaning of home including floors, walls, and ceilings", base_price=120.00, time_required=240, category_id=1),
        Service(name="Carpet Cleaning", description="Professional carpet cleaning services", base_price=80.00, time_required=120, category_id=1),
        Service(name="Wiring Repair", description="Fix faulty wiring in homes", base_price=150.00, time_required=180, category_id=2),
        Service(name="Fan Installation", description="Install ceiling, table, or wall fans", base_price=50.00, time_required=60, category_id=2),
        Service(name="Leak Fixing", description="Repair leaks in pipes and faucets", base_price=50.00, time_required=60, category_id=3),
        Service(name="Water Heater Installation", description="Install a new water heater", base_price=150.00, time_required=120, category_id=3),
        Service(name="Washing Machine Repair", description="Fixing broken or malfunctioning washing machines", base_price=80.00, time_required=120, category_id=4),
        Service(name="Refrigerator Repair", description="Repair faulty refrigerators", base_price=100.00, time_required=150, category_id=4),
        Service(name="Haircut", description="Professional haircut and hairstyling services", base_price=30.00, time_required=45, category_id=5),
        Service(name="Massage Therapy", description="Full body massage therapy", base_price=80.00, time_required=90, category_id=5),
        Service(name="Termite Control", description="Treatment to remove termites", base_price=250.00, time_required=240, category_id=6),
        Service(name="Rodent Control", description="Control mice, rats, and other rodents", base_price=150.00, time_required=120, category_id=6)
    ]
    db.session.add_all(services)
    db.session.commit()

    # Add Users (Professionals and Customers)
    users = [
        User(name="John Doe", email="john@electric.com", mobile="1234567890", username="john", password="John@123", role="professional",experience="4", address="123 Main St", pin="123456",rating="4.5",workload="2", verified=True),
        User(name="Sarah Lee", email="sarah@cleanhome.com", mobile="9876543210", username="sarah_clean", password="Sarah@123", role="professional", experience="4",address="456 Elm St", pin="654321", verified=True,rating="4",workload="6",),
        User(name="Alice Smith", email="alice@domain.com", mobile="1122334455", username="alice", password="Alice@123", role="customer", address="789 Maple Ave", pin="987654", verified=False),
        User(name="Bob Brown", email="bob@domain.com", mobile="2233445566", username="bob", password="Bob@1234", role="customer", address="123 Pine St", pin="654321", verified=False)
    ]
    db.session.add_all(users)
    db.session.commit()

    # service_requests = [
    # ServiceRequest(service_id=1,customer_id=4,professional_id=6,date_of_request=datetime(2024, 10, 16, 6, 5, 4, 727310),date_of_completion=None,service_status="rejected",price=100.0,rating=None,review=None
    # ),
    # ServiceRequest(service_id=2,customer_id=4,professional_id=6,date_of_request=datetime(2024, 10, 16, 6, 5, 44, 610241),date_of_completion=datetime(2024, 10, 16, 11, 36, 36, 67791),service_status="closed",price=100.0,rating=5.0,review="fiib"
    # ),
    # ServiceRequest(service_id=3,customer_id=4,professional_id=6,date_of_request=datetime(2024, 10, 16, 11, 49, 17, 356537),date_of_completion=datetime(2024, 10, 16, 11, 50, 10, 789473),service_status="closed",price=120.0,rating=3.0,review="mvmdv"
    # ),
    # ServiceRequest(service_id=4,customer_id=4,professional_id=6,date_of_request=datetime(2024, 10, 16, 11, 51, 42, 90252),date_of_completion=None,service_status="rejected",price=120.0,rating=None,review=None
    # ),
    # ServiceRequest(service_id=7,customer_id=4,professional_id=7,date_of_request=datetime(2024, 10, 20, 10, 9, 59, 383033),date_of_completion=datetime(2024, 10, 20, 10, 10, 47, 918003),service_status="closed",price=80.0,rating=3.0,review="can be better"
    # )
# ]
    # db.session.add_all(service_requests)
    # db.session.commit()


print("Dummy data added successfully!")
