"use strict"
const Discord = require('discord.js');
const client = new Discord.Client();
const date = require('date-and-time');
const moment = require('moment-timezone');
const tz = require('timezone-names');
const timezones = tz.getAll();
// this is necessary only for debugging
const util = require('util');

// idk the tutorial said node wants this in here
process.on('unhandledRejection', (err) => { 
  console.error(err)
  process.exit(1)
})

// hack from github 
// https://github.com/knowledgecode/date-and-time/issues/4
date.setLocales('en', {
    A: ['a.m.', 'p.m.', 'A.M.', 'P.M.', 'am', 'pm', 'AM', 'PM'],
    parser: {
        A: function (str) {
            var finding = this.parser.find(this.A, str);
            finding.index %= 2; // Replace an even number with zero, an odd number with one.
            return finding;
        }
    }
});

client.on('ready', () => {
    console.log('Bot is ready!');
});


client.on('message', message => {
    const messageString = message.toString();

    const tzconvert = "?tzconver";
    if (messageString.startsWith(tzconvert)) {
        const userTimeInput = messageString.substring(tzconvert.length, messageString.indexOf(","));
        const userLocation = messageString.substring(messageString.indexOf(",") + 1);
        console.log(userLocation);

        // now we try a whole bunch of different formats, and take the ones that are valid
        const timeFormats = [  `h:mm A`, `h A`, `h:mmA`, `hA`,`H:mm`, `Hmm`, `H`];
        const validFormats = timeFormats.filter(format => moment(userTimeInput, format).isValid());

        if (validFormats.length == 0) {
            message.reply(`Sorry, I don't understand. 
                    Usage: "?tzconvert your_time_here"
                    Accepted timeformats are: ${timeFormats.join(", ")}
                    \`A\` means "am" or "pm"
                    E.g. \`?tzconvert 11:34 pm\``);
            return;
        } else {

            locationToTimeZone(userLocation).then(
                ({timeZoneId}) => {

                const userTimeFormat = validFormats[0];
                const outputFormat = 'h:mm a z';

                const userMoment = moment.tz(userTimeInput, userTimeFormat, timeZoneId);
                const userTimeString = userMoment.format("h:mm a z");

                console.log("TiemzoneID: ", timeZoneId);
                console.log("user time string: ", userTimeString);

                const convertedTimesArray = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Kolkata', 'Europe/Moscow', 'Europe/Kiev', 'Africa/Johannesburg', 'Europe/Berlin', 'Europe/London', 'America/Sao_Paulo']
                    .map(tz => userMoment.clone().tz(tz).format(outputFormat));
                const convertedTimesString = convertedTimesArray.join(", ");

                const replyString = 
                    `${userTimeString} in ${timeZoneId} is:
                    ${convertedTimesString}`;

                console.log(replyString);
                message.reply(replyString);

                }).catch(e => console.log(e));
            
        }
    }
});

const {DISCORD_BOT_TOKEN: discordBotToken, GOOGLE_MAPS_API_KEY: googleMapsAPIKey} = process.env;
client.login(discordBotToken);

var googleMapsClient = require('@google/maps').createClient({
   key: googleMapsAPIKey,
   Promise: Promise
});

async function locationToTimeZone (address) {
    let geocodeResponse;
    try{
        geocodeResponse = await googleMapsClient.geocode({address}).asPromise();
    } catch (e) {
        console.log("Geocoding error: ", e);
        // wow TODO we'll need some error handling
        return e;
    }

    const [ {geometry : {location}}] = geocodeResponse.json.results;

    const milisecondsInOneSecond = 1e4;
    const timestamp = Date.now() / milisecondsInOneSecond; 

    const queryObject = {location, timestamp};
    
    let timezoneLookupResult
    try{
         timezoneLookupResult = await googleMapsClient.timezone(queryObject).asPromise();
    } catch (e) {
        console.log("Timezone API error: ", e);
        return e;
    }

    return timezoneLookupResult.json;
}

//locationToTimeZone("Manilla").then(res => console.log(res));

// // Geocode an address.
// googleMapsClient.geocode({
//    address: 'Manilla'
// }).asPromise()
//     .then(response => {
//         const [ {geometry : {location}}] = response.json.results;
//         const milisecondsInOneSecond = 1e4;
//         const timestamp = Date.now() / milisecondsInOneSecond; 
//         const queryObject = {location, timestamp};
//         console.log(queryObject);
//         googleMapsClient.timezone(queryObject).asPromise()
//             .then(response=> console.log(response.json))
//             .catch(err => console.log("Error: ", err));
        


//     })
//     .catch(err => console.log(err));


