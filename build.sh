#!/bin/bash
REGISTRY=$1
ORGANIZATION=$2
IMAGE_NAME=$3
VERSION=$4

MAJOR=$(echo $VERSION | tr  '.' "\n" | sed -n 1p)
MINOR=$(echo $VERSION | tr  '.' "\n" | sed -n 2p)

docker build -t wurstbrot/dsomm:${MAJOR} --no-cache .
docker push wurstbrot/dsomm:${MAJOR}
docker tag wurstbrot/dsomm:${MAJOR} wurstbrot/dsomm:${MAJOR}.${MINOR}
docker push wurstbrot/dsomm:${MAJOR}.${MINOR}
docker tag wurstbrot/dsomm:${MAJOR} wurstbrot/dsomm:${VERSION}
docker push wurstbrot/dsomm:${VERSION}
docker tag wurstbrot/dsomm:${MAJOR} wurstbrot/dsomm:latest
docker push wurstbrot/dsomm:latest
