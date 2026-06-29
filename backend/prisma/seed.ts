import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password,
    },
  });

  const expenses = [
    { desc: 'Weekly groceries', amount: 85.50, category: 'Food', type: 'expense', date: new Date('2026-06-28') },
    { desc: 'Uber ride', amount: 24.00, category: 'Transport', type: 'expense', date: new Date('2026-06-27') },
    { desc: 'Netflix subscription', amount: 15.99, category: 'Entertainment', type: 'expense', date: new Date('2026-06-26') },
    { desc: 'Freelance project', amount: 500.00, category: 'Freelance', type: 'income', date: new Date('2026-06-25') },
    { desc: 'Electricity bill', amount: 120.00, category: 'Bills', type: 'expense', date: new Date('2026-06-24') },
    { desc: 'New sneakers', amount: 89.99, category: 'Shopping', type: 'expense', date: new Date('2026-06-23') },
    { desc: 'Salary', amount: 5000.00, category: 'Salary', type: 'income', date: new Date('2026-06-22') },
    { desc: 'Doctor visit', amount: 200.00, category: 'Health', type: 'expense', date: new Date('2026-06-21') },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({
      data: { userId: user.id, ...expense },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
