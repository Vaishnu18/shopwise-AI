import mysql.connector

# Database configuration
hostname = "localhost"
username = "root"
password = ""
database_name = "test"

# Create a database connection
conn = mysql.connector.connect(host=hostname, user=username, password=password, database=database_name)

#Note: In Python, you don't typically need to explicitly close the connection as it's done automatically when the script exits.