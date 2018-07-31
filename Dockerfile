FROM php:7.2-apache
RUN apt-get update && apt-get -y install apt-utils nano libyaml-dev
RUN docker-php-ext-install gettext
RUN pecl channel-update pecl.php.net && pecl install yaml-2.0.0 && docker-php-ext-enable yaml
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
