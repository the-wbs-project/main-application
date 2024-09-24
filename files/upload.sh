echo 'checklists.json'
curl -X PUT -d @./checklists.json -H "Content-Type: application/json" $1/api/checklists

echo 'resources-en.json'
curl -X PUT -d @./resources-en.json -H "Content-Type: application/json" $1/api/resources

echo 'lists.actions.json'
curl -X PUT -d @./lists.actions.json -H "Content-Type: application/json" $1/api/lists/actions

echo 'lists.categories_phase.json'
curl -X PUT -d @./lists.categories_phase.json -H "Content-Type: application/json" $1/api/lists/categories_phase

echo 'lists.categories_discipline.json'
curl -X PUT -d @./lists.categories_discipline.json -H "Content-Type: application/json" $1/api/lists/categories_discipline

echo 'lists.delete_reasons.json'
curl -X PUT -d @./lists.delete_reasons.json -H "Content-Type: application/json" $1/api/lists/delete_reasons

echo 'lists.project_category.json'
curl -X PUT -d @./lists.project_category.json -H "Content-Type: application/json" $1/api/lists/project_category
echo 'Done'