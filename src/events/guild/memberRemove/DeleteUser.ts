import { Events, GuildMember } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import UserConfig from "../../../base/schemas/UserConfig";

export default class DeleteUser extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildMemberRemove,
            description: "Delete user from database when he leave the server.",
            once: false,
        });
    }

    async Execute(member: GuildMember) {
        try {
            if (await UserConfig.findOne({ userId: member.user.id, guildId: member.guild.id })) {
                await UserConfig.deleteOne({ userId: member.user.id, guildId: member.guild.id });
            }
        } catch (error) {
            console.error(error);
        }
    }
}
