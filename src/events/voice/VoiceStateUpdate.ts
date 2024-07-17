import { ActionRowBuilder, ChannelType, EmbedBuilder, Events, StringSelectMenuBuilder, VoiceChannel, VoiceState } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class VoiceStateUpdate extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.VoiceStateUpdate,
            description: "Voice state event",
            once: false,
        });
    }

    async Execute(oldState: VoiceState, newState: VoiceState) {
        const guild = await GuildConfig.findOne({ guildId: oldState.guild.id });
        const log = guild?.logs?.voices;
        const voice = guild?.voice;

        if (guild && log?.enabled && log?.channelId) {
            const channel = (await oldState.guild?.channels.fetch(log.channelId)) as VoiceChannel;
            const member = oldState.member;

            try {
                if (newState.channelId === null) {
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Salon vocal quitté")
                                .setThumbnail(member?.displayAvatarURL({ size: 64 })!)
                                .setDescription(
                                    `> Auteur de l'action : <@${member?.id}>\n> Nom d'utilisateur : \`${member?.user.username}\`\n> ID : \`${
                                        member?.id
                                    }\`\n> Création du compte : <t:${parseInt(
                                        (member?.user.createdTimestamp! / 1000).toString()
                                    )}:R>\n\n> Channel : ${oldState.channel}`
                                )
                                .setTimestamp(),
                        ],
                    });
                } else {
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Green")
                                .setTitle("Salon vocal rejoint")
                                .setThumbnail(member?.displayAvatarURL({ size: 64 })!)
                                .setDescription(
                                    `> Auteur de l'action : <@${member?.id}>\n> Nom d'utilisateur : \`${member?.user.username}\`\n> ID : \`${
                                        member?.id
                                    }\`\n> Création du compte : <t:${parseInt(
                                        (member?.user.createdTimestamp! / 1000).toString()
                                    )}:R>\n\n> Channel : ${newState.channel}`
                                )
                                .setTimestamp(),
                        ],
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (guild && voice?.channelId) {
            const member = newState.member;

            if (log?.enabled && log?.channelId) {
                const channel = (await oldState.guild?.channels.fetch(log.channelId)) as VoiceChannel;

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setTitle("Salon vocal créé")
                            .setThumbnail(member?.displayAvatarURL({ size: 64 })!)
                            .setDescription(
                                `> Auteur de l'action : <@${member?.id}>\n> Nom d'utilisateur : \`${member?.user.username}\`\n> ID : \`${
                                    member?.id
                                }\`\n> Création du compte : <t:${parseInt((member?.user.createdTimestamp! / 1000).toString())}:R>\n\n> Channel : ${
                                    oldState.channel
                                }`
                            )
                            .setTimestamp(),
                    ],
                });
            }

            try {
                const createChannel = (await newState.guild?.channels.fetch(voice.channelId)) as VoiceChannel;

                if (newState.channelId !== createChannel.id) return;

                const newChannel = await newState.guild?.channels.create({
                    name: `Salon de ${member?.user.displayName}`,
                    type: ChannelType.GuildVoice,
                    parent: createChannel.parent,
                });

                await newChannel.setUserLimit(4);
                await member?.voice.setChannel(newChannel);

                return await newChannel.send({
                    content: `Propriétaire du salon :${member?.user}`,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Configuration du salon vocal", iconURL: member?.displayAvatarURL() })
                            .setDescription(
                                "Voici l'espace de configuration de votre salon vocal temporaire. Les différentes options disponibles vous permettent de personnaliser les permissions de votre salon selon vos préférences."
                            ),
                    ],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
                            new StringSelectMenuBuilder()
                                .setCustomId("voice")
                                .setPlaceholder("Modifier le statut du salon.")
                                .addOptions([
                                    {
                                        label: "Ouvert",
                                        value: "open",
                                        description: "Salon ouvert à tous.",
                                        emoji: "🔓",
                                    },
                                    {
                                        label: "Fermé",
                                        value: "closed",
                                        description: "Salon visible mais non accessible.",
                                        emoji: "🔒",
                                    },
                                    {
                                        label: "Privé",
                                        value: "locked",
                                        description: "Salon accessible mais non visible.",
                                        emoji: "🔐",
                                    },
                                ]),
                        ]),
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}
