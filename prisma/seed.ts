import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { generateSlug } from "../src/lib/utils";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const PRODUCTS = [
  {
    title: "Silo Metálico Fundo Plano",
    category: "SILOS",
    description:
      "Silos metálicos de alta capacidade para armazenagem de grãos a longo prazo, garantindo qualidade e segurança.",
    details:
      "Capacidade: 50 a 10.000 toneladas.\nMaterial: Aço galvanizado ZAR 400.\nVentilação: Sistema de aeração completo com ventiladores centrífugos.\nControle de Temperatura: Termometria digital integrada.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto1.jpg",
    isFeatured: true,
  },
  {
    title: "Secador de Grãos de Coluna",
    category: "EQUIPAMENTOS",
    description:
      "Secadores de alta eficiência energética, preservando a qualidade dos grãos durante o processo de secagem.",
    details:
      "Capacidade: 20 a 150 ton/h.\nCombustível: Lenha, cavaco ou gás.\nAutomação: Painel CLP com controle de umidade e temperatura.\nEstrutura: Colunas de aço galvanizado de alta resistência.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto2.jpg",
    isFeatured: true,
  },
  {
    title: "Elevador de Canecas",
    category: "EQUIPAMENTOS",
    description:
      "Transporte vertical de grãos com robustez e segurança, minimizando danos mecânicos ao produto.",
    details:
      "Altura: Até 45 metros.\nCapacidade: Até 300 ton/h.\nCorreia: Borracha resistente a óleo e abrasão.\nCanecas: PEAD ou aço.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto3.jpg",
    isFeatured: false,
  },
  {
    title: "Rosca Transportadora Tubular",
    category: "ACESSORIOS",
    description:
      "Ideal para transporte horizontal ou inclinado de grãos em curtas e médias distâncias.",
    details:
      "Diâmetro: 6 a 12 polegadas.\nAcionamento: Motor elétrico com redutor.\nMaterial: Aço carbono ou inox.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto4.jpg",
    isFeatured: false,
  },
  {
    title: "Fita Transportadora",
    category: "EQUIPAMENTOS",
    description:
      "Transporte horizontal suave para grandes volumes, ideal para recebimento e expedição.",
    details:
      "Largura: 24 a 48 polegadas.\nCapacidade: Até 400 ton/h.\nCobertura: Opcional para proteção contra intempéries.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto5.jpg",
    isFeatured: false,
  },
  {
    title: "Máquina de Limpeza e Pré-Limpeza",
    category: "EQUIPAMENTOS",
    description:
      "Remove impurezas dos grãos com alta eficiência, melhorando a qualidade final do produto armazenado.",
    details:
      "Capacidade: 40 a 200 ton/h.\nPeneiras: Intercambiáveis para diferentes culturas.\nSistema de Aspiração: Ciclones de alta eficiência.",
    image: "https://siloferr.com.br/Content/img/portfolio/produto6.jpg",
    isFeatured: true,
  },
];

async function main() {
  const adminEmail = "vendas@siloferr.com.br";

  // 1. Seed Admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("siloferr2026", 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin Siloferr",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user seeded successfully!");
  } else {
    console.log("Admin user already exists.");
  }

  // 2. Seed Products
  console.log("Seeding products...");

  for (const p of PRODUCTS) {
    const slug = generateSlug(p.title);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...p,
          slug,
        },
      });
      console.log(`Created product: ${p.title}`);
    } else {
      console.log(`Product already exists: ${p.title}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
