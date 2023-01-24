const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const { queue } = require("./play");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears the queue."),
    async execute(interaction) {
        const server_queue = queue.get(interaction.guildId);
        if (!server_queue) {
            await interaction.reply("Queue does not exist :(");
        } else {
            server_queue.subscription.player.stop();
            server_queue.connection.destroy();
            queue.delete(interaction.guildId);
            await interaction.reply("🗑 Queue Cleared.");
        }
    },
};
