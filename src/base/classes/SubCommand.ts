import { ChatInputCommandInteraction } from "discord.js";

import CustomClient from "./CustomClient";

import ISubCommand from "../interfaces/ISubCommand";
import ISubCommandOptions from "../interfaces/ISubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: CustomClient;
    name: string;

    constructor(client: CustomClient, options: ISubCommandOptions) {
        this.client = client;
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction): void {}
}
