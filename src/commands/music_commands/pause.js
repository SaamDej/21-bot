const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const { queue } = require("./play");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the bot's audio."),
    async execute(interaction) {
        const server_queue = queue.get(interaction.guildId);
        let song = {};
        if (!server_queue) {
            await interaction.reply("Queue does not exist :(");
        } else {
            server_queue.subscription.player.pause();
            song = server_queue.songs[0];
        }
        await interaction.reply(`⏹ Paused **${song.title}**`);
    },
};
