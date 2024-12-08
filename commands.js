import 'dotenv/config';
import {InstallGlobalCommands} from './utils.js';

const SCHEDULE_MESSAGE = {
    name: 'schedule_message',
    description: 'Register a message to be sent at a specific time',
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
            name: 'crontab_string',
            description: 'the time the message should be sent at in crontab format',
            required: true,
        },
        {
            type: 4,
            name: 'repeat',
            description: 'how many times should the message be repeated? (0 is infinite and the default)',
            required: false,
            min_value: 0,
        },
    ],
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

const ALL_COMMANDS = [SCHEDULE_MESSAGE];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
