import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../app/api/admin/leads/route";
import { GET as GET_PRODUCTS } from "../app/api/admin/products/route";
import { GET as GET_PRODUCT } from "../app/api/admin/products/[id]/route";

// Mock NextAuth
vi.mock("next-auth", () => ({
  __esModule: true,
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

// Mock NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

// Mock Prisma
// We need to hoist the mock creation or use a simple object if we don't need detailed spy behavior in the mock definition itself
const { prismaMock } = vi.hoisted(() => {
  return {
    prismaMock: {
      quoteRequest: {
        findMany: vi.fn(),
      },
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    },
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { getServerSession } from "next-auth";

describe("Admin Leads API Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if no session exists", async () => {
    (getServerSession as any).mockResolvedValue(null);

    const response = await GET();

    // The route returns NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    // Our mock returns { body, init }
    expect((response as any).init.status).toBe(401);
    expect(prismaMock.quoteRequest.findMany).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not ADMIN", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: "USER" },
    });

    const response = await GET();

    expect((response as any).init.status).toBe(401);
    expect(prismaMock.quoteRequest.findMany).not.toHaveBeenCalled();
  });

  it("should return leads if user is ADMIN", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: "ADMIN" },
    });

    prismaMock.quoteRequest.findMany.mockResolvedValue([{ id: "1" }]);

    const response = await GET();

    expect(prismaMock.quoteRequest.findMany).toHaveBeenCalled();
    // In success case, route calls NextResponse.json(leads) -> init is undefined (status 200)
    expect((response as any).body).toEqual([{ id: "1" }]);
  });
});

describe("Admin Products API Security (GET)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if no session exists", async () => {
    (getServerSession as any).mockResolvedValue(null);

    const response = await GET_PRODUCTS();

    expect((response as any).init.status).toBe(401);
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not allowed", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: "EXECUTIVE" },
    });

    const response = await GET_PRODUCTS();

    expect((response as any).init.status).toBe(401);
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
  });

  it("should return products if user is ADMIN", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { role: "ADMIN" },
    });

    prismaMock.product.findMany.mockResolvedValue([{ id: "p1" }]);

    const response = await GET_PRODUCTS();

    expect(prismaMock.product.findMany).toHaveBeenCalled();
    expect((response as any).body).toEqual([{ id: "p1" }]);
  });
});

describe("Admin Products API Security (GET by id)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if no session exists", async () => {
    (getServerSession as any).mockResolvedValue(null);

    const response = await GET_PRODUCT({} as any, {
      params: Promise.resolve({ id: "p1" }),
    });

    expect((response as any).init.status).toBe(401);
    expect(prismaMock.product.findUnique).not.toHaveBeenCalled();
  });
});
