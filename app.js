import "dotenv/config";
import express from "express";
import {
    InteractionType,
    InteractionResponseType,
    verifyKeyMiddleware,
} from "discord-interactions";
import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { pet, schedule_message, unschedule_message } from "./command_impls.js";

class State {
    constructor() {
        this.job_db = "jobs.json";
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }
}

function handle_application_command(state, data) {
    const { name, options, channel_id } = data;

    switch (name) {
        case "schedule_message":
            return schedule_message(
                state,
                options[0].value,
                channel_id,
                options[1].value,
            );

        case "unschedule_message":
            return unschedule_message(state, options[0].value);

        case "pet":
            return pet(state);

        default:
            console.error(`unknown command: ${name}`);
            return res.status(400).json({ error: "unknown command" });
    }
}

function main() {
    const state = new State();

    state.client.on("ready", () => {
        console.log(`Logged in as ${state.client.user.tag}!`);
        state.schedule = MessageSchedule(state);
        state.client.user.setPresence({
            activities: [
                {
                    name: "sily",
                    type: ActivityType.Playing,
                },
            ],
            status: "idle",
        });
    });

    state.client.login(process.env.DISCORD_TOKEN);

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.post(
        "/",
        verifyKeyMiddleware(process.env.PUBLIC_KEY),
        async (req, res) => {
            const { type, data } = req.body;

            state.res = res;
            switch (type) {
                case InteractionType.PING:
                    return res.send({ type: InteractionResponseType.PONG });
                case InteractionType.APPLICATION_COMMAND:
                    return handle_application_command(state, data);
                default:
                    console.error("unknown interaction type", type);
                    return res
                        .status(400)
                        .json({ error: "unknown interaction type" });
            }
        },
    );

    app.listen(PORT, () => {
        console.log("Listening on port", PORT);
    });
}

main();
