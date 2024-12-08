import 'dotenv/config';

import { REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'schedule_message',
        description: 'Register a message to run as a cron job',
        type: 1,
        options: [
            {
                type: 3,
                name: 'message',
                description: 'the message to send',
                required: true,
            },
            {
                type: 3,
                name: 'crontab',
                description: 'the schedule for the message',
                required: true,
            },
        ],
        integration_types: [0],
        contexts: [0],
    },
    {
        name: 'unschedule_message',
        description: 'Stop sending a scheduled message',
        type: 1,
        options: [
            {
                type: 3,
                name: 'id',
                description: 'the id of the message to stop',
                required: true,
            },
        ],
        integration_types: [0],
        contexts: [0],
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing application commands.');

    await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });

    console.log('Successfully reloaded application commands.');
} catch (error) {
    console.error(error);
}
