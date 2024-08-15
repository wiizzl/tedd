import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class Welcome extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildMemberAdd,
            description: "Send log message when user join the server.",
            once: false,
        });
    }

    async Execute(member: GuildMember) {
        try {
            const guild = await GuildConfig.findOne({ guildId: member.guild.id });
            const log = guild?.logs?.joins;

            if (guild && log?.enabled && log?.channelId) {
                ((await member.guild.channels.fetch(log.channelId)) as TextChannel)?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("Nouvel arrivée")
                            .setThumbnail(member.displayAvatarURL({ size: 64 }))
                            .setDescription(
                                `> Mention : ${member}\n> ID : \`${member.id}\`\n> Nom d'utilisateur : \`${
                                    member.user.username
                                }\`\n> Création du compte : <t:${parseInt(
                                    (member.user.createdTimestamp / 1000).toString()
                                )}:R>\n> Date d'arrivée : <t:${parseInt((new Date().getTime() / 1000).toString())}:R>`
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
