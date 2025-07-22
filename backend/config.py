import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'adeemchu911')
    MYSQL_DB = os.getenv('MYSQL_DB', 'student_portal')
    SECRET_KEY = os.getenv('SECRET_KEY', 'f2d3c5a9b48fba0e1d6c37cfe62b49e')