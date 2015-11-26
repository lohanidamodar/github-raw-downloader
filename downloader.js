function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
	getCurrentTabUrl(function(url) {
		var title = /([^\/]+)$/.exec(url)[1]
		var ext = /([^\.]+)$/.exec(url)[1]
		title = decodeURIComponent(title)
		url = url.replace("github.com","raw.githubusercontent.com")
		url = url.replace(/\/blob\/|\/tree\//,"/")
		renderStatus("downloading...");
		$.ajax({
		    url: url,
		    type: 'GET',
		    success: function(data) {
			var uriContent = "data:application/"+ext+"," + encodeURIComponent(data);		
			var downloadLink = document.createElement("a");
			downloadLink.href = uriContent;
			downloadLink.download = title;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
	    		}
		});
	});
});
