import os
import subprocess
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import time

# Define the directory to save the reports
output_dir = './docker_container_reports'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Get container list
container_ids = subprocess.getoutput("docker ps -aq").splitlines()

def get_container_details(container_id):
    # Retrieve basic information about the container
    container_name = subprocess.getoutput(f"docker inspect --format '{{{{.Name}}}}' {container_id}").strip("/")
    container_image = subprocess.getoutput(f"docker inspect --format '{{{{.Config.Image}}}}' {container_id}")
    
    # Check for large files
    large_files = subprocess.getoutput(f'docker exec -i {container_id} find / -type f -size +100M -exec du -sh {{}} \; 2>/dev/null')
    
    # Check for database files
    db_files = subprocess.getoutput(f'docker exec -i {container_id} find / -type f -name "*.db" -o -name "*.sqlite" -o -name "*.mdb" -exec du -sh {{}} \; 2>/dev/null')
    
    # Check for configuration files
    config_files = subprocess.getoutput(f'docker exec -i {container_id} find / -type f -name "*.conf" -o -name "*.yml" -o -name "*.json" -exec du -sh {{}} \; 2>/dev/null')
    
    return container_name, container_image, large_files, db_files, config_files

def generate_pdf(container_data):
    # Define the filename for the report
    container_name = container_data['container_name']
    pdf_filename = os.path.join(output_dir, f"{container_name}_report.pdf")

    # Create a canvas for the PDF
    c = canvas.Canvas(pdf_filename, pagesize=letter)
    c.setFont("Helvetica", 10)
    
    # Add Title
    c.setFont("Helvetica-Bold", 14)
    c.drawString(30, 750, f"Container Report: {container_name}")
    
    # Add Container Image Info
    c.setFont("Helvetica", 10)
    c.drawString(30, 730, f"Container Image: {container_data['container_image']}")
    
    # Add large files
    c.drawString(30, 710, "Large Files (over 100MB):")
    c.setFont("Helvetica", 8)
    y_position = 695
    for line in container_data['large_files'].splitlines():
        c.drawString(30, y_position, line)
        y_position -= 12

    # Add database files
    c.setFont("Helvetica", 10)
    c.drawString(30, y_position, "Database Files:")
    y_position -= 15
    for line in container_data['db_files'].splitlines():
        c.drawString(30, y_position, line)
        y_position -= 12

    # Add configuration files
    c.setFont("Helvetica", 10)
    c.drawString(30, y_position, "Configuration Files:")
    y_position -= 15
    for line in container_data['config_files'].splitlines():
        c.drawString(30, y_position, line)
        y_position -= 12

    # Save PDF
    c.save()

def main():
    for container_id in container_ids:
        container_name, container_image, large_files, db_files, config_files = get_container_details(container_id)
        
        container_data = {
            'container_name': container_name,
            'container_image': container_image,
            'large_files': large_files,
            'db_files': db_files,
            'config_files': config_files
        }
        
        generate_pdf(container_data)
        print(f"Report generated for container: {container_name}")

if __name__ == "__main__":
    main()
