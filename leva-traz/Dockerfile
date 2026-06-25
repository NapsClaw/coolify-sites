# Leva & Traz Fisiot — PHP Apache
# Necessário para executar gps-api.php (endpoint seguro sem token no cliente)
FROM php:8.3-apache

# Habilita mod_rewrite e headers
RUN a2enmod rewrite headers

# Configura Apache para permitir .htaccess em /var/www/html
RUN sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

# Copia todos os arquivos do site
COPY . /var/www/html/

# Permissões: www-data precisa escrever em gps-data.json
RUN chown -R www-data:www-data /var/www/html \
    && chmod 664 /var/www/html/gps-data.json \
    && chmod 755 /var/www/html

EXPOSE 80
