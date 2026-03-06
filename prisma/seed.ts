import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "vendas@siloferr.com.br";
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("siloferr2026", 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin Siloferr",
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    console.log("Admin user seeded successfully!");
  } else {
    console.log("Admin user already exists.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
