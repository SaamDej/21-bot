const {
    SlashCommandBuilder,
    ConnectionService,
    VoiceChannel,
} = require("discord.js");
const { execute } = require("../../events/client/ready");
const {
    VoiceConnectionStatus,
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    PlayerSubscription,
    entersState,
    StreamType,
} = require("@discordjs/voice");
const { queue } = require("../music_commands/play");

function playSong(playerName, audioName) {
    const resource = createAudioResource(audioName, {
        inputType: StreamType.Arbitrary,
    });
    playerName.play(resource);
    return entersState(playerName, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(channel, interaction) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bugatti")
        .setDescription("I WOKE UP IN A NEW BUGATTI"),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel; //member = GuildMember, voice = VoiceState, channel = VoiceChannel
        if (voiceChannel) {
            console.log(`Joining ${voiceChannel.name}`);
            const audioPlayer = createAudioPlayer();
            try {
                await playSong(audioPlayer, "src/bugatti.mp3");
                console.log("\x1b[36m%s\x1b[0m", "Song is ready to play!");
            } catch (error) {
                console.error(error);
            }
            try {
                const connection = await connectToChannel(
                    voiceChannel,
                    interaction
                );
                const server_queue = queue.get(interaction.guildId);
                let old_ap;
                if (server_queue) {
                    old_ap = server_queue.subscription.player;
                    console.log(server_queue.songs[0].title);
                }
                connection.subscribe(audioPlayer);
                await interaction.reply(
                    "I WOKE UP IN A NEW BUGATTI"
                );
                audioPlayer.on(AudioPlayerStatus.Idle, () => {
                    audioPlayer.stop();
                    if (server_queue) {
                        server_queue.connection.subscribe(old_ap);
                    } else {
                        console.log("The audio player is idle");
                        setTimeout(() => {
                            connection.destroy();
                            console.log("connection destroyed!");
                        }, 1_000);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            await interaction.reply("Could not Connect to a voice channel");
            console.log("nothing fucking happened");
        }
    },
};
