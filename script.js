var apiKey = 'AIzaSyCmLE0CXrcYwlIEfF1nT2PwWWW76c-85_w';

// Use a button to handle authentication the first time.
function handleClientLoad(userId) {
	gapi.client.setApiKey(apiKey);
	makeApiCall(userId);
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall(userId) {
	gapi.client.load('plus', 'v1', function() {
		var posts_request = gapi.client.plus.activities.list({
			'userId': userId,
			'collection': 'public',
			'maxResults': 20,
			'fields': 'items(location(address,displayName,position),object/content,url)'
		});
		var user_request = gapi.client.plus.people.get({
			'userId': userId
		});
		posts_request.execute(function(resp) {
			if (!resp.error) {
				print_posts(resp.items);
			} else {
				alert("Error al realizar la petición");
			}
		});

		user_request.execute(function(resp) {
			if (!resp.error) {
				print_user(resp);
			} else {
				alert("Error al realizar la petición");
			}
		});
	});
}

function print_posts(list) {
	$.each(list, function(i, post) {
		var postHTML = $("<p class='post'>");
		postHTML.html(post.object.content);
		var location = $("<ul>");
		if (post.location !== undefined) {
			location.append($("<li>").html("<strong>Lugar: </strong>" + post.location.displayName));
			location.append($("<li>").html("<strong>Dirección: </strong>" + post.location.address.formatted));
			location.append($("<li>").html("<strong>Coordenadas: </strong>" +
				"<ul><li>Lat: " + post.location.position.latitude + "</li>" +
				"<li>Lon: " + post.location.position.longitude + "</li></ul>"));
		}
		var link = $("<a>(Ver publicación completa)</a>").attr("href", post.url);
		postHTML.append($("<p>").html(link), location);
		$("#posts").append(postHTML);
	});
}

function print_user(user) {
	var image = document.createElement('img');
	image.src = user.image.url;
	$("#profile").append(image);
	$("#profile").append("<h4>" + user.displayName + "</h4>");
}
$(document).ready(function() {
	$("#submit").click(function() {
		$("#profile").empty();
		$("#posts").empty();
		handleClientLoad($("#userId").val());
	});
});
