import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

import UserConfig from "../../base/schemas/UserConfig";

export default class Emit extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "give",
            description: "Donner un objet à un joueur.",
            category: Category.Development,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 1,
            options: [
                {
                    name: "object",
                    description: "Nom de l'objet à donner.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "quantity",
                    description: "Nombre d'exemplaire de cet objet à donner.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        {
                            name: "1",
                            value: 1,
                        },
                        {
                            name: "5",
                            value: 5,
                        },
                        {
                            name: "10",
                            value: 10,
                        },
                    ],
                },
                {
                    name: "rarity",
                    description: "Rareté de l'objet à donner.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "target",
                    description: "Utilisateur à qui donner l'objet.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const object = interaction.options.getString("object");
        const quantity = interaction.options.getInteger("quantity");
        const rarity = interaction.options.getString("rarity");
        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;

        const existingWeapon = await UserConfig.findOne({
            userId: target.id,
            guildId: interaction.guild?.id,
            "inventory.content.name": object,
        });

        if (existingWeapon) {
            await UserConfig.updateOne(
                { userId: target.id, guildId: interaction.guild?.id, "inventory.content.name": object },
                {
                    $inc: { "inventory.content.$.quantity": quantity },
                }
            );
        } else {
            await UserConfig.updateOne(
                { userId: target.id, guildId: interaction.guild?.id },
                {
                    $push: { "inventory.content": { rarity: rarity, name: object, quantity: quantity } },
                }
            );
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`${Emojis.Tick} Vous avez donné \`${quantity}\` exemplaire(s) de \`${object}\` (\`${rarity}\`) à ${target}.`),
            ],
            ephemeral: true,
        });
    }
}
