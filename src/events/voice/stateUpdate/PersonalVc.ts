import { ActionRowBuilder, ChannelType, EmbedBuilder, Events, StringSelectMenuBuilder, VoiceChannel, VoiceState } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class PersonalVc extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.VoiceStateUpdate,
            description: "Create a personal voice channel when user join a voice channel.",
            once: false,
        });
    }

    async Execute(oldState: VoiceState, newState: VoiceState) {
        const guild = await GuildConfig.findOne({ guildId: oldState.guild.id });
        const voice = guild?.voice;

        if (guild && voice?.channelId) {
            const member = oldState.member;

            if (newState.channelId === null && oldState.channel?.name.startsWith("Salon de ")) {
                if (oldState.channel.members.size !== 0) return;

                oldState.channel.delete();
            }

            try {
                const createChannel = (await newState.guild?.channels.fetch(voice.channelId)) as VoiceChannel;

                if (newState.channelId !== createChannel.id) return;

                const newChannel = await newState.guild?.channels.create({
                    name: `Salon de ${member?.user.displayName}`,
                    type: ChannelType.GuildVoice,
                    parent: createChannel.parent,
                    userLimit: 4,
                });

                await member?.voice.setChannel(newChannel);

                return await newChannel.send({
                    content: `Propriétaire du salon :${member?.user}`,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "Configuration du salon vocal", iconURL: member?.displayAvatarURL() })
                            .setDescription(
                                "Voici l'espace de configuration de votre salon vocal temporaire. Les différentes options disponibles vous permettent de personnaliser les permissions de votre salon selon vos préférences."
                            ),
                    ],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
                            new StringSelectMenuBuilder()
                                .setCustomId("voice")
                                .setPlaceholder("Modifier le statut du salon.")
                                .addOptions([
                                    {
                                        label: "Ouvert",
                                        value: "open",
                                        description: "Salon ouvert à tous.",
                                        emoji: "🔓",
                                    },
                                    {
                                        label: "Fermé",
                                        value: "closed",
                                        description: "Salon visible mais non accessible.",
                                        emoji: "🔒",
                                    },
                                    {
                                        label: "Privé",
                                        value: "locked",
                                        description: "Salon accessible mais non visible.",
                                        emoji: "🔐",
                                    },
                                ]),
                        ]),
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}
