#!/bin/bash
docker build -t gdosmm .
docker run -it --rm -p 80:80 -v "$PWD":/var/www/html --name gdsomm gdsomm

