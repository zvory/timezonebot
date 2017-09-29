## timezonebot
This is a discord bot that eases global co-ordination: give it a time and place, and it will translate that time to a variety of timezones.

usage:
```?tz 11:34pm, paris```
outputs:
```
11:34 am CEST in Europe/Paris is:
            5:34 am EDT, 4:34 am CDT, 2:34 am PDT, 6:34 pm KST, 5:34 pm CST, 3:04 pm IST, 12:34 pm MSK, 12:34 pm EEST, 11:34 am SAST, 11:34 am CEST, 10:34 am BST, 6:34 am -03
```

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
