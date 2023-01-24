const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("yon")
          .setDescription("Ask a yes or no question.")
          .addStringOption((option) =>
               option
                    .setName("question")
                    .setDescription("Write your yes or no question.")
                    .setRequired(true)
          ),
     async execute(interaction) {
          const random = Math.floor(Math.random() * 2);
          const string = `${interaction.member.displayName} asks: ${interaction.options.getString("question")} `;
          if (random == 0) {
               interaction.reply(`${string}\nYes.`);
          } else {
               interaction.reply(`${string}\nNo.`);
          }
     },
};
