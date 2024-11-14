# tasks.py
from extensions import celery_app  # Import celery_app from celeryconfig
from models import *
from datetime import datetime, timedelta
from send_notification import send_email_notification  # Assuming you have a send_email function for sending emails

@celery_app.task
def daily_reminder_emails():
    from app import app  # Import app to use its context

    with app.app_context():  # Ensure we have Flask application context
        # Set inactivity threshold (e.g., professionals inactive for 7 days)

        # Query professionals with pending service requests or who have been inactive
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
