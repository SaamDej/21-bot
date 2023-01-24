const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const { queue } = require("./play");
const { AudioPlayerStatus } = require("@discordjs/voice");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes audio."),
    async execute(interaction) {
        const server_queue = queue.get(interaction.guildId);
        if (!server_queue) {
            await interaction.reply("Queue does not exist :(");
        } else {
            let song = server_queue.songs[0];
            const music_Player = server_queue.subscription.player;
            console.log(AudioPlayerStatus.Paused);
            if (music_Player.unpause() === false) {
                await interaction.reply("Song is already playing.");
            } else {
                await interaction.reply(`▶ Resuming **${song.title}**`);
            }
        }
    },
};
