#!/bin/sh

test -f phptidy.php || wget https://raw.githubusercontent.com/cmrcx/phptidy/master/phptidy.php

echo "
Reformat code according to .phptidy-config.php
in order do minimize patch differences.
"
php ./phptidy.php replace *.php data/*.php

echo "
Checking php syntax.
"
find  > /tmp/php-check.out 2>&1 . -type f -name \*.php -exec php -l {} \;
cat /tmp/php-check.out
grep 'Errors parsing' /tmp/php-check.out && exit 1 || exit 0
