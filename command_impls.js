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
