import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.location.deleteMany();

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Main Office',
        address: '123 Business St, City Center, State 12345',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Branch A',
        address: '456 Commerce Ave, Downtown, State 12346',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Branch B',
        address: '789 Market Rd, Uptown, State 12347',
      },
    }),
  ]);

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'John Smith Enterprises',
        phoneNumber: '+1-555-0101',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Sarah Johnson LLC',
        phoneNumber: '+1-555-0102',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Tech Solutions Inc',
        phoneNumber: '+1-555-0103',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Global Trading Co',
        phoneNumber: '+1-555-0104',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Creative Studios',
        phoneNumber: '+1-555-0105',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Retail Partners',
        phoneNumber: '+1-555-0106',
      },
    }),
  ]);

  // Generate random transactions over the last 30 days
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const amount = Math.floor(Math.random() * 4990) + 10; // $10 to $5000
    const type = Math.random() > 0.6 ? 'CREDIT' : 'DEBIT';
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const descriptions = [
      'Payment received',
      'Service fee',
      'Product purchase',
      'Consultation fee',
      'Monthly subscription',
      'Equipment lease',
      'Software license',
      'Training session',
      'Marketing services',
      'Office supplies',
    ];

    transactions.push({
      transactionNo: `TXN${String(i + 1).padStart(6, '0')}`,
      date,
      amount,
      type,
      description: Math.random() > 0.3 ? descriptions[Math.floor(Math.random() * descriptions.length)] : null,
      accountId: account.id,
      locationId: location.id,
    });
  }

  // Create all transactions
  await Promise.all(
    transactions.map((transaction) =>
      prisma.transaction.create({
        data: transaction,
      })
    )
  );

  console.log('Seed data created successfully!');
  console.log(`- ${locations.length} locations`);
  console.log(`- ${accounts.length} accounts`);
  console.log(`- ${transactions.length} transactions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });