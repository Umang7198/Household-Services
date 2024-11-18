#email_utils.py
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
import os
from config import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL
from datetime import datetime, timedelta
from models import *
from email import encoders
import smtplib


def send_email_notification(subject, message, to_email, attachment=None):
    from email.utils import formataddr
    
    # Email setup
    # Create the email
    msg = MIMEMultipart()
    msg['From'] = formataddr(('Umang Chaudhary', EMAIL_HOST_USER))
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    # Attach the file if provided
    if attachment:
        try:
            # Open the file in binary mode
            with open(attachment, 'rb') as file:
                # Create the attachment part
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f"attachment; filename={os.path.basename(attachment)}")
                
                # Attach the part to the message
                msg.attach(part)
        except Exception as e:
            print(f"Failed to attach file: {e}")

    # Sending the email
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:  # Replace with your SMTP server details
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.sendmail(EMAIL_HOST_USER, to_email, msg.as_string())
            print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Error sending email: {e}")



def get_monthly_activity_data(customer_id):
    # Get the date range for the last month
    today = datetime.now()
    first_day_of_this_month = today.replace(day=1)
    last_day_of_last_month = first_day_of_this_month - timedelta(days=1)
    first_day_of_last_month = last_day_of_last_month.replace(day=1)
    
    # Query services requested by the customer in the last month
    requested_services = ServiceRequest.query.filter(
        ServiceRequest.customer_id == customer_id,
        ServiceRequest.date_of_request >= first_day_of_last_month,
        ServiceRequest.date_of_request <= last_day_of_last_month,
        ServiceRequest.service_status == 'requested'
    ).count()

    # Query services completed for the customer in the last month
    closed_services = ServiceRequest.query.filter(
        ServiceRequest.customer_id == customer_id,
        ServiceRequest.date_of_completion >= first_day_of_last_month,
        ServiceRequest.date_of_completion <= last_day_of_last_month,
        ServiceRequest.service_status == 'closed'
    ).count()

    # Get additional data for the report if needed, such as ratings and feedback
    rated_services = ServiceRequest.query.filter(
        ServiceRequest.customer_id == customer_id,
        ServiceRequest.date_of_completion >= first_day_of_last_month,
        ServiceRequest.date_of_completion <= last_day_of_last_month,
        ServiceRequest.rating.isnot(None)
    ).all()
    
    # Calculate average rating for the closed services in the month
    avg_rating = (
        sum(request.rating for request in rated_services) / len(rated_services)
        if rated_services else 0.0
    )
    return {
        "requested_services": requested_services,
        "closed_services": closed_services,
        "avg_rating": avg_rating,
        "month": last_day_of_last_month.strftime("%B %Y")  # e.g., "October 2024"
    }


def generate_monthly_report(data):
    # Format the message as a plain-text string
    avg_rating = round(data['avg_rating'], 2) if data['avg_rating'] is not None else 'No ratings yet'

    text_report = f"""
    Monthly Activity Report - {data['month']}

    Dear Customer,

    Here is your activity report for the month of {data['month']}:

    - Total Services Requested: {data['requested_services']}
    - Total Services Completed: {data['closed_services']}
    - Average Rating for Closed Services: 
     {avg_rating}/5

    Thank you for using our service!

    Best Regards,
    ServiceX Team
        """
    return text_report
