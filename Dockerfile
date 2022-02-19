FROM composer AS vendor
COPY composer.json composer.json
COPY composer.lock composer.lock
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

FROM php:apache-buster
RUN apt-get update && apt-get -y dist-upgrade && apt-get -y install apt-utils libyaml-dev wget
RUN pecl channel-update pecl.php.net && pecl install yaml && docker-php-ext-enable yaml
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
COPY . /var/www/html/
RUN chmod 777 /var/www/html/selectedData.csv
COPY --from=vendor /app/vendor/ /var/www/html/vendor/
RUN ENFORCE_DATA_GENERATION_DURING_RUNTIME=true php data/generateDimensions.php && chmod -R 777 data/generated
