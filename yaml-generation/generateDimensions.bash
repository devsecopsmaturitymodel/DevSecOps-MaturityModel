#!/bin/bash

docker run --rm --interactive --tty   --volume $PWD/:/app   --user $(id -u):$(id -g)   composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

cd ..
docker run --rm --volume $PWD/:/app php:apache-buster bash -c 'apt-get update && apt-get -y dist-upgrade && apt-get -y install apt-utils libyaml-dev wget && pecl channel-update pecl.php.net && pecl install yaml && docker-php-ext-enable yaml && cd /app/ && php yaml-generation/generateDimensions.php'