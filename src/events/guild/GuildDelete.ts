import { EmbedBuilder, Events, Guild } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildDelete extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildDelete,
            description: "Guild leave event",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            await GuildConfig.deleteOne({ guildId: guild.id });

            const owner = await guild.fetchOwner();
            owner
                ?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                `:wave: Bonjour **${owner.user.username}** !\n\n\`${this.client.user?.username}\` a bien été supprimé du serveur \`${guild.name}\` !`
                            ),
                    ],
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    }
}
