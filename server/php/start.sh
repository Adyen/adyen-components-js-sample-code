if [ -e .env ]
then
    export $(grep -v '^#' .env | xargs)
    php -S localhost:4000 -t src/ server/php/index.php
else
    echo ".env File was not found. Create a .env file in the root folder of the project following the example in .env.default"
fi
