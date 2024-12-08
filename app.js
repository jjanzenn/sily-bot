import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

const client = new Client ({ intents: [GatewayIntentBits.Guilds] });
var jobs = {};
const job_crons = {};
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    fs.readFile('jobs.json', 'utf8', (err,data) => {
        jobs = err ? {} : JSON.parse(data);

        Object.keys(jobs).forEach((job) => {
            job_crons[job] = cron.schedule(jobs[job].crontab, () => {
                client.channels.cache.get(jobs[job].channel_id).send(jobs[job].message);
            });
        });
    });
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
      const { name, options, guild_id } = data;

      if (name === 'schedule_message') {
          const message = options[0].value;
          const crontab = options[1].value;
          const valid = cron.validate(crontab);
          const id = uuidv4();

          const content = valid ? `registered message: "${message}" with cron: "${crontab}" and id: "${id}"` : 'invalid cron';

          if (valid) {
              jobs[id] = {
                  message: message,
                  crontab: crontab,
                  channel_id: req.body.channel_id,
              };
              job_crons[id] = cron.schedule(crontab, () => {
                  client.channels.cache.get(req.body.channel_id).send(message);
              });

              const json = JSON.stringify(jobs);
              fs.writeFile('jobs.json', json, 'utf8', err => {
                  if (err) {
                      console.error(err);
                  }
              });

              cron.schedule(crontab, () => {
                  client.channels.cache.get(req.body.channel_id).send(message)
              });
          }

          return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                  content: content,
              },
          });
      } else if (name === 'unschedule_message') {
          const id = options[0].value;
          const content = id in jobs ? `stopped job ${id}` : `no such job ${id}`;
          if (id in jobs) {
              delete jobs[id]
              delete job_crons[id];

              const json = JSON.stringify(jobs);
              fs.writeFile('jobs.json', json, 'utf8', err => {
                  if (err) {
                      console.error(err);
                  }
              });
          }

          return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                  content: content,
              },
          });
      }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
