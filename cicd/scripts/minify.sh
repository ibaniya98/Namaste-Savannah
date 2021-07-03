#!/bin/bash

function usage() {
    echo "Usage: $0 path/to/file
    Example:
        $0 ./public/js/main.js -> Minify main.js file
        $0 ./public/css/*.css -> Minify all css files under public/css
        "
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

file=$1

for filename in ${file}; do
    echo "$filename"
    yui-compressor "$filename" -o "${filename}"  --preserve-semi
    cat "$filename"
done