const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const play = require("play-dl");
const { yt_validate, sp_validate } = require("play-dl");
const {
    VoiceConnectionStatus,
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    getVoiceConnection,
    VoiceConnection,
} = require("@discordjs/voice");
const chalk = require("chalk");

const queue = new Map();
let start, end;

const video_player = async (interaction, song) => {
    start = Date.now();
    const song_queue = queue.get(interaction.guildId);
    if (!song) {
        song_queue.connection.destroy();
        queue.delete(interaction.guildId);
        return;
    }
    const audioPlayer = createAudioPlayer();
    let stream = await play.stream(song.url);
    console.log(song.url);
    await playSong(audioPlayer, stream);
    song_queue.subscription = song_queue.connection.subscribe(audioPlayer);
    end = Date.now();
    console.log((end - start) / 1000);
    audioPlayer
        .on(AudioPlayerStatus.Idle, () => {
            song_queue.songs.shift();
            video_player(interaction, song_queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
    if (interaction.replied === false) {
        await interaction.editReply(`🎵 Now playing **${song.title}**`);
    } else {
        await interaction.followUp(`🎵 Now playing **${song.title}**`);
    }
};

function playSong(playerName, audioName) {
    const resource = createAudioResource(audioName.stream, {
        inputType: audioName.type,
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

async function ytSearch(input) {
    let song = {};
    const video = await play.search(input, { limit: 1 });
    console.log(`SWAG: ${video[0].title}`);
    if (video) {
        const info = await play.video_info(video[0].url);
        console.log(chalk.bgGreen(info.video_details.music));
        song = { title: video[0].title, url: video[0].url };
    } else {
        interaction.editReply("Error finding video.");
    }
    return song;
}

async function spotSearch(input) {
    let song = {};
    const video = await play.search(input, {
        source: { spotify: "track" },
    });
    console.log(`SWAG: ${video[0].name}`);
    if (video) {
        const search = await play.search(`${video[0].name}`, {
            limit: 1,
        });
        song = { title: search[0].title, url: search[0].url };
    } else {
        interaction.editReply("Error finding video.");
    }
    return song;
}

async function searcher(input, play_option) {
    if (play.is_expired()) {
        await play.refreshToken(); // This will check if access token has expired or not. If yes, then refresh the token.
    }
    let song;

    if (input.startsWith("https") && yt_validate(input) === "video") {
        const song_info = await play.video_basic_info(input);
        song = {
            title: song_info.video_details.title,
            url: song_info.video_details.url,
        };
    } else if (sp_validate(input) === "track") {
        const song_info = await play.spotify(input);
        song = ytSearch(song_info.name);
    }
    // if input is not a URL search for video and define song based on info
    else {
        //run video finder command
        if (play_option === "youtube" || !play_option) {
            song = ytSearch(input);
        } else if (play_option === "spotify") {
            song = spotSearch(input);
        }
    }
    return song;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays audio based on user search")
        .addStringOption((option) =>
            option
                .setName("search")
                .setDescription("Search for something to play.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("Choose where you search")
                .addChoices(
                    { name: "Youtube", value: "youtube" },
                    { name: "Spotify", value: "spotify" }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const voice_channel = interaction.member.voice.channel;
        const server_queue = queue.get(interaction.guildId);
        const input = interaction.options.getString("search");
        const play_option = interaction.options.getString("category");
        let song = await searcher(input, play_option);
        console.log(song);
        if (!server_queue) {
            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: interaction.channel,
                connection: null,
                subscription: null,
                songs: [],
            };
            queue.set(interaction.guildId, queue_constructor);
            queue_constructor.songs.push(song);
            try {
                const connection = await connectToChannel(
                    voice_channel,
                    interaction
                );
                queue_constructor.connection = connection;
                await video_player(interaction, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(interaction.guildId);
                await interaction.editReply("There was an error connecting!");
                throw err;
            }
            console.log(queue_constructor.voice_channel.name);
        } else {
            server_queue.songs.push(song);
            await interaction.editReply(`👍 **${song.title}** added to queue`);
            console.log(server_queue.voice_channel.name);
        }
    },
    queue,
    video_player,
};
