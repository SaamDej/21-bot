const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../../events/client/ready");
const { cool } = require("@discordjs/voice");
const { cooler } = require("@discordjs/opus");

function music_play() {
    console.log("1");
}
function music_pause() {
    console.log("2");
}
function music_skip() {
    console.log("4");
}
function music_clear() {
    console.log("5");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("WIP")
        .addStringOption((option) =>
            option
                .setName("option")
                .setDescription("Select what action you want to take.")
                .setRequired(true)
                .addChoices(
                    { name: "play", value: "m_play" },
                    { name: "pause", value: "m_pause" },
                    { name: "resume", value: "m_resume" },
                    { name: "skip", value: "m_skip" },
                    { name: "clear", value: "m_clear" }
                )
        ),
    async execute(interaction, client) {
        switch (interaction.options.getString("option")) {
            case "m_play":
                interaction.reply("play option goes here");
                break;
            case "m_pause":
                interaction.reply("pause option goes here");
                break;
            case "m_resume":
                interaction.reply("resume option goes here");
                break;
            case "m_skip":
                interaction.reply("skip option goes here");
                break;
            case "m_clear":
                interaction.reply("clear option goes here");
                break;
            default:
                interaction.reply("Work in progress.");
                break;
        }
    },
};
