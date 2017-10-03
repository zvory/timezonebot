## timezonebot
This is a discord bot that eases global co-ordination: give it a time and place, and it will translate that time to a variety of timezones.

![sample usage](/sample.PNG?raw=true)


### Running the bot
You'll need:
 - A google maps [timezone/geocoding api key](https://developers.google.com/maps/documentation/timezone/intro).
 - A discord [bot token](https://discordapp.com/developers/docs/intro).
 - Node.js in some late version that supports async functions (I developed on v8.6.0). Node.js LTS is insufficient.

Clone this repository.
```bash
npm install
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY node bot.js
```

`npm install` might give a bunch of warnings, that's caused by `discord.js` you can probably ignore those.

Let me know if something doesn't work by making an issue or emailing me. I promise I will help you.
