import "dotenv/config";
import cron, { schedule } from "node-cron";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";

export class Message {
    constructor(message, channel_id, crontab, repeat = true, id = null) {
        this.id = id ? id : uuidv4();
        this.repeat = repeat;

        this.channel_id = channel_id;
        this.message = message;
        this.crontab = crontab;
    }
}

export class MessageSchedule {
    constructor(state) {
        this.state = state;
        this.crons = {};

        // read db file if there is one and start up all jobs
        fs.readFile(state.job_db, "utf8", (err, data) => {
            this.jobs = err ? {} : JSON.parse(data);

            Object.keys(this.jobs).forEach((job) => {
                // fix incompatibility with older storage version
                const repeat = this.jobs[job].repeat
                    ? this.jobs[job].repeat
                    : true;
                this.jobs[job].id = job;
                this.jobs[repeat].id = job;

                this.schedule(this.jobs[job]);
            });
        });
    }

    save() {
        const json = JSON.stringify(this.jobs);
        fs.writeFile(this.state.job_db, json, "utf8", (err) => {
            if (err) console.log(err);
        });
    }

    schedule(message) {
        const valid = cron.validate(message.crontab);

        if (valid) {
            this.jobs[message.id] = message;

            this.crons[message.id] = cron.schedule(
                message.crontab,
                () => {
                    this.state.client.channels.cache
                        .get(message.channel_id)
                        .send(message.message);
                    if (!message.repeat) {
                        this.unschedule(message.id);
                    }
                },
                {
                    scheduled: true,
                    timezone: process.env.TIMEZONE,
                },
            );

            this.save();
        }

        return valid;
    }

    unschedule(id) {
        var valid = true;
        if (id in this.jobs) {
            delete this.jobs[id];
        } else {
            valid = false;
        }
        if (id in this.crons) {
            this.crons[id].stop();
            delete this.crons[id];
        } else {
            valid = false;
        }

        this.save();

        return valid;
    }
}
