#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "usage: tag.sh [tag name]"
    exit
fi

git tag --annotate "$1" --message "$1"

git push origin --tags
