from extensions import celery_app  # Import celery_app from extensions

@celery_app.task
def add(x, y):
    return "Celery Task is running"
