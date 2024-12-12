import { InteractionResponseType } from "discord-interactions";
import { Message } from "./message-scheduler.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

function send(state, data) {
    return state.res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: data,
    });
}

export function schedule_message(state, msg, channel, crontab) {
    const message = new Message(msg, channel, crontab);

    const schedule_valid = state.schedule.schedule(message);

    const cancel = new ButtonBuilder()
        .setCustomId(`stop-${message.id}`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);

    return send(state, {
        content: schedule_valid
            ? `registered message: "${msg}" with cron: "${crontab}"`
            : "invalid cron",
        components: [new ActionRowBuilder().addComponents(cancel)],
    });
}

export function pet(state) {
    return send(state, { content: "[purring noises]" });
}

export function help(state) {
    return send(state, {
        content: `Hi, I'm sily-bot!
Here are the available commands and their descriptions:
- \`/blep\`  blep.
- \`/help\`  Show this message.
- \`/pet\`  You can pet sily-bot.
- \`/schedule-message <message> <cron>\`  Schedule a message to be send later. Works like Linux cron jobs in the format second minute hour day month weekday. Put the number (or name of month or weekday) in each spot. If you want it to run every second, minute, etc. instead of once when it reaches the provided number, use a \`*\` instead of a number. For instance, to run a job every minute on January 4th, you might use \`0 * * 4 January *\`.`,
    });
}

export function blep(state) {
    return send(
        state,
        "https://cdn.discordapp.com/app-icons/1314742798888472687/9f31a290c4c52f7eff54efd01112ab0b.png?size=512",
    );
}
