import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fixOrphanedAccounts = async () => {
  try {
    console.log('Checking for orphaned accounts...');
    
    const users = await prisma.user.findMany({ select: { id: true } });
    const validUserIds = users.map(user => user.id);

    const orphanedAccounts = await prisma.account.findMany({
      where: { userId: { notIn: validUserIds } }
    });

    if (orphanedAccounts.length === 0) {
      console.log('No orphaned accounts found. Database is clean.');
      return;
    }

    console.log(`Found ${orphanedAccounts.length} orphaned accounts. Deleting...`);

    await prisma.account.deleteMany({
      where: { userId: { notIn: validUserIds } }
    });

    console.log('Orphaned accounts deleted successfully.');
  } catch (error) {
    console.error('Error fixing orphaned accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
};

fixOrphanedAccounts();
