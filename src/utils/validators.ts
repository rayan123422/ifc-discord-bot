import { prisma } from '../index';

export async function validateClubOwnership(userId: string, clubId: string): Promise<boolean> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
  });
  return club?.managerId === userId;
}

export async function validateClubBudget(clubId: string, amount: bigint): Promise<boolean> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
  });
  if (!club) return false;
  return club.budget >= amount;
}

export async function validateRosterLimit(clubId: string): Promise<boolean> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: { players: true },
  });
  if (!club) return false;
  return club.players.length < club.rosterLimit;
}

export async function validatePlayerFreeAgent(playerId: string): Promise<boolean> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { contracts: true },
  });
  if (!player) return false;
  
  const activeContract = player.contracts.find(c => c.status === 'ACTIVE');
  return !activeContract;
}

export async function validatePlayerExists(playerId: string): Promise<boolean> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });
  return !!player;
}
