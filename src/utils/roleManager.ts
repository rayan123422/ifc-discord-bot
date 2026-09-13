import { Guild, User } from 'discord.js';
import { prisma } from '../index';

export async function assignClubRole(
  guild: Guild,
  user: User,
  clubId: string
) {
  try {
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club || !club.discordRoleId) return;

    const member = await guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.add(club.discordRoleId);
    console.log(`✅ Added club role to ${user.tag}`);
  } catch (error) {
    console.error('Failed to assign club role:', error);
  }
}

export async function removeClubRole(
  guild: Guild,
  user: User,
  clubId: string
) {
  try {
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club || !club.discordRoleId) return;

    const member = await guild.members.fetch(user.id);
    if (!member) return;

    await member.roles.remove(club.discordRoleId);
    console.log(`✅ Removed club role from ${user.tag}`);
  } catch (error) {
    console.error('Failed to remove club role:', error);
  }
}

export async function removeOldClubRoles(
  guild: Guild,
  user: User,
  leagueId: string,
  exceptClubId?: string
) {
  try {
    const clubs = await prisma.club.findMany({
      where: {
        leagueId,
        discordRoleId: { not: null },
      },
    });

    const member = await guild.members.fetch(user.id);
    if (!member) return;

    for (const club of clubs) {
      if (club.discordRoleId && club.id !== exceptClubId) {
        await member.roles.remove(club.discordRoleId).catch(() => {});
      }
    }
    console.log(`✅ Removed all club roles from ${user.tag}`);
  } catch (error) {
    console.error('Failed to remove club roles:', error);
  }
}
