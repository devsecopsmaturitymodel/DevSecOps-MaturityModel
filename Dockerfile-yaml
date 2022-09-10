FROM php:apache-buster
RUN  apt-get update && apt-get -y install apt-utils libyaml-dev wget unzip && wget -O composer-setup.php https://getcomposer.org/installer && php composer-setup.php --install-dir=/usr/local/bin --filename=composer
COPY yaml-generation /var/www/html/yaml-generation
COPY src /var/www/html/src
RUN cd /var/www/html/yaml-generation && composer install \
--ignore-platform-reqs \
--no-interaction \
--no-plugins \
--no-scripts \
--prefer-dist


RUN pecl channel-update pecl.php.net && pecl install yaml && docker-php-ext-enable yaml
RUN cd /var/www/html && php yaml-generation/generateDimensions.php
workdir /var/www/html
CMD php yaml-generation/generateDimensions.php