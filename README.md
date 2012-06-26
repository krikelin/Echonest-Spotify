#Echonest Spotify Apps module
This is a module for Spotify apps that allows you to search for tracks on Echonest much like you do on the regular models.Search.

##Usage
In my app time machine, I previously used the models.Search like this


				var search = new models.Search("year:" + start + "-" + end +" ", {});
				search.observe(models.EVENT.CHANGE, function() {
					
					search.tracks.forEach(function(track) {
						console.log(track);
						playlist.add(track);
					});
					createPlaylist(playlist, params);
					
				});
				
Now to slipstream my search with the EchoNest database, I now use my own module 'echonest':
				
				
				...
				
				// Import echonest
				var echonest = sp.require("sp://timemachine/scripts/api/echonest");
				
				...
				
				var search = new echonest.Search(YOUR_ECHONEST_API_KEY, {
				artist_start_year_after:1991,
					artist_end_year_before:2012
				}, {pageSize:30});
				search.observe(models.EVENT.CHANGE, function() {
					
					search.tracks.forEach(function(track) {
						console.log(track);
						playlist.add(track);
					});
					createPlaylist(playlist, params);
					
				});
				search.appendNext();
				
				...