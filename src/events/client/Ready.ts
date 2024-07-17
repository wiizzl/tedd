import { ActivityType, Collection, Events, REST, Routes } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class Ready extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready Event",
            once: true,
        });
    }

    async Execute() {
        console.log(`${this.client.user?.username} is now online.`);

        const rest = new REST().setToken(this.client.config.token);
        const setCommands: any = await rest.put(Routes.applicationCommands(this.client.config.id), {
            body: this.GetJson(this.client.commands),
        });

        console.log(`Successfully loaded ${setCommands.length} commands.`);

        const guild = this.client.guilds.cache.get(this.client.config.guild);
        this.client.user?.setPresence({
            activities: [
                {
                    name: guild?.memberCount + " membres",
                    type: ActivityType.Watching,
                },
            ],
            status: "dnd",
        });
    }

    private GetJson(commands: Collection<string, Command>) {
        const data: object[] = [];

        commands.forEach((command: Command) => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                cooldown: command.cooldown,
                category: command.category,
                dm_permission: command.dm_permission,
                default_member_permissions: command.default_member_permissions.toString(),
            });
        });

        return data;
    }
}
