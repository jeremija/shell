define([], function() {

	function serializeBody(body) {
		var params = [];
		for(var key in body) {
			var value = body[key];
			key = encodeURIComponent(key);
			value = encodeURIComponent(value);
			params.push(key + '=' + value);
		}
		return params.join('&');
	}

	return {
		_send: function(method, url, config, callback) {
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

			xmlhttp.open(method, url, true);
			if (config && config.headers) {
				for(var key in config.headers) {
					var value = config.headers[key];
					xmlhttp.setRequestHeader(key, value);
				}
			}
			if (method == 'POST' && config && config.body) {
				var body = serializeBody(config.body);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				// xmlhttp.setRequestHeader("Content-length", body.length);
				// http.setRequestHeader("Connection", "close");
				xmlhttp.send(body);
			}
			else xmlhttp.send();
		},
		get: function(url, config, callback) {
			this._send('GET', url, config, callback);
		},
		post: function(url, config, callback) {
			this._send('POST', url, config, callback);
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