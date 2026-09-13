import { prisma } from '../index';

export async function createAuditLog(
  leagueId: string,
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  details: Record<string, any>
) {
  try {
    await prisma.auditLog.create({
      data: {
        leagueId,
        userId,
        action,
        entity,
        entityId,
        details: JSON.stringify(details),
      },
    });
    console.log(`📝 Audit log: ${action} on ${entity} ${entityId}`);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
