import { EmbedBuilder, Events, Message } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

export default class Level extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.MessageCreate,
            description: "React to specific message when user send a message.",
            once: false,
        });
    }

    async Execute(message: Message) {
        if (message.author.bot || !message.inGuild()) return;

        const salutations = ["Bonjour", "Salut", "Coucou", "Salutations", "Bienvenue"];
        if (salutations.some((salutation) => message.content.includes(salutation))) {
            await message.react("👋");
        }

        if (message.content === `${this.client.user}`) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setAuthor({ name: "👋 Salutations !", iconURL: this.client.user?.avatarURL()! })
                        .setDescription("J'utilise les commandes slashs. Vous pouvez commencer à m'utiliser en utilisant la commande `/help`."),
                ],
            });
        }

        if (message.content === `<:bowie:1265363352679481476> ${this.client.user}`) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("💀 Ooooh ! Arrêtes de me mentionner !")
                        .setImage("https://i.imgur.com/8fvtRbN.png"),
                ],
            });
        }
    }
}
