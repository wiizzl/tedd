import { EmbedBuilder, Events, Guild } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

export default class Goodbye extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Send goodbye message when owner remove the bot from a server.",
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
                            .setColor("Red")
                            .setDescription(
                                `👋 Bonjour **${owner.user.displayName}** !\n\n\`${this.client.user?.username}\` a bien été supprimé du serveur \`${guild.name}\` !`
                            ),
                    ],
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    }
}
