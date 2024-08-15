import { EmbedBuilder, Events, Message } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import UserConfig from "../../../base/schemas/UserConfig";

import { getLevelXp, getRandomNb } from "../../../utils/getLevel";

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
                return await UserConfig.create({ userId: message.author.id, guildId: message.guild.id });
            }

            await UserConfig.updateOne(
                { userId: message.author.id, guildId: message.guild?.id },
                { $inc: { "level.xp": getRandomNb(1, 10), credit: getRandomNb(1, 10) } }
            );

            const xp = userDB.level.xp || 0;
            const level = userDB.level.level || 1;

            if (xp >= getLevelXp(level)) {
                const winCredit = getLevelXp(level) / 2;

                await UserConfig.updateOne(
                    { userId: message.author.id, guildId: message.guildId },
                    {
                        $set: {
                            "level.xp": 0,
                            "level.level": level + 1,
                        },
                        $inc: {
                            credit: winCredit,
                        },
                    }
                );

                await message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(this.client.config.color)
                            .setAuthor({ name: "Niveau supérieur !", iconURL: "https://i.imgur.com/wiXvc3C.png" })
                            .setDescription(
                                `Bravo ${message.author}, vous venez de passer au niveau \`${level + 1}\` ! Vous gagnez \`${winCredit}\` crédits !`
                            ),
                    ],
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
