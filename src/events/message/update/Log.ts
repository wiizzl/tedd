import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class MessageUpdate extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.MessageUpdate,
            description: "Send message to log channel when user update a message.",
            once: false,
        });
    }

    async Execute(oldMessage: Message, newMessage: Message) {
        if ((oldMessage.author.bot && newMessage.author.bot) || (!oldMessage.inGuild() && !newMessage.inGuild())) return;

        try {
            const guild = await GuildConfig.findOne({ guildId: oldMessage.guildId });
            const log = guild?.logs?.messages;

            if (guild && log?.enabled && log?.channelId) {
                ((await oldMessage.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Orange")
                            .setTitle("Message modifié")
                            .setThumbnail(oldMessage.author.displayAvatarURL({ size: 64 }))
                            .setDescription(
                                `> Auteur du message : <@${oldMessage.author.id}>\n> Nom d'utilisateur : \`${
                                    oldMessage.author.username
                                }\`\n> ID : \`${oldMessage.author.id}\`\n> Création du compte : <t:${parseInt(
                                    (oldMessage.author.createdTimestamp / 1000).toString()
                                )}:R>\n\n> Channel : ${oldMessage.url}\n> Ancien message : \`${oldMessage.content}\`\n> Nouveau message : \`${
                                    newMessage.content
                                }\``
                            )
                            .setTimestamp(),
                    ],
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
