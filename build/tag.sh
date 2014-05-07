#!/bin/bash

if [ "$#" -ne 0 ]; then
    echo "usage: tag.sh"
    exit
fi

echo "------------------------------------------------------"
echo "Existing tags:"
echo "------------------------------------------------------"

git tag | sort --version-sort  | tail -20

echo "------------------------------------------------------"

while true; do
    echo "Please enter release version: "
    read newVersion

    echo "You entered: \"${newVersion}\", is that correct [yes/no]?"
    read confirmation

    if [ "${confirmation}" = "yes" ]; then
        echo "creating tag \"${newVersion}\""
        git tag --annotate "${newVersion}" --message "${newVersion}"
        echo "pushing tags"
        git push origin --tags
        echo "done"
        break
    fi

done



