require("dotenv").config();
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

if (process.argv[2] == "movie-this") {
    omdb();
}
else if (process.argv[2] == "my-tweets") {
    myTweets();
}
else if (process.argv[2] == "spotify-this-song") {
    spotifyThis();
}
else if (process.argv[2] == "do-what-it-says") {
    doWhatItSays();
}

//Do what it says
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
        return console.log(error);
    }

    console.log(data);

    var dataArr = data.split(",");

    console.log(dataArr);

    });
}

//Spotify
function spotifyThis() {
    var song = "";
    song = process.argv.slice(3).join(' ');
    
    if (process.argv[3] == undefined) {
        song = "The Sign Ace of Base";
    }
    // console.log(song);
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
    //   console.log(data); 
    //   console.log(data.tracks.items[0]); 
      console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name); 
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
      
      });
}


//My Tweets
function myTweets() {
    var screenName = "";
    screenName = process.argv.slice(3).join(' ');
    
    if (process.argv[3] == undefined) {
        screenName = "SherryW1219";
    }
    var params = {screen_name: screenName};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            // console.log(tweets);
            console.log("Here are some of the recent tweets: ");

            for (var i = 0; i < tweets.length; i++)
            console.log(tweets[i].created_at + " \"" + tweets[i].text + "\"");
        }
    });
}

//OMDB
function omdb() {
    var movieName = "";
    movieName = process.argv.slice(3).join(' ');
    console.log(movieName);
    if (process.argv[3] == undefined) {
        // console.log("Please Enter a Movie Name.");
        movieName = "Mr.Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            if (movieName != "") {
                // console.log(JSON.parse(body));
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        }
    });
}
