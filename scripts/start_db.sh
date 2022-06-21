#!/bin/bash
docker-compose -f ./src/db/compose.yaml --env-file ./.env up -d
