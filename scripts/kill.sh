#!/bin/sh

. scripts/console.sh

info "Killing all Docker containers"
docker kill $(docker ps -aq) 2>/dev/null
info "Removing all Docker containers"
# docker rm -f $(docker ps -aq) 2>/dev/null
docker container prune -f