import { glob } from "glob";
import path from "path";

import Command from "./Command";
import CustomClient from "./CustomClient";
import Event from "./Event";
import Interaction from "./Interaction";
import SubCommand from "./SubCommand";

import IHandler from "../interfaces/IHandler";

export default class Handler implements IHandler {
    client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async LoadEvents() {
        const files = (await glob(`build/events/**/*.js`)).map((filePath) => path.resolve(filePath));

        files.map(async (file: string) => {
            const event: Event = new (await import(file)).default(this.client);

            if (!event.name) {
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name.`);
            }

            const execute = (...args: any) => event.Execute(...args);

            if (event.once) {
                //@ts-ignore
                this.client.once(event.name, execute);
            } else {
                //@ts-ignore
                this.client.on(event.name, execute);
            }

            return delete require.cache[require.resolve(file)];
        });
    }

    async LoadCommands() {
        const files = (await glob(`build/commands/**/*.js`)).map((filePath) => path.resolve(filePath));

        files.map(async (file: string) => {
            const command: Command | SubCommand = new (await import(file)).default(this.client);

            if (!command.name) {
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name.`);
            }

            if (file.split("/").pop()?.split(".")[2]) {
                return this.client.subCommands.set(command.name, command);
            }

            this.client.commands.set(command.name, command as Command);

            return delete require.cache[require.resolve(file)];
        });
    }

    async LoadInteractions() {
        const files = (await glob(`build/interactions/**/*.js`)).map((filePath) => path.resolve(filePath));

        files.map(async (file: string) => {
            const interaction: Interaction = new (await import(file)).default(this.client);

            if (!interaction.name) {
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name.`);
            }

            this.client.interactions.set(interaction.name, interaction as Interaction);

            return delete require.cache[require.resolve(file)];
        });
    }
}
