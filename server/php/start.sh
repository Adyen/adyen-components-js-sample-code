export $(grep -v '^#' .env | xargs)
php -S localhost:3000 -t src/ server/php/index.php
