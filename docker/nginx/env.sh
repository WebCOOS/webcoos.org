#!/bin/sh

echo "Injecting runtime environment variables into JS/JSON files..."

VARS_TO_REPLACE="$(printf '${%s} ' $(env | grep -ie "^TWOWOLVES_" | cut -d'=' -f1))"

echo "Env vars to replace: $VARS_TO_REPLACE"

find /usr/share/nginx/html \
    -type f \
    \( -name '*.json' -o -name "*.js" \) \
    | while read -r line; do \
        # echo "$line";
        envsubst "$VARS_TO_REPLACE" < "$line" > "$line.replaced";
        orig_md5=$( md5sum "$line" | awk '{ print $1 }' )
        new_md5=$( md5sum "$line.replaced" | awk '{ print $1 }' )

        if [ "$orig_md5" != "$new_md5" ]; then
            mv -v "$line.replaced" "$line"
        else
            rm "$line.replaced";
        fi

    done