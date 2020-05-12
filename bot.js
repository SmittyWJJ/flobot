var tmi = require('tmi.js');
var mysql = require('mysql');
var gamble = require('./gamble');

process.env.BOT_USERNAME = 'Rhebot';
process.env.OAUTH_TOKEN = 'oauth:njhrse3h7ojlsxe7bbgj08ojltfzi8';
process.env.CHANNEL_NAME = 'timmelpimmel'; //'rheyces';

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

/// Create a client with our options

const client = new tmi.client(opts);

// Register our event handlers (defined below)

client.on('message', onMessageHandler);

client.on('connected', onConnectedHandler);

client.on('notice', onNoticeHandler);

client.on('join', onNamesHandler);

client.on('part', onNamesHandler);

client.on('raw_message', onRawMessageHandler);


// Connect to Twitch:

client.connect();


// Connect to MySQL

var con = mysql.createConnection({
  host: "192.168.178.108",
  user: "bot",
  password: "bot",
  database: "twitch_flobot"
});

con.connect(function (err) {
  if (err) throw err;
  console.log(`* Connected to bot@twitch_flobot`);
});

// Called every time a message comes in

function onMessageHandler(target, context, msg, self) {

  if (self) {
    return;
  } // Ignore messages from the bot


  // Check if the message is a command

  if (!msg.startsWith('!')) {
    return;
  }

  // Remove whitespace from chat message

  const commandName = msg.trim();


  // If the command is known, let's execute it

  if (commandName.toLowerCase().startsWith('!dice')) {

    const num = rollDice();

    client.say(target, `You rolled a ${num}`);

    console.log(`* Executed ${commandName} command`);

  } else if (commandName.toLowerCase().startsWith('!hi')) {

    client.say(target, `Hi!`);

    console.log(`* Executed ${commandName} command`);

  } else if (commandName.toLowerCase().startsWith('!hey')) {

    client.say(target, `Hey @${referenceUser(context)}!`);
    client.raw('CAP REQ :twitch.tv/commands');
    console.log(context);

  } else {

    console.log(`* Unknown command ${commandName}`);

  }

}

// Function called when the "dice" command is issued

function rollDice() {

  const sides = 100;

  return Math.floor(Math.random() * sides) + 1;

}

function referenceUser(context) {
  var displayName = context['display-name'];
  if (displayName != null && displayName === "")
    return context.username;
  return displayName;
}

// Called every time the bot connects to Twitch chat

function onConnectedHandler(addr, port) {

  console.log(`* Connected to ${addr}:${port}`);

}

function onNoticeHandler(channel, msgid, msg) {
  //console.log(channel);
  // console.log(msgid);
  //console.log(msg);
}

function onNamesHandler(channel, msgid, msg) {
  //console.log(channel);
  //console.log(msgid);
  //console.log(msg);
}

function onRawMessageHandler(data, pagination) {
  console.log(data);
}

// /uptime für live/nicht live
// /ban, etc. werden mit privmsg gesendet: https://dev.twitch.tv/docs/irc/guide#invalid-irc-commands
// console.log(client.raw(`PRIVMSG ${target} :This is a sample message`)); 
// --> listen to "raw_message"