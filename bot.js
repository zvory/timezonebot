"use strict"
const Discord = require('discord.js');
const client = new Discord.Client();
const date = require('date-and-time');
const moment = require('moment-timezone');
const tz = require('timezone-names');
const token = process.argv[2];
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
    console.log('I am ready!');
});

const timeFormats = [  `h:mm A`, `h A`, `h:mmA`, `hA`,`H:mm`, `Hmm`, `H`];

const tzconvertUsageMessage =`Sorry, I don't understand. 
    Usage: "?tzconvert your_time_here"
    Accepted timeformats are: ${timeFormats.join(", ")}
    \`A\` means "am" or "pm"
    Make sure you have set your timezone role with the bot!`;

const tzsetUsageMessage = `Sorry, I don't understand. 
            Usage: "?tz KST"`;

client.on('message', message => {
    const messageString = message.toString();

    // messsage of the form "?tz GST"
    if (messageString.startsWith("?settz")) {

        const messageTZ= messageString.split(' ')[1];
        const timezoneMentioned = timezones.filter(timezone =>
            messageTZ === timezone.Abbreviation);

        if (timezoneMentioned.length !== 1) {
            message.reply(tzsetUsageMessage);
            return;
        } else {
            const userTimezone = timezoneMentioned[0];
            console.log(userTimezone);
            message.reply(`You've registered for ${userTimezone.Abbreviation} ${userTimezone.Name}`);
            return;
        }
    } else if (messageString.startsWith("?tzconvert")) {

        const messageAsArray = messageString.split(" ");
        if (messageAsArray.length <= 1){
            message.reply(tzconvertUsageMessage);
            return;
        } 

        const timeInput = messageAsArray.slice(1).join(" ");
        // now we try a whole bunch of different formats, and take the ones that are valid
        const validFormats = timeFormats.filter(format => moment(timeInput, format).isValid());
        if (validFormats.length == 0) {
            message.reply(tzconvertUsageMessage);
            return;
        } else {
            // TODO make this not hardcoded
            const userTZ = "America/New_York";

            const format = validFormats[0];

            console.log("timeInput: ", timeInput);
            console.log("Format: ", format);
            const userMoment = moment(timeInput, format, undefined, undefined, userTZ);
            
           // `${timeInput} ${userOffset}`, `${format} Z`);

            const converted = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Kolkata', 'Europe/Moscow', 'Europe/Kiev', 'Africa/Johannesburg', 'Europe/Berlin', 'Europe/London', 'America/Sao_Paulo'].map(tz => userMoment.clone().tz(tz).format('h:mm a z'));

            const replyString = 
            `${userMoment.format('h:mm a z')} is 
            ${converted.toString().replace(/,/g,  ", ")}`;
                
            console.log(replyString);
            message.reply(replyString);
        }
    }
});

client.login(token);
