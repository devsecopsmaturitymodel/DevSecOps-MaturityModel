#!/bin/bash
set -e

docker build -t wurstbrot/dsomm:latest .
docker rm -f dsomm || true

docker run --rm -p 81:80 --name dsomm wurstbrot/dsomm
#docker run --rm -p 81:80 -v "$PWD":/var/www/html --name dsomm wurstbrot/dsomm
