var couch = require('couch.js');
// View the _stats of github_repos db.
var repos_stats = (function(){
	return {
		name: 'get_next_repo',
		map: 'function(doc){if (doc && doc.id) emit(doc.id);}',
		reduce: '_stats'
	};
});