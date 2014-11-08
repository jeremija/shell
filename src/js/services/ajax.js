define([], function() {

	return {
		get: function(url, config, callback) {
			var xmlhttp;

			if (window.XMLHttpRequest) {
				// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			} else {
				// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}


			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState !== 4 ) return;

				if(xmlhttp.status == 200) callback(undefined, xmlhttp.responseText);
				else callback(new Error('Got status: ' + xmlhttp.status));
			};

			xmlhttp.open("GET", url, true);
			if (config && config.headers) {
				for(var key in config.headers) {
					var value = config.headers[key];
					xmlhttp.setRequestHeader(key, value);
				}
			}
			xmlhttp.send();
		},
		json: function(url, config, callback) {
			this.get(url, config, function(err, response) {
				if (err) {
					callback(err);
					return;
				}
				var json;
				try {
					json = JSON.parse(response);
				}
				catch(e) {
					callback(e);
					return;
				}
				callback(undefined, json);
			});
		},
		xml: function(url, config, callback) {
			this.get(url, config, function(err, response) {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, response);
			});
		}
	};

});