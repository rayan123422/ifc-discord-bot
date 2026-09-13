import { Client, Collection, GatewayIntentBits, ChannelType } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

export const prisma = new PrismaClient();

// Extend client with commands collection
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

(client as any).commands = new Collection();
(client as any).cooldowns = new Collection();
(client as any).prisma = prisma;

// Load command files
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath)
  .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  try {
    const command = require(filePath).default;
    if (command.data && command.execute) {
      (client as any).commands.set(command.data.name, command);
      console.log(`✅ Loaded command: ${command.data.name}`);
    }
  } catch (error) {
    console.error(`Failed to load command ${file}:`, error);
  }
}

// Load event files
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath)
  .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  try {
    const event = require(filePath).default;
    if (event.name && event.execute) {
      if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
      } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
      }
      console.log(`✅ Loaded event: ${event.name}`);
    }
  } catch (error) {
    console.error(`Failed to load event ${file}:`, error);
  }
}

client.login(process.env.DISCORD_TOKEN);
