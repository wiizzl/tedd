import { model, Schema } from "mongoose";

interface IGuildConfig {
    guildId: string;
    logs: {
        moderation: {
            enabled: boolean;
            channelId: string;
        };
        messages: {
            enabled: boolean;
            channelId: string;
        };
        voices: {
            enabled: boolean;
            channelId: string;
        };
        tickets: {
            enabled: boolean;
            channelId: string;
        };
        joins: {
            enabled: boolean;
            channelId: string;
        };
    };
    voice: {
        channelId: string;
    };
}

export default model<IGuildConfig>(
    "GuildConfig",

    new Schema<IGuildConfig>(
        {
            guildId: {
                type: String,
                required: true,
            },
            logs: {
                moderation: {
                    enabled: Boolean,
                    channelId: String,
                },
                messages: {
                    enabled: Boolean,
                    channelId: String,
                },
                voices: {
                    enabled: Boolean,
                    channelId: String,
                },
                tickets: {
                    enabled: Boolean,
                    channelId: String,
                },
                joins: {
                    enabled: Boolean,
                    channelId: String,
                },
            },
            voice: {
                channelId: String,
            },
        },
        {
            timestamps: true,
        }
    )
);
