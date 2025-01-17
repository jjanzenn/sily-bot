import "dotenv/config";

import { REST, Routes } from "discord.js";

const commands = [
    {
        name: "blep",
        description: "blep",
        type: 1,
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "help",
        description: "get help",
        type: 1,
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "pet",
        description: "pet sily bot",
        type: 1,
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "catfact",
        description: "get a cat fact",
        type: 1,
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "fomx",
        description: "get a fomx picture",
        type: 1,
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "factcheck",
        description: "check a fact",
        type: 1,
        options: [
            {
                type: 5,
                name: "true",
                description: "truth value of fact check",
                required: false,
            },
        ],
        integration_types: [0],
        contexts: [0],
    },
    {
        name: "schedule_message",
        description: "Register a message to run as a cron job",
        type: 1,
        options: [
            {
                type: 3,
                name: "message",
                description: "the message to send",
                required: true,
            },
            {
                type: 3,
                name: "crontab",
                description: "the schedule for the message",
                required: true,
            },
        ],
        integration_types: [0],
        contexts: [0],
    },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log("Started refreshing application commands.");

    await rest.put(Routes.applicationCommands(process.env.APP_ID), {
        body: commands,
    });

    console.log("Successfully reloaded application commands.");
} catch (error) {
    console.error(error);
}
