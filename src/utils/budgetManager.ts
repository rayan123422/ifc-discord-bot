import { prisma } from '../index';

export async function recordBudgetTransaction(
  clubId: string,
  type: string,
  amount: bigint,
  description: string,
  reference?: string
) {
  // Record transaction
  await prisma.budgetTransaction.create({
    data: {
      clubId,
      type,
      amount,
      description,
      reference,
    },
  });

  // Update club budget
  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club) throw new Error('Club not found');

  let newBudget = club.budget;

  if (type === 'TRANSFER_OUT' || type === 'LOAN_OUT' || type === 'SALARY') {
    newBudget = club.budget - amount;
  } else if (type === 'TRANSFER_IN' || type === 'LOAN_IN') {
    newBudget = club.budget + amount;
  }

  await prisma.club.update({
    where: { id: clubId },
    data: { budget: newBudget },
  });
}

export async function getClubBudgetSummary(clubId: string) {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      budgetTransactions: true,
    },
  });

  if (!club) throw new Error('Club not found');

  const summary = {
    currentBudget: Number(club.budget),
    startingBudget: Number(club.startingBudget),
    spent: 0,
    income: 0,
    net: 0,
  };

  for (const tx of club.budgetTransactions) {
    if (tx.type === 'TRANSFER_OUT' || tx.type === 'LOAN_OUT' || tx.type === 'SALARY') {
      summary.spent += Number(tx.amount);
    } else if (tx.type === 'TRANSFER_IN' || tx.type === 'LOAN_IN') {
      summary.income += Number(tx.amount);
    }
  }

  summary.net = summary.income - summary.spent;

  return summary;
}
