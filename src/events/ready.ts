import { Client } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { readdirSync } from 'fs';
import { join } from 'path';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

const loadCommands = () => {
  const commands = [];
  const commandsPath = join(__dirname, '../commands');
  const commandFiles = readdirSync(commandsPath)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(join(commandsPath, file)).default;
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    } catch (error) {
      console.error(`Failed to load command ${file}:`, error);
    }
  }

  return commands;
};

export default {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);

    const commands = loadCommands();
    console.log(`📝 Registering ${commands.length} commands...`);

    try {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          process.env.GUILD_ID!
        ),
        { body: commands }
      );
      console.log(`✅ Successfully registered ${commands.length} commands`);
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  },
};
