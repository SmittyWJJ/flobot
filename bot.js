const tmi = require('tmi.js');
var mysql = require('mysql');

process.env.BOT_USERNAME = 'Rhebot';
process.env.OAUTH_TOKEN = 'oauth:njhrse3h7ojlsxe7bbgj08ojltfzi8';
process.env.CHANNEL_NAME = 'rheyces';

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


  // Remove whitespace from chat message

  if (!msg.startsWith('!')) {
    return;
  }

  const commandName = msg.trim();

  console.log(commandName);


  // If the command is known, let's execute it

  var commands = ['!dice', '!hi', '!hey'];

  if (commandName.toLowerCase().startsWith(commands[0])) {

    const num = rollDice();

    client.say(target, `You rolled a ${num}`);

    console.log(`* Executed ${commandName} command`);

  } else if (commandName.toLowerCase().startsWith(commands[1])) {

    client.say(target, `Hi!`);

    console.log(`* Executed ${commandName} command`);

    console.log(context);

  } else if (commandName.toLowerCase().startsWith(commands[2])) {

    client.say(target, `Hey!`);

    console.log(`* Executed ${commandName} command`);

  } else {

    console.log(`* Unknown command ${commandName}`);

  }

}

// Function called when the "dice" command is issued

function rollDice() {

  const sides = 100;

  return Math.floor(Math.random() * sides) + 1;

}

// Called every time the bot connects to Twitch chat

function onConnectedHandler(addr, port) {

  console.log(`* Connected to ${addr}:${port}`);

}