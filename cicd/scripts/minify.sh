#!/bin/bash

function usage() {
    echo "Usage: $0 path/to/file
    Example:
        $0 ./public/css/main.css -> Minify main.css file
        $0 ./public/css/*.css -> Minify all css files under public/css
        "
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

file=$1

for filename in ${file}; do
    yui-compressor "$filename"
done