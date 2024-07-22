import { model, Schema } from "mongoose";

interface IUserConfig {
    userId: string;
    guildId: string;
    credit: number;
    clan: string;
    inventory: {
        size: number;
        content: {
            rarity: string;
            name: string;
            quantity: number;
        }[];
    };
    level: {
        xp: number;
        level: number;
    };
}

export default model<IUserConfig>(
    "UserConfig",

    new Schema<IUserConfig>(
        {
            userId: {
                type: String,
                required: true,
            },
            guildId: {
                type: String,
                required: true,
            },
            credit: {
                type: Number,
                default: 0,
            },
            clan: {
                type: String,
                default: "",
            },
            inventory: {
                size: {
                    type: Number,
                    default: 50,
                },
                content: {
                    type: [
                        {
                            rarity: String,
                            name: String,
                            quantity: Number,
                        },
                    ],
                    default: [],
                },
            },
            level: {
                xp: {
                    type: Number,
                    default: 0,
                },
                level: {
                    type: Number,
                    default: 1,
                },
            },
        },
        {
            timestamps: true,
        }
    )
);
