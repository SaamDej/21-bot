const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const queue = new Map();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Removes bot from voice channel."),
    async execute(interaction) {
        await interaction.reply("this command is currently a WIP");
    },
};
