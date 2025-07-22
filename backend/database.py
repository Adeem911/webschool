import mysql.connector
from mysql.connector import Error
from config import Config

class Database:
    def __init__(self):
        self.config = {
            'host': Config.MYSQL_HOST,
            'database': Config.MYSQL_DB,
            'user': Config.MYSQL_USER,
            'password': Config.MYSQL_PASSWORD
        }
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(**self.config)
            if self.connection.is_connected():
                print('Connected to MySQL database')
        except Error as e:
            print(f'Error connecting to MySQL: {e}')

    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print('Disconnected from MySQL database')

    def execute_query(self, query, params=None, fetch_one=False):
        cursor = None
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if query.strip().lower().startswith('select'):
                if fetch_one:
                    return cursor.fetchone()
                return cursor.fetchall()
            else:
                self.connection.commit()
                if query.strip().lower().startswith('insert'):
                    return cursor.lastrowid
                return cursor.rowcount
        except Error as e:
            print(f'Error executing query: {e}')
            return None
        finally:
            if cursor:
                cursor.close()