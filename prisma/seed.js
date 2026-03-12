const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "vendas@siloferr.com.br";
  const executiveEmail = "executivo@siloferr.com.br";
  const defaultPassword = "Siloferr@2026";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin Siloferr",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Admin Siloferr",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: executiveEmail },
    update: {
      name: "Executivo Siloferr",
      password: hashedPassword,
      role: "EXECUTIVE",
    },
    create: {
      email: executiveEmail,
      name: "Executivo Siloferr",
      password: hashedPassword,
      role: "EXECUTIVE",
    },
  });

  console.log("Admin e Executivo atualizados/criados com sucesso.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
