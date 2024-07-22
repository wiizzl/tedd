import { EmbedBuilder, Events, VoiceChannel, VoiceState } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class Log extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.VoiceStateUpdate,
            description: "Send message to log channel when user join or leave a voice channel.",
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
                    if (!oldState.channel?.name.startsWith("Salon de ") && oldState.channel?.id !== voice?.channelId) {
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
                    }
                } else {
                    if (!newState.channel?.name.startsWith("Salon de ")) {
                        if (newState.channel?.id !== voice?.channelId) {
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
                        } else {
                            channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Blue")
                                        .setTitle("Salon vocal créé")
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
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
