const chalk = require("chalk");
const {
    VoiceConnectionStatus,
    entersState,
    getVoiceConnection,
} = require("@discordjs/voice");
const { queue } = require("../../commands/music_commands/play");
const { VoiceStateManager, VoiceState } = require("discord.js");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState) {
        if (newState.id == "insert bot's ID here") {
            console.log(
                chalk.greenBright(
                    `Bot VoiceState Update in guild ${newState.guild.name}`
                )
            );
            await sleep(1000);
            const vc_new = getVoiceConnection(newState.guild.id);
            try {
                if (vc_new._state.status == "ready") {
                    vc_new.once(VoiceConnectionStatus.Disconnected, async () => {
                        try {
                            await Promise.race([
                                entersState(
                                    vc_new,
                                    VoiceConnectionStatus.Signalling,
                                    1_000
                                ),
                                entersState(
                                    vc_new,
                                    VoiceConnectionStatus.Connecting,
                                    1_000
                                ),
                            ]);
                            console.log("we're good");
                        } catch (error) {
                            console.log(
                                chalk.yellow(
                                    `Disconnection occured.`
                                )
                            );
                            const server_queue = queue.get(newState.guild.id);
                            if(server_queue){
                                server_queue.subscription.player.stop();
                                server_queue.connection.destroy();
                                queue.delete(newState.guild.id);
                                //newState.guild
                            } else {
                                vc_new.destroy();
                            }
                        }
                    });
                }
            } catch (error) {
                console.log(chalk.red("Something happened :/"));
            }
        }
    },
};
