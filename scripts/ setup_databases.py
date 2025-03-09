import json
import pymysql
import psycopg2
import redis
from pymongo import MongoClient

# Load config
with open("config.json", "r") as file:
    config = json.load(file)

# Function to create PostgreSQL databases
def create_postgres_db(db_name, user, password):
    conn = psycopg2.connect(host="127.0.0.1", user="postgres", password="your_postgres_root_password")
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE {db_name};")
    cursor.execute(f"CREATE USER {user} WITH PASSWORD '{password}';")
    cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {user};")
    print(f"✅ PostgreSQL: Created database {db_name} for user {user}")
    conn.close()

# Function to create MySQL databases
def create_mysql_db(db_name, user, password):
    conn = pymysql.connect(host="127.0.0.1", user="root", password="your_mysql_root_password")
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE {db_name};")
    cursor.execute(f"CREATE USER '{user}'@'localhost' IDENTIFIED BY '{password}';")
    cursor.execute(f"GRANT ALL PRIVILEGES ON {db_name}.* TO '{user}'@'localhost';")
    print(f"✅ MySQL: Created database {db_name} for user {user}")
    conn.close()

# Function to create MongoDB databases
def create_mongo_db(db_name):
    client = MongoClient("mongodb://127.0.0.1:27017")
    db = client[db_name]
    db.create_collection("test")
    print(f"✅ MongoDB: Created database {db_name}")

# Loop through config and create databases
for service, settings in config.items():
    db_type = settings["DB_TYPE"]
    db_name = settings.get("DB_NAME", "")
    db_user = settings.get("DB_USER", "")
    db_password = settings.get("DB_PASSWORD", "")

    if db_type == "postgres":
        create_postgres_db(db_name, db_user, db_password)
    elif db_type == "mysql":
        create_mysql_db(db_name, db_user, db_password)
    elif db_type == "mongodb":
        create_mongo_db(db_name)
    elif db_type == "redis":
        print(f"✅ Redis: No database creation needed for {service}")

print("\n🎉 All databases have been created!")
