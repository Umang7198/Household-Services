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
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    verified = db.Column(db.Boolean, default=False, nullable=True)  # New field
    
    # Relationships
    customer_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.customer_id', back_populates='customer')
    professional_requests = db.relationship('ServiceRequest', foreign_keys='ServiceRequest.professional_id', back_populates='professional')
    professional_services = db.relationship('Service', secondary='professional_services', back_populates='professionals')


# Service Category model (e.g., Home Cleaning, Repair)
class ServiceCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    services = db.relationship('Service', back_populates='category', lazy='dynamic')


# Service model (e.g., AC Repair, Plumbing)
class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)  # Time required in minutes
    category_id = db.Column(db.Integer, db.ForeignKey('service_category.id'), nullable=False)
    category = db.relationship('ServiceCategory', back_populates='services')

    # Relationships
    professionals = db.relationship('User', secondary='professional_services', back_populates='professional_services')
    service_requests = db.relationship('ServiceRequest', back_populates='service')


# Association table for many-to-many relationship between Service and User (professionals)
professional_services = db.Table('professional_services',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey('service.id'), primary_key=True)
)


# Service Request model
class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Assigned professional
    date_of_request = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(50), nullable=False, default='requested')
    remarks = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)

    # Relationships
    service = db.relationship('Service', back_populates='service_requests')
    customer = db.relationship('User', foreign_keys=[customer_id], back_populates='customer_requests')
    professional = db.relationship('User', foreign_keys=[professional_id], back_populates='professional_requests')


# Rating model (for rating completed service requests)
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_request_id = db.Column(db.Integer, db.ForeignKey('service_request.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(500), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    service_request = db.relationship('ServiceRequest', backref=db.backref('rating', uselist=False))
