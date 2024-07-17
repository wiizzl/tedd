"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)("GuildConfig", new mongoose_1.Schema({
    guildId: String,
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
    },
    voice: {
        channelId: String,
    },
}, {
    timestamps: true,
}));
