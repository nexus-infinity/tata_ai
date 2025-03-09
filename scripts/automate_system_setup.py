import os
import psycopg2
import pymongo
import mysql.connector
from cryptography.fernet import Fernet

# Generate and store encryption key for password security
def generate_key():
    return Fernet.generate_key()

# Encrypt a password
def encrypt_password(password, key):
    cipher_suite = Fernet(key)
    return cipher_suite.encrypt(password.encode()).decode()

# Decrypt a password
def decrypt_password(encrypted_password, key):
    cipher_suite = Fernet(key)
    return cipher_suite.decrypt(encrypted_password.encode()).decode()

# Generate automated naming and numbering system for each core
def generate_core_name(core_name, db_type):
    return f"{core_name}_{db_type}".upper()

# Set up PostgreSQL database
def setup_postgresql_db(user, password, db_name, host, port):
    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
        )
        print(f"PostgreSQL DB '{db_name}' setup successful.")
        conn.close()
    except Exception as e:
        print(f"Error setting up PostgreSQL DB: {e}")

# Set up MongoDB database
def setup_mongodb_db(user, password, db_name, host, port):
    try:
        client = pymongo.MongoClient(f"mongodb://{user}:{password}@{host}:{port}/")
        db = client[db_name]
        print(f"MongoDB DB '{db_name}' setup successful.")
        client.close()
    except Exception as e:
        print(f"Error setting up MongoDB DB: {e}")

# Set up MySQL database
def setup_mysql_db(user, password, db_name, host, port):
    try:
        conn = mysql.connector.connect(
            user=user,
            password=password,
            host=host,
            database=db_name,
            port=port
        )
        print(f"MySQL DB '{db_name}' setup successful.")
        conn.close()
    except Exception as e:
        print(f"Error setting up MySQL DB: {e}")

# Main function to automate all steps
def automate_system_setup():
    # Define credentials and naming conventions
    core_names = ["Tata-CORE", "Tata-FLOW", "Tata-MEMEX", "Tata-MOTO", "Tata-ZKP"]
    db_types = ["db_user", "db_password", "db_name", "db_host", "db_port"]
    
    # Generate encryption key for secure password storage
    key = generate_key()
    
    # Loop through each core and set up corresponding database
    for core in core_names:
        print(f"Setting up {core}...")
        
        # Database-specific credentials and information
        user = f"{core.lower()}_admin"
        password = f"Rouge74"  # Replace with your password manager if needed
        db_name = f"{core.lower()}_db"
        host = "localhost"
        port = 5432 if "CORE" in core else 27017 if "MEMEX" in core else 3306
        
        # Encrypt password
        encrypted_password = encrypt_password(password, key)
        
        # Store credentials securely (in your case, you'd store this in a secure location or vault)
        print(f"Storing encrypted password for {core}...")
        
        # Set up databases
        if "CORE" in core:
            setup_postgresql_db(user, encrypted_password, db_name, host, port)
        elif "MEMEX" in core:
            setup_mongodb_db(user, encrypted_password, db_name, host, port)
        elif "MOTO" in core:
            setup_mysql_db(user, encrypted_password, db_name, host, port)
        else:
            print(f"Unknown core type: {core}")

# Execute the setup process
if __name__ == "__main__":
    automate_system_setup()
