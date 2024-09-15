from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import db

# User model (includes Admin, Customer, Service Professional)
class User(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='customer')  # Role can be 'customer', 'professional', 'admin'
    address = db.Column(db.String(255), nullable=False)
    pin = db.Column(db.String(6), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now, nullable=False)
    
    # Fields specific to professionals
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=True)  # Each professional is linked to one service
    experience = db.Column(db.Integer, nullable=True)  # Years of experience, applicable only to professionals
    description = db.Column(db.String(500), nullable=True)  # Professional background

    # Relationships
    service_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.customer_id', backref='customer', lazy='dynamic')
    assigned_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.professional_id', backref='professional', lazy='dynamic')

# Service model (e.g., AC repair, plumbing)
class Service(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # Time required in minutes

    professionals = db.relationship('User', backref='service', lazy='dynamic')  # A service can have multiple professionals
    service_requests = db.relationship('ServiceRequest', backref='service', lazy='dynamic')

# Service Request model
class ServiceRequest(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Assigned professional
    date_of_request = db.Column(db.DateTime, default=datetime.now, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(50), nullable=False, default='requested')
    remarks = db.Column(db.String(500), nullable=True)
