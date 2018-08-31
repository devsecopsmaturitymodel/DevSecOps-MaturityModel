#!/bin/bash
docker build -t dsomm:latest .
docker rm -f dsomm || true
docker run --rm -p 81:80 -v "$PWD":/var/www/html --name dsomm dsomm

