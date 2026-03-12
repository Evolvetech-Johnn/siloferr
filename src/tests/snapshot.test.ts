import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSnapshot } from '../lib/jobs/snapshot-job';
import { prisma } from '../lib/prisma';

// Mock prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    quoteRequest: {
      count: vi.fn(),
    },
    analyticsSnapshot: {
      upsert: vi.fn(),
    },
  },
}));

describe('generateSnapshot', () => {
  const mockDate = new Date('2026-03-05T00:00:00.000Z');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate counts and upsert snapshot', async () => {
    (prisma.quoteRequest.count as any).mockResolvedValueOnce(10); // totalLeads
    (prisma.quoteRequest.count as any).mockResolvedValueOnce(7);  // openProposals (Total Pipeline)
    (prisma.quoteRequest.count as any).mockResolvedValueOnce(3);  // wonDeals
    
    (prisma.analyticsSnapshot.upsert as any).mockResolvedValueOnce({
      id: '1',
      date: mockDate,
      totalLeads: 10,
      openProposals: 7,
      wonDeals: 3,
    });

    const result = await generateSnapshot(mockDate);

    // Verify calls
    // 1. totalLeads (has createdAt range)
    expect(prisma.quoteRequest.count).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: expect.objectContaining({
        createdAt: expect.anything()
      })
    }));

    // 2. openProposals (NO createdAt range, just status)
    expect(prisma.quoteRequest.count).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: {
          status: {
            in: ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION"],
          },
        },
      }),
    );

    // 3. wonDeals (has updatedAt range)
    expect(prisma.quoteRequest.count).toHaveBeenNthCalledWith(3, expect.objectContaining({
      where: expect.objectContaining({
        updatedAt: expect.anything()
      })
    }));

    expect(prisma.analyticsSnapshot.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { date: mockDate },
      create: expect.objectContaining({
        totalLeads: 10,
        wonDeals: 3,
      }),
    }));
    expect(result.totalLeads).toBe(10);
  });
});
