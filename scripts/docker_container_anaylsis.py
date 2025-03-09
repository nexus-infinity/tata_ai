#!/bin/bash

# Start by listing all Docker images and checking for the relevant details
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedAt}}"

echo "--------------------------------------------------------------------------------"

# Loop through all containers to check for details
for container_id in $(docker ps -a -q); do
  echo "Container ID: $container_id"
  echo "--------------------"

  # Get the container name and image it uses
  container_name=$(docker inspect --format '{{.Name}}' $container_id | sed 's/\///')
  container_image=$(docker inspect --format '{{.Config.Image}}' $container_id)

  echo "Container Name: $container_name"
  echo "Container Image: $container_image"

  # Start report output
  report="Container Report for $container_name ($container_image)\n"
  report+="--------------------------------------------------------------------------------\n"

  # Check if there are environment variables related to username/password
  report+="Checking for sensitive environment variables (username/password):\n"
  env_vars=$(docker exec -it "$container_id" printenv 2>/dev/null)
  username_passwords=$(echo "$env_vars" | grep -i 'password\|user')
  
  if [[ -n "$username_passwords" ]]; then
    report+="Found sensitive environment variables:\n$username_passwords\n"
  else
    report+="No sensitive environment variables found.\n"
  fi

  # Look for configuration files in common places
  report+="Checking for configuration files (e.g., .conf, .yml, .json):\n"
  config_files=$(docker exec -it "$container_id" find / -type f \( -name "*.conf" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null)

  if [[ -n "$config_files" ]]; then
    report+="Found configuration files:\n$config_files\n"
  else
    report+="No configuration files found.\n"
  fi

  # Check for large files (over 100MB) inside the container
  report+="Looking for large files (over 100MB):\n"
  large_files=$(docker exec -it "$container_id" find / -type f -size +100M -exec du -sh {} \; 2>/dev/null)

  if [[ -n "$large_files" ]]; then
    report+="Found large files:\n$large_files\n"
  else
    report+="No large files found.\n"
  fi

  # Checking for specific file types (database files, .db, .sqlite, .mdb)
  report+="Checking for database files (e.g., .db, .sqlite, .mdb):\n"
  database_files=$(docker exec -it "$container_id" find / -type f -name "*.db" -o -name "*.sqlite" -o -name "*.mdb" -exec du -sh {} \; 2>/dev/null)

  if [[ -n "$database_files" ]]; then
    report+="Found database files:\n$database_files\n"
  else
    report+="No database files found.\n"
  fi

  # Output the report to a file or display
  report_file="./docker_container_reports/$container_name-report.txt"
  mkdir -p $(dirname $report_file)
  echo -e "$report" > "$report_file"

  echo "Report generated for container $container_name at $report_file"

  echo "--------------------------------------------------------------------------------"
done
