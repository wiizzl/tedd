"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const mongoose_1 = require("mongoose");
const Handler_1 = __importDefault(require("./Handler"));
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [new discord_js_1.IntentsBitField(3276799)],
        });
        this.handler = new Handler_1.default(this);
        this.config = require(`${process.cwd()}/data/config.json`);
        this.commands = new discord_js_1.Collection();
        this.interactions = new discord_js_1.Collection();
        this.subCommands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
    }
    Init() {
        this.LoadHandlers();
        this.login(this.config.token).catch((error) => console.error(error));
        (0, mongoose_1.connect)(this.config.mongoUrl)
            .then(() => console.log("Connected to MongoDB."))
            .catch((error) => console.error(error));
    }
    LoadHandlers() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
        this.handler.LoadInteractions();
    }
}
exports.default = CustomClient;
