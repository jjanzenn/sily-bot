import { InteractionResponseType } from "discord-interactions";
import { Message } from "./message-scheduler.js";

function send(state, content) {
    return state.res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: content,
        },
    });
}

export function schedule_message(state, msg, channel, crontab) {
    const message = new Message(msg, channel, crontab);

    const schedule_valid = state.schedule.schedule(message);

    return send(
        state,
        schedule_valid
            ? `registered message: "${msg}" with cron: "${crontab}" and id: "${message.id}"`
            : "invalid cron",
    );
}

export function unschedule_message(state, id) {
    const unschedule_valid = state.schedule.unschedule(id);

    return send(
        state,
        unschedule_valid ? `stopped job ${id}` : `no such job ${id}`,
    );
}

export function pet(state) {
    return send(state, "[purring noises]");
}

export function help(state) {
    return send(
        state,
        `Hi, I'm sily-bot!
Here are the available commands and their descriptions:
- \`/pet\`  You can pet sily-bot.
- \`/schedule-message <message> <cron>\`  Schedule a message to be send later. Works like Linux cron jobs in the format second minute hour day month weekday. Put the number (or name of month or weekday) in each spot. If you want it to run every second, minute, etc. instead of once when it reaches the provided number, use a * instead of a number. For instance, to run a job every minute on January 4th, you might use 0 * * 4 January *. The bot replies with a UUID that can be used to cancel the cron job later.
- \`/unschedule-message <id>\`  Stop sending a message with the given id.`,
    );
}
