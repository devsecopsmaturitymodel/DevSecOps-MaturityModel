#!/bin/bash
docker build -t gdsomm:latest .
docker run -it --rm -p 80:80 -v "$PWD":/var/www/html --name gdsom gdsomm

