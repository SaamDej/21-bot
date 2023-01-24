require("dotenv").config(); //loads content of .env into process
const { token } = process.env; //token
const { Client, Collection, GatewayIntentBits } = require("discord.js"); //discord.js
const fs = require("fs"); //fs module

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
}); //declare intents
client.commands = new Collection(); //create collection of commands which is used to store and retrieve commands
client.commandArray = []; //create

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
