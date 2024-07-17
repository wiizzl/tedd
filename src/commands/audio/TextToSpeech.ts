import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";
import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Guild,
    GuildMember,
    PermissionFlagsBits,
    VoiceBasedChannel,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class TextToSpeech extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "tts",
            description: "Fait dire la phrase de votre choix par le robot dans un salon vocal.",
            category: Category.Audio,
            default_member_permissions: PermissionFlagsBits.SendVoiceMessages,
            cooldown: 20,
            dm_permission: false,
            options: [
                {
                    name: "phrase",
                    description: "Phrase que le robot doit dire.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const phrase = interaction.options.getString("phrase")!;

        const member = interaction.member as GuildMember;
        const voiceChannelMember = member.voice.channel;
        const voiceChannelBot = (await interaction.guild!.members.fetchMe()).voice.channel;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!voiceChannelMember) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Vous n'êtes pas dans un salon vocal.")],
                ephemeral: true,
            });
        }
        if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        `❌ Je suis déjà dans un salon vocal, réessayez plus tard ou rejoignez moi dans le salon : ${voiceChannelMember}`
                    ),
                ],
                ephemeral: true,
            });
        }
        if (phrase.length > 256) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Votre phrase ne doit pas dépasser 256 caractères.")],
                ephemeral: true,
            });
        }

        try {
            this.textToSpeech(voiceChannelMember, interaction.guild!, phrase, "fr");

            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ Je me connecte a votre salon vocal pour vous dire : \`${phrase}\``)],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Erreur lors de la lecture de la phrase, essayez-en une autre !")],
                ephemeral: true,
            });
        }
    }

    private async textToSpeech(channel: VoiceBasedChannel, guild: Guild, phrase: string, language: string) {
        try {
            const url = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(phrase)}&tl=${language}`;

            const resource = createAudioResource(url, {
                inlineVolume: true,
            });

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });
        } catch (error) {
            console.error(error);
        }
    }
}
