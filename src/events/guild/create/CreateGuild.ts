import { Events, Guild } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class CreateGuild extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Add server to database when the bot is added to a server.",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            if (!(await GuildConfig.findOne({ guildId: guild.id }))) {
                await GuildConfig.create({ guildId: guild.id });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
