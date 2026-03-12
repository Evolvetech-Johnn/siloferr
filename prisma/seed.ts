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
  const adminEmail = "admin@siloferr.com.br";
  const executiveEmail = "executive@siloferr.com.br";
  const salesEmail = "sales@siloferr.com.br";
  const defaultPassword = "Siloferr@2026";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Seed/Update Admin
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

  // 2. Seed/Update Executive
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

  // 3. Seed/Update Sales
  await prisma.user.upsert({
    where: { email: salesEmail },
    update: {
      name: "Vendas Siloferr",
      password: hashedPassword,
      role: "SALES",
    },
    create: {
      email: salesEmail,
      name: "Vendas Siloferr",
      password: hashedPassword,
      role: "SALES",
    },
  });

  console.log("Usuários atualizados/criados com sucesso.");

  // 4. Seed Products
  console.log("Seeding products...");

  const productTemplates = [
    ...PRODUCTS,
    ...PRODUCTS.map((p) => ({
      ...p,
      title: `${p.title} - Linha Premium`,
      isFeatured: false,
    })),
    ...PRODUCTS.map((p) => ({
      ...p,
      title: `${p.title} - Série ${p.category}`,
      isFeatured: false,
    })),
  ].slice(0, 20);

  for (const p of productTemplates) {
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

  // 5. Seed Leads
  console.log("Seeding leads...");

  const leadStatuses = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ] as const;

  const companies = [
    "Fazenda Santa Clara",
    "Agro Horizonte",
    "Cooperativa Vale Verde",
    "Sementes do Sul",
    "Armazéns Pioneiros",
    "Grãos do Cerrado",
  ];

  const products = await prisma.product
    .findMany({ select: { id: true }, take: 20 })
    .catch(() => []);

  const now = new Date();
  for (let i = 1; i <= 50; i++) {
    const status = leadStatuses[i % leadStatuses.length];
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - (i % 30));
    createdAt.setHours(9 + (i % 8), (i * 7) % 60, 0, 0);

    const updatedAt = new Date(createdAt);
    updatedAt.setHours(createdAt.getHours() + 2);

    await prisma.quoteRequest
      .create({
        data: {
          name: `Lead ${i} Siloferr`,
          email: `lead${i}@example.com`,
          phone: `+55 49 9${String(10000000 + i).slice(0, 8)}`,
          company: companies[i % companies.length],
          message: `Solicitação de cotação #${i}`,
          equipmentId: products.length
            ? products[i % products.length].id
            : null,
          status,
          createdAt,
          updatedAt: status === "WON" ? updatedAt : createdAt,
          expectedValue: 10000 + i * 250,
        },
      })
      .catch(() => null);
  }

  // 6. Seed Snapshots
  console.log("Seeding analytics snapshots...");
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    await prisma.analyticsSnapshot
      .upsert({
        where: { date },
        update: {},
        create: {
          date,
          totalLeads: 10 + (i % 5),
          openProposals: 7 + (i % 4),
          wonDeals: 2 + (i % 3),
        },
      })
      .catch(() => null);
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
