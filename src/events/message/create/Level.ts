import { EmbedBuilder, Events, Message } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import UserConfig from "../../../base/schemas/UserConfig";

import { getLevelXp, getRandomXp } from "../../../utils/getLevel";

export default class Level extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.MessageCreate,
            description: "Give user experience when message is sent.",
            once: false,
        });
    }

    async Execute(message: Message) {
        if (message.author.bot || !message.inGuild()) return;

        try {
            const userDB = await UserConfig.findOne({ userId: message.author.id, guildId: message.guild.id });

            if (!userDB) {
                await UserConfig.create({ userId: message.author.id, guildId: message.guild.id });
            }

            const xp = userDB?.level.xp || 0;
            const level = userDB?.level.level || 1;

            userDB!.level.xp += getRandomXp(1, 5);

            if (xp >= getLevelXp(level)) {
                userDB!.level.xp = 0;
                userDB!.level.level += 1;
                userDB!.credit += getLevelXp(level) / 2;

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setAuthor({ name: "Niveau supérieur !", iconURL: "https://i.imgur.com/wiXvc3C.png" })
                            .setDescription(
                                `Bravo ${message.author}, vous venez de passer au niveau \`${userDB!.level.level}\` ! Vous gagnez \`${
                                    getLevelXp(level) / 2
                                }\` crédits !`
                            ),
                    ],
                });
            }

            await userDB?.save();
        } catch (error) {
            console.error(error);
        }
    }
}
