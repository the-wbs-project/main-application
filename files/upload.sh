curl -X PUT -d @./resources-en.json -H "Content-Type: application/json" $1/api/resources
curl -X PUT -d @./lists.actions.json -H "Content-Type: application/json" $1/api/lists/actions
curl -X PUT -d @./lists.categories_phase.json -H "Content-Type: application/json" $1/api/lists/categories_phase
curl -X PUT -d @./lists.categories_discipline.json -H "Content-Type: application/json" $1/api/lists/categories_discipline
curl -X PUT -d @./lists.delete_reasons.json -H "Content-Type: application/json" $1/api/lists/delete_reasons
curl -X PUT -d @./lists.project_category.json -H "Content-Type: application/json" $1/api/lists/project_category
