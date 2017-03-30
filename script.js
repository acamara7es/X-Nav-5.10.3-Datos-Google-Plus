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
            'maxResults': 20
        });
        var user_request = gapi.client.plus.people.get({
            'userId': userId
        });
        posts_request.execute(function(resp) {
            print_posts(resp.items);
        });

        user_request.execute(function(resp) {
            print_user(resp);
        });
    });
}

function print_posts(list) {
    for (i in list) {
        $("#posts").append("<li>" + list[i].object.content +
            "  <a href='" + list[i].url + "'>(Ver más)</a></li>");
    }
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
