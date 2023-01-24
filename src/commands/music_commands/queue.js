const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const { queue } = require("./play");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays queue."),
    async execute(interaction) {
        const server_queue = queue.get(interaction.guildId);
        let song = {};
        if (!server_queue) {
            await interaction.reply("Queue does not exist :(");
        } else {
            let message = `__**Track Queue**__\n`;
            let num = 1;
            for (song of server_queue.songs) {
                message = message.concat(`${num}. **${song.title}**`, "\n");
                num++;
            }
            await interaction.reply({
                content: message,
            });
        }
    },
};
