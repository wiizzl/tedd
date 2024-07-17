import { Collection } from "discord.js";

import IConfig from "./IConfig";

import Command from "../classes/Command";
import Interaction from "../classes/Interaction";
import SubCommand from "../classes/SubCommand";

export default interface ICustomClient {
    config: IConfig;
    commands: Collection<string, Command>;
    interactions: Collection<string, Interaction>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    Init(): void;
    LoadHandlers(): void;
}
