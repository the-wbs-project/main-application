curl -X PUT -v -d @./checklists.json -H "Content-Type: application/json" $1/api/checklists
echo ''
echo ''
curl -X PUT -v -d @./resources-en.json -H "Content-Type: application/json" $1/api/resources
echo ''
echo ''
curl -X PUT -v -d @./lists.actions.json -H "Content-Type: application/json" $1/api/lists/actions
echo ''
echo ''
curl -X PUT -v -d @./lists.categories_phase.json -H "Content-Type: application/json" $1/api/lists/categories_phase
echo ''
echo ''
curl -X PUT -v -d @./lists.categories_discipline.json -H "Content-Type: application/json" $1/api/lists/categories_discipline
echo ''
echo ''
curl -X PUT -v -d @./lists.delete_reasons.json -H "Content-Type: application/json" $1/api/lists/delete_reasons
echo ''
echo ''
curl -X PUT -v -d @./lists.project_category.json -H "Content-Type: application/json" $1/api/lists/project_category
echo ''
echo ''
echo 'Done'