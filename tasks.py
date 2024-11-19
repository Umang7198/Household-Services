# tasks.py
from extensions import celery_app  # Import celery_app from celeryconfig
from models import *

from datetime import datetime, timedelta
from email_utils import send_email_notification,get_monthly_activity_data, generate_monthly_report 
import csv
import os
@celery_app.task
def daily_reminder_emails():
    from app import app  

    with app.app_context():  
        professionals = User.query.filter_by(role='professional').all()
        for professional in professionals:
            # Check for pending requests
            has_pending_requests = ServiceRequest.query.filter(
                ServiceRequest.professional_id == professional.id,
                ServiceRequest.service_status.in_(['requested', 'accepted'])
            ).count() > 0

            # Send reminder if either condition is met
            if has_pending_requests:
                subject = "Daily Reminder: Pending Service Requests"
                message = f"Hello {professional.name},\n\nYou have pending service requests or have been inactive. Please log in and attend to any open requests."
                recipient_email = professional.email
                send_email_notification(subject, message, recipient_email)

    return "Reminder emails sent to professionals."


@celery_app.task
def send_monthly_report():
    from app import app  # Import your Flask app to access app context
    
    with app.app_context():
        customers = User.query.filter_by(role='customer').all()
        
        for customer in customers:
            # Get activity data specific to the customer
            activity_data = get_monthly_activity_data(customer.id)

            # Generate the HTML report
            report_html = generate_monthly_report(activity_data)

            # Send the report to the customer
            subject = f"Your Monthly Activity Report - {activity_data['month']}"
            send_email_notification(subject, report_html, customer.email)

    return "Monthly activity report sent to customers."


@celery_app.task
def export_closed_service_requests(admin_email):
    from app import app  # Import Flask app
    from config import EXPORT_FOLDER
    with app.app_context():  # Wrap the task in the application context
        # Define file name and path
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_name = f"closed_service_requests_{timestamp}.csv"
        file_path = os.path.join(EXPORT_FOLDER, file_name)
        
        # Query database for closed service requests
        closed_requests = ServiceRequest.query.filter_by(service_status='closed').all()
        
        # Open a CSV file to write
        with open(file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            # Write CSV header
            writer.writerow([
                'Service ID', 'Customer ID', 'Customer Name', 'Professional ID', 
                'Professional Name', 'Service Name', 'Date of Request', 
                'Date of Completion', 'Remarks'
            ])
            
            # Write data rows
            for request in closed_requests:
                writer.writerow([
                    request.id,
                    request.customer_id,
                    request.customer.name if request.customer else "N/A",
                    request.professional_id,
                    request.professional.name if request.professional else "N/A",
                    request.service.name if request.service else "N/A",
                    request.date_of_request.strftime('%Y-%m-%d %H:%M:%S'),
                    request.date_of_completion.strftime('%Y-%m-%d %H:%M:%S') if request.date_of_completion else "N/A",
                    request.review or "No remarks"
                ])
        
        # Send the email with the CSV file as an attachment
        subject = "Closed Service Requests Export Complete"
        message = f"Your requested CSV file is ready. Please find it attached."
        
        # Assuming send_email_notification supports attachments
        send_email_notification(subject, message, admin_email, attachment=file_path)

    return f"Export completed and file sent to {admin_email}"
