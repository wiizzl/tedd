import { EmbedBuilder, Events, Guild } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

export default class Welcome extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Send welcome message when owner add the bot to a server.",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            const owner = await guild.fetchOwner();

            owner
                ?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(
                                `👋 Bonjour **${owner.user.displayName}** !\n\n\`${this.client.user?.username}\` a bien été ajouté au serveur \`${guild.name}\` !`
                            ),
                    ],
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    }
}
