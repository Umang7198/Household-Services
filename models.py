from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import db

# User model (Admin, Customer, Service Professional)
class User(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='customer')  # Default role is 'customer'
    address = db.Column(db.String(255), nullable=False)  # Address of the user
    pin = db.Column(db.String(6), nullable=False)  # Postal code or PIN
    date_created = db.Column(db.DateTime, default=datetime.now, nullable=False)

    # Relationships
    services_provided = db.relationship('Service', backref='professional', lazy='dynamic')  # Services provided by professionals
    service_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.customer_id', backref='customer', lazy='dynamic')
    completed_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.professional_id', backref='assigned_professional', lazy='dynamic')
    
    # Professional profile relationship (for service professionals)
    professional_profile = db.relationship('Professional', uselist=False, back_populates='user')

# Professional profile model (specific to service professionals)
class Professional(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now, nullable=False)
    description = db.Column(db.String(500), nullable=True)  # Description of the professional’s background or expertise
    service_type = db.Column(db.String(100), nullable=False)  # E.g. 'Plumbing', 'AC Repair', etc.
    experience = db.Column(db.Integer, nullable=False)  # Years of experience
    verified = db.Column(db.Boolean, default=False)  # Verified by admin

    # Establish relationship with the User model
    user = db.relationship('User', back_populates='professional_profile')  # Corrected back_populates to match User

# Service model (e.g., AC repair, plumbing)
class Service(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # Time required in minutes
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # The service professional offering this service

# Service Request model (created by customer for specific services)
class ServiceRequest(db.Model):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Assigned professional
    date_of_request = db.Column(db.DateTime, default=datetime.now, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(50), nullable=False, default='requested')  # 'requested', 'assigned', 'completed'
    remarks = db.Column(db.String(500), nullable=True)