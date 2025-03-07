# Use an appropriate base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the source code from the src/tata-zkp directory into the container
COPY ./src/tata-zkp /app

# Copy requirements.txt from the docker/tata-zkp directory into the container
COPY ./docker/tata-zkp/requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Command to run the application (using app.py)
CMD ["python", "/app/app.py"]