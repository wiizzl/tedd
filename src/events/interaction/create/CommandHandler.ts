import { ChatInputCommandInteraction, Collection, EmbedBuilder, Events } from "discord.js";

import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import Emojis from "../../../base/enums/Emojis";

export default class CommandHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Command handler event",
            once: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command: Command = this.client.commands.get(interaction.commandName)!;

        if (!command) {
            this.client.commands.delete(interaction.commandName);

            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Cette commande n'a pas d'action associée.`)],
                ephemeral: true,
            });
        }

        const { cooldowns } = this.client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;
        const cooldown = timestamps.get(interaction.user.id) || 0;

        const isAdmin =
            typeof interaction.member?.permissions === "string"
                ? interaction.member?.permissions.includes("Administrator")
                : interaction.member?.permissions.has("Administrator");

        if (timestamps.has(interaction.user.id) && cooldown && now < cooldown + cooldownAmount && !isAdmin) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `${Emojis.Cross} Merci d'attendre \`${((cooldown + cooldownAmount - now) / 1000).toFixed(
                                0
                            )} secondes\` avant de ré-exécuter la commande.`
                        ),
                ],
                ephemeral: true,
            });
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => {
            timestamps.delete(interaction.user.id);
        }, cooldownAmount);

        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${
                interaction.options.getSubcommand(false) || ""
            }`;

            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
}
