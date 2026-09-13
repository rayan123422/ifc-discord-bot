import { Interaction } from 'discord.js';

export default {
  name: 'interactionCreate',
  async execute(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const command = (interaction.client as any).commands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: '❌ Command not found', ephemeral: true });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const reply = { content: '❌ Error executing command', ephemeral: true };
        if (interaction.replied) {
          await interaction.followUp(reply);
        } else if (interaction.deferred) {
          await interaction.editReply(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    } else if (interaction.isButton()) {
      // Handle button interactions
      const [action, ...data] = interaction.customId.split(':');
      
      try {
        switch (action) {
          case 'accept_offer':
            await require('../handlers/offers').handleAcceptOffer(interaction, data);
            break;
          case 'reject_offer':
            await require('../handlers/offers').handleRejectOffer(interaction, data);
            break;
          case 'lfp_interest':
            await require('../handlers/lfp').handleLfpInterest(interaction, data);
            break;
          case 'view_player':
            await require('../handlers/players').handleViewPlayer(interaction, data);
            break;
          default:
            await interaction.reply({ content: '❌ Unknown action', ephemeral: true });
        }
      } catch (error) {
        console.error('Button interaction error:', error);
        await interaction.reply({ content: '❌ Error processing action', ephemeral: true });
      }
    }
  },
};
