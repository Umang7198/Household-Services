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
EMAIL_HOST_USER = 'uchaudhary2022002@gmail.com'
EMAIL_HOST_PASSWORD = 'mgis xock ufhu evrh'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL='uchaudhary2022002@gmail.com'