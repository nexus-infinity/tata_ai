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

  # Check if there are environment variables related to username/password
  echo "Checking for sensitive environment variables (username/password):"
  env_vars=$(docker exec -it "$container_id" printenv 2>/dev/null)
  username_passwords=$(echo "$env_vars" | grep -i 'password\|user')
  
  if [[ -n "$username_passwords" ]]; then
    echo "Found sensitive environment variables:"
    echo "$username_passwords"
  else
    echo "No sensitive environment variables found."
  fi

  # Look for configuration files in common places
  echo "Checking for configuration files (e.g., .conf, .yml, .json):"
  config_files=$(docker exec -it "$container_id" find / -type f \( -name "*.conf" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null)

  if [[ -n "$config_files" ]]; then
    echo "Found configuration files:"
    echo "$config_files"
  else
    echo "No configuration files found."
  fi

  # Check for large files (over 100MB) inside the container
  echo "Looking for large files (over 100MB):"
  large_files=$(docker exec -it "$container_id" find / -type f -size +100M -exec du -sh {} \; 2>/dev/null)

  if [[ -n "$large_files" ]]; then
    echo "Found large files:"
    echo "$large_files"
  else
    echo "No large files found."
  fi

  # Determine whether the container should be kept or deleted
  echo "Do you want to keep this container? (yes/no)"
  read -p "Enter your choice: " user_choice
  if [[ "$user_choice" == "no" ]]; then
    # Optionally, stop and remove the container
    echo "Stopping and removing container: $container_name"
    docker stop "$container_id" && docker rm "$container_id"
    echo "Container $container_name has been removed."
  else
    echo "Container $container_name will be kept."
  fi

  echo "--------------------------------------------------------------------------------"
done
