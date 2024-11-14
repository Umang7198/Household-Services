# email_utils.py
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

def send_email_notification(to_email, subject, message):
    msg = MIMEMultipart()
    msg['From'] = DEFAULT_FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    try:
        with SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.sendmail(DEFAULT_FROM_EMAIL, to_email, msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
