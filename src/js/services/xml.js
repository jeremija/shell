define([], function() {

	function parse(text) {
		var xmlDocument;
		if (window.DOMParser) {
			parser = new DOMParser();
			xmlDocument = parser.parseFromString(text, 'application/xml');
		}
		else {
			// code for IE
			xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
			xmlDocument.async = false;
			return xmlDocument.loadXML(text);
		}
		return xmlDocument;
	}

	return parse;

});