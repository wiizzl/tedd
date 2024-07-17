import { EmbedBuilder, Events, Message, TextChannel } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class MessageCreate extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false,
        });
    }

    async Execute(message: Message) {
        if (message.author.bot) return;

        try {
            const guild = await GuildConfig.findOne({ guildId: message.guildId });
            const log = guild?.logs?.messages;

            if (guild && log?.enabled && log?.channelId) {
                ((await message.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("Message envoyé")
                            .setThumbnail(message.author.displayAvatarURL({ size: 64 }))
                            .setDescription(
                                `> Auteur du message : <@${message.author.id}>\n> Nom d'utilisateur : \`${message.author.username}\`\n> ID : \`${
                                    message.author.id
                                }\`\n> Création du compte : <t:${parseInt((message.author.createdTimestamp / 1000).toString())}:R>\n\n> Channel : ${
                                    message.url
                                }\n> Message : \`${message.content}\``
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
