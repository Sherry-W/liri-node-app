require("dotenv").config();
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var command = process.argv[2];
var song = "";
var screenName = "";
var movieName = "";
var item = ""; //for log.txt

if (command == undefined) {
    console.log("=====================================");
    console.log("\nLIRI can take the following commands: \n")
    console.log("=====================================");
    console.log("node liri.js my-tweets <user name here> (type in user name as 'UCBerkeleyExt' without the '@', user name can be leave blank)")
    console.log("node liri.js spotify-this-song <song name here>")
    console.log("node liri.js movie-this <movie name here>")
    console.log("node liri.js do-what-it-says (this will randomly choose a command)")
}

if (command == "movie-this" || command == "my-tweets" || command == "spotify-this-song" || command == "do-what-it-says" || command == undefined) {
    doWhatItSays();
}else {
    console.log("Sorry, I don't understand '" + command + ".'");
}

//Do what it says ======================================================
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
        return console.log(error);
    }
    // console.log(data);

    if (command == "movie-this") {
        omdb();
    }
    else if (command == "my-tweets") {
        myTweets();
    }
    else if (command == "spotify-this-song") {
        spotifyThis();
    }
    // else if (command == "do-what-it-says") {
    //     doWhatItSays();
    // }

    if (process.argv[2] == "do-what-it-says") {
        var dataArr = data.split(",");
        // console.log(dataArr);
        log();

        var randomCommandIndex = [0, 2, 4, 6, 8, 10, 12, 14, 16];
        var index = randomCommandIndex[Math.floor(Math.random()*randomCommandIndex.length)];
        command = dataArr[index];
        // console.log(command);

        if (command == "movie-this") {
            movieName = dataArr[index + 1]
            item = dataArr[index + 1]
            // console.log(movieName);
            omdb();
        }
        else if (command == "my-tweets") {
            screenName = dataArr[index + 1]
            item = dataArr[index + 1]
            // console.log(screenName);
            myTweets();
        }
        else if (command == "spotify-this-song") {
            song = dataArr[index + 1]
            item = dataArr[index + 1]
            // console.log(song);
            spotifyThis();
        }
    }

    //Spotify ======================================================
    function spotifyThis() {

        if (process.argv[3] == undefined && process.argv[2] != "do-what-it-says") {
            song = "The Sign Ace of Base";
        }else if (process.argv[3] != undefined && process.argv[2] != "do-what-it-says") {
            song = process.argv.slice(3).join(' ');
        }
        // console.log(song);
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data); 
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.tracks.items[0]); 

            console.log("\nTop 5 Matched: '" + song + "'\n");

            for (var i = 0; i < 5; i++) {
                console.log("===============    " + [i + 1] + "    ===============");
                console.log("Artist(s): " + data.tracks.items[i].album.artists[0].name); 
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify);
            }
            console.log("============================================================");
            console.log("** Don't see what you're looking for? Try adding the Artist's name after the song name.");
        });
        item = song;
        log();
    }

    //My Tweets ======================================================
    function myTweets() {

        if (process.argv[3] == undefined && process.argv[2] != "do-what-it-says") {
            screenName = "SherryW1219";
        }else if (process.argv[3] != undefined && process.argv[2] != "do-what-it-says") {
            screenName = process.argv.slice(3).join(' ');
        }

        var params = {screen_name: screenName};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                console.log("================================================================");
                console.log("\nHere are some of the recent tweets of: '" + screenName + "' \n");
                console.log("================================================================");

                for (var i = 0; i < tweets.length; i++)
                console.log([i+1] + ") " + tweets[i].created_at + " \"" + tweets[i].text + "\"");
            }
        });
        item = screenName;
        log();
    }

    //OMDB ======================================================
    function omdb() {

        if (process.argv[3] == undefined && process.argv[2] != "do-what-it-says") {
            movieName = "Mr.Nobody";
        }else if (process.argv[3] != undefined && process.argv[2] != "do-what-it-says") {
            movieName = process.argv.slice(3).join(' ');
        }
        // console.log(movieName);

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                if (movieName != "") {
                    // console.log(JSON.parse(body));
                    console.log("=======================================================");
                    console.log("\nHere's the result for: '" + movieName + "' \n");
                    console.log("=======================================================");
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
        item = movieName;
        log();
    }
});
}

// log ======================================================
function log() {
    fs.appendFile("log.txt", command + ": " + item + "\n", function(err) {
        if (err) {
          console.log(err);
        }
        // else {
        //   console.log("Command logged!");
        // }
    });
}