import { Events, Guild } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class DeleteGuild extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Remove server from database when the bot is removed from a server.",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            await GuildConfig.deleteOne({ guildId: guild.id });
        } catch (error) {
            console.error(error);
        }
    }
}
