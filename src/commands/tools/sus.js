const {
  SlashCommandBuilder,
  MessageManager,
  AttachmentBuilder,
} = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder().setName("Name").setDescription("Description"),
  async execute(interaction, client) {
    const random = Math.floor(Math.random() * 2);
    let message;
    if (random == 0) {
      message = new AttachmentBuilder("insert photo file");
      await interaction.reply({
        files: [message],
        ephemeral: true,
      });
    } else {
      message =
        "insert gif here";
      await interaction.reply({
        content: message,
        ephemeral: true,
      });
    }
  },
};
