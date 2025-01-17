import "dotenv/config";
import express from "express";
import {
    InteractionType,
    InteractionResponseType,
    verifyKeyMiddleware,
} from "discord-interactions";
import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import {
    blep,
    help,
    pet,
    schedule_message,
    catfact,
    fomx,
    factcheck,
} from "./command_impls.js";
import { MessageSchedule } from "./message-scheduler.js";

class State {
    constructor() {
        this.job_db = "jobs.json";
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }
}

function handle_application_command(state, data, channel_id) {
    const { name, options } = data;

    switch (name) {
        case "schedule_message":
            return schedule_message(
                state,
                options[0].value,
                channel_id,
                options[1].value,
            );

        case "pet":
            return pet(state);

        case "help":
            return help(state);

        case "blep":
            return blep(state);

        case "catfact":
            return catfact(state);

        case "fomx":
            return fomx(state);

        case "factcheck":
            if (options && options.length >= 1)
                return factcheck(state, options[0].value);
            else return factcheck(state, True);

        default:
            console.error(`unknown command: ${name}`);
            return state.res.status(400).json({ error: "unknown command" });
    }
}

function handle_button_press(state, data) {
    if (data.custom_id.startsWith("stop-")) {
        state.schedule.unschedule(data.custom_id.slice(5));

        return state.res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "no longer sending this message",
            },
        });
    }
    return res.status(400).json({ error: "unknown command" });
}

function main() {
    const state = new State();

    state.client.on("ready", () => {
        console.log(`Logged in as ${state.client.user.tag}!`);
        state.schedule = new MessageSchedule(state);
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
            const { type, data, channel_id } = req.body;

            state.res = res;
            switch (type) {
                case InteractionType.PING:
                    return res.send({ type: InteractionResponseType.PONG });
                case InteractionType.APPLICATION_COMMAND:
                    return handle_application_command(state, data, channel_id);
                case InteractionType.MESSAGE_COMPONENT:
                    return handle_button_press(state, data);
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
