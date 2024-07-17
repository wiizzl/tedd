"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = __importDefault(require("../../base/classes/Event"));
class Ready extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.ClientReady,
            description: "Ready Event",
            once: true,
        });
    }
    Execute() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username} is now online.`);
            const rest = new discord_js_1.REST().setToken(this.client.config.token);
            const setCommands = yield rest.put(discord_js_1.Routes.applicationCommands(this.client.config.id), {
                body: this.GetJson(this.client.commands),
            });
            console.log(`Successfully loaded ${setCommands.length} commands.`);
            const guild = this.client.guilds.cache.get(this.client.config.guild);
            (_b = this.client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
                activities: [
                    {
                        name: (guild === null || guild === void 0 ? void 0 : guild.memberCount) + " membres",
                        type: discord_js_1.ActivityType.Watching,
                    },
                ],
                status: "dnd",
            });
        });
    }
    GetJson(commands) {
        const data = [];
        commands.forEach((command) => {
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
exports.default = Ready;
