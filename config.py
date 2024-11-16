# config.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os


app = Flask(__name__, template_folder="templates",static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = 'secret'

db = SQLAlchemy(app)


# config.py
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = '21f3001035@ds.study.iitm.ac.in'
EMAIL_HOST_PASSWORD = 'mvxf aksn iijx cnyz'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL='21f3001035@ds.study.iitm.ac.in'