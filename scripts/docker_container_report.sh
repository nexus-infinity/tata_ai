#!/bin/bash

# Directories to save reports
REPORT_DIR="./docker_container_reports"
mkdir -p "$REPORT_DIR"

# Loop through containers
for container_id in $(docker ps -q); do
    container_name=$(docker inspect --format '{{.Name}}' $container_id | sed 's/\///g')
    container_image=$(docker inspect --format '{{.Config.Image}}' $container_id)
    echo "Container Name: $container_name"
    echo "Container Image: $container_image"

    # Generate report
    report_file="$REPORT_DIR/$container_name-report.txt"
    echo "Container Report for $container_name" > $report_file
    echo "--------------------------------------------------------------------------------" >> $report_file

    # Check for sensitive environment variables (username/password)
    echo "Checking for sensitive environment variables (username/password)..." >> $report_file
    sensitive_vars=$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' $container_id | grep -i 'password\|username')
    if [[ -n "$sensitive_vars" ]]; then
        echo "Sensitive environment variables found:" >> $report_file
        echo "$sensitive_vars" >> $report_file
    else
        echo "No sensitive environment variables found." >> $report_file
    fi

    # Check for configuration files (e.g., .conf, .yml, .json)
    echo "Checking for configuration files (e.g., .conf, .yml, .json)..." >> $report_file
    config_files=$(docker exec -i $container_id find / -type f \( -name "*.conf" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null)
    if [[ -n "$config_files" ]]; then
        echo "Configuration files found:" >> $report_file
        echo "$config_files" >> $report_file
    else
        echo "No configuration files found." >> $report_file
    fi

    # Find large files (over 100MB)
    echo "Looking for large files (over 100MB)..." >> $report_file
    large_files=$(docker exec -i $container_id find / -type f -size +100M -exec du -sh {} \; 2>/dev/null)
    if [[ -n "$large_files" ]]; then
        echo "Large files found:" >> $report_file
        echo "$large_files" >> $report_file
    else
        echo "No large files found." >> $report_file
    fi

    # Check for database files (.db, .sqlite, .mdb)
    echo "Checking for database files (.db, .sqlite, .mdb)..." >> $report_file
    db_files=$(docker exec -i $container_id find / -type f \( -name "*.db" -o -name "*.sqlite" -o -name "*.mdb" \) 2>/dev/null)
    if [[ -n "$db_files" ]]; then
        echo "Database files found:" >> $report_file
        echo "$db_files" >> $report_file
    else
        echo "No database files found." >> $report_file
    fi

    # Database-specific actions (MongoDB, Redis)
    if [[ "$container_image" == *"mongo"* ]]; then
        echo "MongoDB detected. Checking for database schema..." >> $report_file
        docker exec -i $container_id mongo --eval "db.getMongo().getDBNames();" >> $report_file
    elif [[ "$container_image" == *"redis"* ]]; then
        echo "Redis detected. Checking for stored keys..." >> $report_file
        docker exec -i $container_id redis-cli keys '*' >> $report_file
    fi

    # Final report
    echo "Report generated and saved for container $container_name at $report_file"
    echo "--------------------------------------------------------------------------------" >> $report_file
done

echo "Analysis complete. All reports saved to $REPORT_DIR."
