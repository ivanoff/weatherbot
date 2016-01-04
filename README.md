# weatherbot

The weatherbot for slack.


`weatherbotBOT [5:09 PM] `

`Hi! I can tell weather in your city. Just say `Kyiv?` to invoke me! // still testing...`


`ivanov [5:09 PM] `

`kiev`


`weatherbotBOT [5:09 PM] `

`:sunny: Today in kiev -14°C, Sky is Clear, wind: 2m/s`


`ivanov [5:11 PM] `

`Weatherbot, you're a real tin-tin can`


`weatherbotBOT [5:11 PM] `

`Yes, I'm a real tin-tin can :)`


`ivanov [5:11 PM] `

`please, Kiev again`


`weatherbotBOT [5:11 PM] `

`:sunny: Today in Kiev -14°C, Sky is Clear, wind: 2m/s`


`ivanov [5:11 PM] `

`Thanks!`


`weatherbotBOT [5:11 PM] `

`You are welcome! :)`



## Installation

```bash
git clone https://github.com/ivanoff/weatherbot.git
cd weatherbot
npm install
```


## Running the weatherbot

```bash
WEATHERBOT_API_KEY=<Your_Slack_API_here> npm start
```


## Getting the API token for your Slack channel

To allow the weatherbot to connect your Slack channel you must provide him an API key. To retrieve it you need to add a new Bot in your Slack organization by visiting the following url: https://*yourorganization*.slack.com/services/new/bot, where *yourorganization* must be substituted with the name of your organization (e.g. https://*loige*.slack.com/services/new/bot). Ensure you are logged to your Slack organization in your browser and you have the admin rights to add a new bot.

You will find your API key under the field API Token, copy it in a safe place and get ready to use it.


## Configuration

The weather is configurable through environment variables. There are several variable available:

| Environment variable | Description |
|----------------------|-------------|
| `WEATHERBOT_API_KEY` | this variable is mandatory and must be used to specify the API token needed by the bot to connect to your Slack organization |
| `WEATHERBOT_NAME` | the name of your bot, it’s optional and it will default to norrisbot |


Additional configuration are in `config` directory.


## License

Licensed under [MIT License](LICENSE).


## Created by

Dimitry, 2@ivanoff.org.ua .$ curl -A cv ivanoff.org.ua
