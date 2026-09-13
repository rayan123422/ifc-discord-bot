import { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../index';

export async function checkPermission(
  interaction: ChatInputCommandInteraction,
  permission: string,
  leagueId?: string
): Promise<boolean> {
  // Owner/Admin override
  if (interaction.user.id === process.env.OWNER_ID) return true;

  const user = await prisma.user.findUnique({
    where: { discordId: interaction.user.id },
  });

  if (!user) return false;

  const setting = await prisma.setting.findUnique({
    where: {
      leagueId_key: {
        leagueId: leagueId || '',
        key: permission,
      },
    },
  });

  if (!setting) return false;

  const roleIds = JSON.parse(setting.value);
  const memberRoles = interaction.member?.roles as any;
  
  return roleIds.some((roleId: string) => memberRoles.cache.has(roleId));
}

export async function checkManagerPermission(
  interaction: ChatInputCommandInteraction,
  clubId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { discordId: interaction.user.id },
    include: { managedClubs: true },
  });

  if (!user) return false;
  return user.managedClubs.some(club => club.id === clubId);
}

export async function checkStaffPermission(
  interaction: ChatInputCommandInteraction,
  leagueId: string
): Promise<boolean> {
  const adminSetting = await prisma.setting.findUnique({
    where: {
      leagueId_key: {
        leagueId,
        key: 'staff_roles',
      },
    },
  });

  if (!adminSetting) return false;

  const staffRoleIds = JSON.parse(adminSetting.value);
  const memberRoles = interaction.member?.roles as any;

  return staffRoleIds.some((roleId: string) => memberRoles.cache.has(roleId));
}
