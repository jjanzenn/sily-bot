import { InteractionResponseType } from "discord-interactions";
import { Message } from "./message-scheduler.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { get } from "https";

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
- \`/catfact\`  Get a fact about cats.
- \`/factcheck\`  Commune with the sacred boar at the centre of the world to check a fact.
- \`/fomx\`  Get an image of a fox.
- \`/help\`  Show this message.
- \`/pet\`  You can pet sily-bot.
- \`/schedule-message <message> <cron>\`  Schedule a message to be sent later. Works like Linux cron jobs in the format second minute hour day month weekday. Put the number (or name of month or weekday) in each spot. If you want it to run every second, minute, etc. instead of once when it reaches the provided number, use a \`*\` instead of a number. For instance, to run a job every minute on January 4th, you might use \`0 * * 4 January *\`.`,
    });
}

export function blep(state) {
    return send(state, { content: "≽^•𐃷•^≼" });
}

export function catfact(state) {
    get("https://meowfacts.herokuapp.com/", (res) => {
        res.on("data", (d) => {
            const obj = JSON.parse(d);
            const fact = obj.data[0];
            return send(state, { content: fact });
        });
    }).on("error", (e) => {
        console.error(e);
        return send(state, { content: "failed to request fact" });
    });
}

export function fomx(state) {
    get("https://randomfox.ca/floof/", (res) => {
        res.on("data", (d) => {
            const obj = JSON.parse(d);
            const fomx = obj.image;
            return send(state, { content: fomx });
        });
    }).on("error", (e) => {
        console.error(e);
        return send(state, { content: "failed to get fomx" });
    });
}

export function factcheck(state) {
    const truth = Math.random() > 0.5 ? true : false;
    if (truth)
        return send(state, {
            content: "https://jjanzen.ca/images/true-boar.png",
        });
    else
        return send(state, {
            content: "https://jjanzen.ca/images/false-boar.png",
        });
}
