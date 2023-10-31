from connection import conn
from flask import redirect, url_for, session # Import the redirect and url_for functions

# Function to check login
def check_login(conn):
    if 'user_id' in session:
        user_id = session['user_id']

        query = "SELECT * FROM user_data WHERE user_id = %s LIMIT 1"
        cursor = conn.cursor(dictionary=True)

        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result:
            cursor.close()
            return result
        else:
            cursor.close()
            return None
    else:
        # Handle not logged in
        return None
# 'login_page' should be replaced with the actual route name for the login page in your Flask app

# Function to generate a random number
import random

def random_num(length):
    if length < 5:
        length = 5

    return ''.join(random.choice('0123456789') for _ in range(length))