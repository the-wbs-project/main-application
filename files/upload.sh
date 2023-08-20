curl -X PUT -d @./resources-en.json -H "Content-Type: application/json" $1/api/resources

curl -X PUT -d @./lists.actions.json -H "Content-Type: application/json" $1/api/lists/actions

curl -X PUT -d @./lists.categories_phase.json -H "Content-Type: application/json" $1/api/lists/categories_phase
