#!/bin/bash

set -e

attempts=0
maxAttempts=10
status=$(nc -z localhost 9042; echo $?)
echo -n "Waiting for database..."

while [ $status != 0 ] && [ "$attempts" -lt "$maxAttempts" ]
do
    sleep 1s
    status=$(nc -z localhost 5432; echo $?)
    echo -n "."
    ((++attempts))
done

sleep 1
echo "Database is up!"
