const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const { queue, video_player } = require("./play");
const {
    VoiceConnectionStatus,
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    PlayerSubscription,
    entersState,
    StreamType,
    demuxProbe,
    getVoiceConnection,
} = require("@discordjs/voice");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips current audio in queue."),
    async execute(interaction) {
        const server_queue = queue.get(interaction.guildId);
        if (!server_queue) {
            await interaction.reply("Queue does not exist :(");
        } else {
            let song = server_queue.songs[0];
            await interaction.reply(`Skipping **${song.title}**...`);
            if (server_queue.songs.length == 1) {
                server_queue.connection.destroy();
                queue.delete(interaction.guildId);
            } else {
                //server_queue.connection.unsubscribe()
                server_queue.songs.shift();
                await video_player(interaction, server_queue.songs[0]);
            }
        }
    },
};
