import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data if tables exist
  try {
    await prisma.transaction.deleteMany();
  } catch (e) {
    console.log('Transaction table does not exist yet, skipping delete');
  }
  
  try {
    await prisma.account.deleteMany();
  } catch (e) {
    console.log('Account table does not exist yet, skipping delete');
  }
  
  try {
    await prisma.location.deleteMany();
  } catch (e) {
    console.log('Location table does not exist yet, skipping delete');
  }

  // Create locations in Indian cities
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Mumbai Head Office',
        address: 'Nariman Point, Mumbai, Maharashtra 400021',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Delhi Branch',
        address: 'Connaught Place, New Delhi, Delhi 110001',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Bangalore Branch',
        address: 'MG Road, Bengaluru, Karnataka 560001',
      },
    }),
  ]);

  // Create accounts with Indian business names
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'Sharma & Sons Trading Co.',
        phoneNumber: '+91 98765 43210',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Patel Enterprises',
        phoneNumber: '+91 98765 54321',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Infinity IT Solutions',
        phoneNumber: '+91 98765 65432',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Gupta Textiles',
        phoneNumber: '+91 98765 76543',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Agarwal Jewellers',
        phoneNumber: '+91 98765 87654',
      },
    }),
    prisma.account.create({
      data: {
        name: 'Reddy Constructions',
        phoneNumber: '+91 98765 98765',
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
    
    // Amounts in INR (₹500 to ₹500,000)
    const amount = Math.floor(Math.random() * 499500) + 500;
    const type = Math.random() > 0.6 ? 'CREDIT' : 'DEBIT';
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const descriptions = [
      'GST Payment',
      'Goods purchase',
      'Professional fees',
      'Consultancy charges',
      'Monthly maintenance',
      'Rent payment',
      'Software subscription',
      'Training program',
      'Digital marketing',
      'Office supplies',
      'Freight charges',
      'Bank charges',
      'Salary payment',
      'Utility bills',
      'Travel expenses',
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