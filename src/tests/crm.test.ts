import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../app/api/contact/route";

// Mocking NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

// Mocking Prisma
const { prismaMock } = vi.hoisted(() => {
  const mock: any = {
    quoteRequest: {
      create: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
    // We need to implement $transaction to call the callback with the mock itself
    // However, since we can't reference 'mock' inside its own initialization easily if we want strict typing
    // We can define it partially first or use a getter.
    // Simpler approach for this test:
    $transaction: vi.fn(),
  };

  // Implementation of $transaction to execute the callback
  mock.$transaction.mockImplementation(async (callback: any) => {
    return callback(mock);
  });

  return { prismaMock: mock };
});

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

describe("Contact API (POST)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a lead successfully without equipmentId", async () => {
    const req = {
      json: vi.fn().mockResolvedValue({
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        message: "Hello",
      }),
    };

    prismaMock.quoteRequest.create.mockResolvedValue({
      id: "lead-1",
      name: "John Doe",
    });

    const response = await POST(req as any);

    expect(prismaMock.quoteRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        status: "NEW",
        equipmentId: null,
      }),
    });

    expect(prismaMock.product.update).not.toHaveBeenCalled();
    expect((response as any).init.status).toBe(200);
  });

  it("should create a lead and update product count with equipmentId", async () => {
    const req = {
      json: vi.fn().mockResolvedValue({
        name: "Jane Doe",
        email: "jane@example.com",
        equipmentId: "prod-123",
      }),
    };

    prismaMock.quoteRequest.create.mockResolvedValue({
      id: "lead-2",
      name: "Jane Doe",
    });

    const response = await POST(req as any);

    expect(prismaMock.quoteRequest.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        equipmentId: "prod-123",
      }),
    });

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: "prod-123" },
      data: { priceRequestCnt: { increment: 1 } },
    });

    expect((response as any).init.status).toBe(200);
  });

  it("should return 400 if validation fails", async () => {
    const req = {
      json: vi.fn().mockResolvedValue({
        name: "", // Missing name
        email: "test@example.com",
      }),
    };

    const response = await POST(req as any);

    expect(prismaMock.quoteRequest.create).not.toHaveBeenCalled();
    expect((response as any).init.status).toBe(400);
  });
});
