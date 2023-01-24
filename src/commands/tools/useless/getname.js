const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../../events/client/ready");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("getname")
          .setDescription("Return Name of User"),
     async execute(interaction) {
          await interaction.deferReply({
               fetchReply: true,
          });

          const newMessage = `In case you forgot, your name is ${interaction.user.username}.`;
          await interaction.editReply({
               content: newMessage,
          });
     },
};
