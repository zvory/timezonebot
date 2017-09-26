"use strict"
const Discord = require('discord.js');
const client = new Discord.Client();
const date = require('date-and-time');
const moment = require('moment-timezone');
const tz = require('timezone-names');
const timezones = tz.getAll();


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

    if (messageString.startsWith("?tzconvert")) {
        const userTimeInput = messageString.substring(messageString.indexOf(" "));

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
            // TODO make this not hardcoded
            const userTZ = "America/New_York";

            const userTimeFormat = validFormats[0];
            const outputFormat = 'h:mm a z';

            const userMoment = moment(userTimeInput, userTimeFormat, undefined, undefined, userTZ);
            const userTimeString = userMoment.format(outputFormat);

            const convertedTimesArray = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Kolkata', 'Europe/Moscow', 'Europe/Kiev', 'Africa/Johannesburg', 'Europe/Berlin', 'Europe/London', 'America/Sao_Paulo']
            .map(tz => userMoment.clone().tz(tz).format(outputFormat));
            const convertedTimesString = convertedTimesArray.join(", ");

            const replyString = 
                `${userTimeString} is 
                ${convertedTimesString}`;

            console.log(replyString);
            message.reply(replyString);
        }
    }
});

const {DISCORD_BOT_TOKEN: discordBotToken, GOOGLE_MAPS_API_KEY: googleMapsAPIKey} = process.env;
client.login(discordBotToken);



//var googleMapsClient = require('@google/maps').createClient({
//    key: googleMapsApiKey
//});
//
//// Geocode an address.
//googleMapsClient.geocode({
//    address: '1600 Amphitheatre Parkway, Mountain View, CA'
//}, function(err, response) {
//    if (err) {
//        console.log(err);
//        return;
//    } else {
//        const
//    }
//});
