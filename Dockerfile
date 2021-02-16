FROM composer AS vendor
COPY composer.json composer.json
COPY composer.lock composer.lock
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

FROM python:3 AS parser
RUN mkdir /app/data -p
ADD data-new/  /app/
ADD scripts/merge-dimensions.py   /app/
WORKDIR /app
RUN pip install pyyaml 
RUN python3 ./merge-dimensions.py

FROM php:7.2-apache
RUN apt-get update && apt-get -y install apt-utils libyaml-dev
RUN docker-php-ext-install gettext
RUN pecl channel-update pecl.php.net && pecl install yaml-2.0.0 && docker-php-ext-enable yaml
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
COPY . /var/www/html/
COPY --from=vendor /app/vendor/ /var/www/html/vendor/
COPY --from=parser /app/data/dimensions.yaml /var/www/html/data/dimensions.yaml

