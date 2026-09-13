import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { Player, Club, Contract, Offer } from '@prisma/client';

const COLORS = {
  SUCCESS: '#00ff00',
  ERROR: '#ff0000',
  INFO: '#0099ff',
  WARNING: '#ffaa00',
  TRANSFER: '#ff6600',
};

export function createPlayerEmbed(player: any, club?: any): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${player.profile?.user?.displayName || 'Unknown Player'}`)
    .setColor(COLORS.INFO as ColorResolvable)
    .addFields(
      { name: 'Position', value: player.profile?.position || 'Unknown', inline: true },
      { name: 'Overall', value: `${player.profile?.overallRating || 50}`, inline: true },
      { name: 'Country', value: player.profile?.country || 'N/A', inline: true },
      { name: 'Current Club', value: club?.name || 'Free Agent', inline: true },
      { name: 'Market Value', value: `$${Number(player.currentValue).toLocaleString()}`, inline: true },
      { name: 'Valuation Tier', value: player.valuationTier, inline: true }
    )
    .setTimestamp();
}

export function createSigningEmbed(player: any, club: any, offer: any): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`🎉 New Signing: ${player.profile?.user?.displayName}`)
    .setColor(COLORS.SUCCESS as ColorResolvable)
    .setThumbnail(club.logoUrl || '')
    .addFields(
      { name: 'Player', value: player.profile?.user?.displayName || 'Unknown', inline: true },
      { name: 'Position', value: player.profile?.position || 'N/A', inline: true },
      { name: 'Overall', value: `${player.profile?.overallRating || 50}`, inline: true },
      { name: 'Club', value: club.name, inline: true },
      { name: 'Market Value', value: `$${Number(player.currentValue).toLocaleString()}`, inline: true },
      { name: 'Contract Length', value: `${offer.contractMonths} months`, inline: true },
      { name: 'Salary', value: `$${Number(offer.salaryOffer).toLocaleString()}/mo`, inline: true }
    )
    .setTimestamp();
}

export function createTransferEmbed(player: any, fromClub: any, toClub: any, fee: bigint): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`🔄 Transfer Complete: ${player.profile?.user?.displayName}`)
    .setColor(COLORS.TRANSFER as ColorResolvable)
    .setThumbnail(toClub.logoUrl || '')
    .addFields(
      { name: 'Player', value: player.profile?.user?.displayName || 'Unknown', inline: false },
      { name: 'From', value: fromClub.name, inline: true },
      { name: 'To', value: toClub.name, inline: true },
      { name: 'Transfer Fee', value: `$${Number(fee).toLocaleString()}`, inline: true },
      { name: 'Market Value', value: `$${Number(player.currentValue).toLocaleString()}`, inline: true }
    )
    .setTimestamp();
}

export function createLoanEmbed(player: any, ownerClub: any, loanClub: any, loanFee: bigint): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`📋 Loan Agreement: ${player.profile?.user?.displayName}`)
    .setColor(COLORS.INFO as ColorResolvable)
    .setThumbnail(loanClub.logoUrl || '')
    .addFields(
      { name: 'Player', value: player.profile?.user?.displayName || 'Unknown', inline: false },
      { name: 'Owner Club', value: ownerClub.name, inline: true },
      { name: 'Loan Club', value: loanClub.name, inline: true },
      { name: 'Loan Fee', value: `$${Number(loanFee).toLocaleString()}`, inline: true },
      { name: 'Market Value', value: `$${Number(player.currentValue).toLocaleString()}`, inline: true }
    )
    .setTimestamp();
}

export function createOfferEmbed(player: any, fromClub: any, offer: any): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`📥 New Offer: ${player.profile?.user?.displayName}`)
    .setColor(COLORS.INFO as ColorResolvable)
    .setThumbnail(fromClub.logoUrl || '')
    .addFields(
      { name: 'From Club', value: fromClub.name, inline: true },
      { name: 'Position', value: player.profile?.position || 'N/A', inline: true },
      { name: 'Market Value', value: `$${Number(player.currentValue).toLocaleString()}`, inline: true },
      { name: 'Salary', value: `$${Number(offer.salaryOffer).toLocaleString()}/month`, inline: true },
      { name: 'Contract Length', value: `${offer.contractMonths} months`, inline: true },
      { name: 'Message', value: offer.managerMessage || 'No message', inline: false }
    )
    .setTimestamp();
}
