"use strict"
const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment-timezone');

// idk the tutorial said node wants this in here to make errors go away
process.on('unhandledRejection', (err) => { 
  console.error(err)
  process.exit(1)
})

client.on('ready', () => {
    console.log('Bot is ready!');
});

//turns the user inputted adress into a timezone location ("california" -> "America/Los_Angeles")
//this function will throw an error if the geocode lookup fails, or if the timezone lookup fails
async function locationToTimeZone (address) {
    let geocodeResponse;
    try{
        geocodeResponse = await googleMapsClient.geocode({address}).asPromise();
    } catch (e) {
        throw e;
    }

    if (geocodeResponse.json.results.length === 0 || geocodeResponse.json.status === "ZERO_RESULTS") {
        throw "google maps couldn't geocode adress";
    }

    // pull out latitude and longitude object from response
    const [ {geometry : {location}}] = geocodeResponse.json.results;

    const milisecondsInOneSecond = 1e4;
    // google expects timestamps in seconds, not milliseconds
    const timestamp = Date.now() / milisecondsInOneSecond; 

    const queryObject = {location, timestamp};
    
    let timezoneLookupResult;
    try{
         timezoneLookupResult = await googleMapsClient.timezone(queryObject).asPromise();
    } catch (e) {
        throw (e);
    }

    return timezoneLookupResult.json;
}

// string -> string
// takes a time, and outputs what format the time is in
// throws an error if it's malformed
function getTimeFormat (timeFormats, timeString) {
    // now we try a whole bunch of different formats, and take the ones that are valid
    // note the order of the array entries matters, the meridian ("A") ones must come first
    const validFormats = timeFormats.filter(format => moment(timeString, format).isValid());
    if (validFormats.length == 0)
        throw "No valid timeformat found";
    else
        return validFormats[0];
}

client.on('message', async message => {
    const messageString = message.toString();

    const commandString = "?tz";
    if (messageString.startsWith(commandString)) {

        // after command string, but before first comma
        const inputTime = messageString.substring(commandString.length, messageString.indexOf(","));
        // user's location is after first comma
        const userLocation = messageString.substring(messageString.indexOf(",") + 1);

        const timeFormats = [  `h:mm A`, `h:mmA`, `h A`, `hA`,`H:mm`, `Hmm`, `H`];

        let inputTimeFormat;
        try{
            inputTimeFormat = getTimeFormat(timeFormats, inputTime);
        } catch (e) {
            console.error(e);
            const examples = timeFormats.map(format => moment().format(format)).join(", ");
            message.reply(`Sorry, I don't understand your time format.
                    Usage: "?tz your_time_here, your_location here"
                    Accepted timeformats are: ${examples}`);
            return;
        }

        let timeZoneId;
        try {
            // weird syntax is to allow object destructuring
            ({timeZoneId} = await locationToTimeZone(userLocation));
        } catch (e) {
            message.reply(`Sorry, I didn't understand your location: ${userLocation},
                    Try things like "california", "Paris", or "San Jose, Costa Rica"`);
            console.error(e);
            return;
        }

        const outputFormat = 'h:mm a z';

        //turn the user's inputted time into actual data
        const userMoment = moment.tz(inputTime, inputTimeFormat, timeZoneId);
        const userTimeString = userMoment.format("h:mm a z");

        const outputTimezones = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Kolkata', 'Europe/Moscow', 'Europe/Kiev', 'Africa/Johannesburg', 'Europe/Berlin', 'Europe/London', 'America/Sao_Paulo'];

        const convertedTimesArray = outputTimezones.map(tz => 
                userMoment.clone().tz(tz).format(outputFormat));

        const convertedTimesString = convertedTimesArray.join(", ");

        const replyString = 
            `${userTimeString} in ${timeZoneId} is:
            ${convertedTimesString}`;

        console.log(replyString);
        message.reply(replyString);
    }
});

// pull API keys from environment variables
const {DISCORD_BOT_TOKEN: discordBotToken, GOOGLE_MAPS_API_KEY: googleMapsAPIKey} = process.env;

client.login(discordBotToken);

var googleMapsClient = require('@google/maps').createClient({
   key: googleMapsAPIKey,
   Promise: Promise
});

// test the google maps API
googleMapsClient.geocode({
    address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
    if (err) console.error("Google Maps API lookup failed", err);
    exit(1);
});
