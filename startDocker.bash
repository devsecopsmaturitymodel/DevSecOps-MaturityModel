#!/bin/bash
docker build -t wurstbrot/dsomm:latest .
docker rm -f dsomm || true
docker run --rm -p 81:80 -v "$PWD":/var/www/html --name dsomm wurstbrot/dsomm

