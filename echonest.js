/***************
@module echonest
***/
var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");

function toQuerystring(params) {
	var c = "";
	for(var key in params) {
		c += key + "=" + encodeURI(params[key]) + "&";
	}
	return c;
}
exports.EVENT = {
	CHANGE : 0x01
};
/***
@class Search
@implements Observerable
***/
exports.Search = function(api_key, params) {
	var _observers = [];
	this.__defineGetter__("observers", function () {
		return _observers;
	});
	var trackList = [];
	this.__defineGetter__("tracks", function () {
		return trackList;
	});
	this.notify = function(event, data) {
		for(var i = 0; i < _observers.length; i++) {
			var observer = _observers[i];
			if(event == observer.event) {
				observer.observer.call(event, observer.data);
			}
		}
	};
	var _notify = this.notify;
	this.observe = function(event, observer) {
		var observer_ = {
			event: event,
			observer: observer
		};
		this.observers.push(observer_);
	};
	this.ignore = function(event, observer) {
		if(typeof(observer) === "undefined") {
			for(var i = 0; i < this.observers.length; i++) {
			
				if(oberver.event == event) {
					_observers.remove(observer);
				}
			}
		} else {
			_observers.remove(observer);
		}	
	};
	var resultIndex = 0; // ResultIndex
	this.baseUri = "http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "";
	
	this.baseUri+="&" + toQuerystring(params) + "&start={page}&bucket=tracks&bucket=id:spotify-WW";
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4) {
			if(xmlHttp.status == 200) {
				var data = eval("(" + xmlHttp.responseText + ")");
				resultIndex++; // Increase resultindex
			
				console.log(data);
				var currentIndex = 0;
				// Response
				var count = 0;
				
				// Enumerate all content
				for(var x = 0; x < data.response.songs.length; x++) {
					var song = data.response.songs[x];
					var tracks = song.tracks;
					for(var i = 0; i < tracks.length; i++) {
						count++;
					}
				}
			
				for(var x = 0; x < data.response.songs.length; x++) {
					 // The count of elements in the result
			
					var song = data.response.songs[x];
					
				
					for(var n = 0; n < song.tracks.length; n++) {
						var track =  song.tracks[n];
						console.log(song);
						var id = track.foreign_id;						// Grab the ID
						var uri = id.replace("spotify-WW:","spotify:"); // Convert to REAL spotify URI
							
						console.log(uri);
							// Lockup the song on Spotify
						models.Track.fromURI(uri, function(track) {
							
							trackList.push(track);
							currentIndex++;
							console.log(currentIndex + " " + count);
							// I will measure so it will raise the callback when this pointer is increaesd to the count:
							if(currentIndex >= count -1) {
								_notify(models.EVENT.CHANGE, null);
							}
							
						});
					}
				}
			}
		} else {
		}
	};

	this.appendNext = function () {
		console.log(this.baseUri.replace("{page}", resultIndex));
		xmlHttp.open("GET", this.baseUri.replace("{page}", resultIndex), true);
		xmlHttp.send(null);
	};
};