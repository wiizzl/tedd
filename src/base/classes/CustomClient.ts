import { Client, Collection, IntentsBitField } from "discord.js";
import { connect } from "mongoose";

import Command from "./Command";
import Handler from "./Handler";
import Interaction from "./Interaction";
import SubCommand from "./SubCommand";

import IConfig from "../interfaces/IConfig";
import ICustomClient from "../interfaces/ICustomClient";

export default class CustomClient extends Client implements ICustomClient {
    handler: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    interactions: Collection<string, Interaction>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor() {
        super({
            intents: [new IntentsBitField(3276799)],
        });

        this.handler = new Handler(this);
        this.config = require(`${process.cwd()}/data/config.json`);
        this.commands = new Collection();
        this.interactions = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
    }

    Init(): void {
        this.LoadHandlers();

        this.login(this.config.token).catch((error) => console.error(error));

        connect(this.config.mongoUrl)
            .then(() => console.log("Connected to MongoDB."))
            .catch((error) => console.error(error));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
        this.handler.LoadInteractions();
    }
}
