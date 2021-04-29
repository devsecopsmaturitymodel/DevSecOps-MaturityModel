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
ADD data-new/  /app/data-new
ADD scripts/merge-dimensions.py   /app/scripts/merge-dimensions.py
WORKDIR /app
RUN pip install pyyaml 
RUN python3 ./scripts/merge-dimensions.py

FROM php:8.0.3-apache
RUN apt-get update && apt-get -y dist-upgrade && apt-get -y install apt-utils libyaml-dev wget
RUN docker-php-ext-install gettext
RUN pecl channel-update pecl.php.net && pecl install yaml-2.2.1 && docker-php-ext-enable yaml
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
COPY . /var/www/html/
RUN chmod 777 /var/www/html/selectedData.csv
COPY --from=vendor /app/vendor/ /var/www/html/vendor/
COPY --from=parser /app/data/dimensions.yaml /var/www/html/data/dimensions.yaml

