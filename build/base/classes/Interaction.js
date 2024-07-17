"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Interaction {
    constructor(client, options) {
        this.client = client;
        this.name = options.name;
        this.permissions = options.permissions;
        this.type = options.type;
    }
    Execute(interaction) { }
}
exports.default = Interaction;
