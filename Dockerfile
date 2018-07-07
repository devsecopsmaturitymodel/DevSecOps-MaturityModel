FROM php:7.2-apache
RUN docker-php-ext-install gettext
RUN apt-get update && apt-get -y install libyaml-dev

RUN pecl channel-update pecl.php.net && pecl install yaml-2.0.0 && docker-php-ext-enable yaml