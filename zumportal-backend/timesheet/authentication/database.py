import psycopg2
from faker import Faker
import random

# Initialize Faker to generate random data
fake = Faker()

# Connect to PostgreSQL database
# Update the connection details as per your PostgreSQL setup
conn = psycopg2.connect(
    dbname="hrm_database",
    user="postgres",
    password="0000",
    host="localhost"
)
c = conn.cursor()

# Create tables
c.execute('''CREATE TABLE IF NOT EXISTS department (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
             )''')

c.execute('''CREATE TABLE IF NOT EXISTS role (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                department_id INTEGER,
                FOREIGN KEY (department_id) REFERENCES department (id)
             )''')

c.execute('''CREATE TABLE IF NOT EXISTS employee (
                id SERIAL PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role_id INTEGER,
                FOREIGN KEY (role_id) REFERENCES role (id)
             )''')

# Commit the transaction
conn.commit()

# Function to insert sample data into the department table
def insert_departments():
    departments = ['IT', 'Human Resources', 'Finance', 'Marketing', 'Sales']
    for department in departments:
        c.execute('INSERT INTO department (name) VALUES (%s) ON CONFLICT (name) DO NOTHING', (department,))

    conn.commit()

insert_departments()

# Insert roles for each department
def insert_roles():
    roles = ['Manager', 'Assistant', 'Specialist', 'Coordinator']
    c.execute('SELECT id, name FROM department')
    department_data = c.fetchall()

    for department_id, department_name in department_data:
        for role in roles:
            c.execute('INSERT INTO role (name, department_id) VALUES (%s, %s)', (role, department_id))
    
    conn.commit()

insert_roles()

# Function to generate and insert employees
def insert_employees(num=10):
    c.execute('SELECT id FROM role')
    role_ids = [row[0] for row in c.fetchall()]

    for _ in range(num):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        role_id = random.choice(role_ids)
        # Note the change in placeholder from '?' to '%s' for psycopg2
        c.execute('INSERT INTO employee (first_name, last_name, email, role_id) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING', 
                  (first_name, last_name, email, role_id))
    
    conn.commit()

insert_employees(5000)  # Adjust the number of employees as needed

# Close the connection
conn.close()

print("Database and sample data created successfully.")
