import { prisma } from "../prisma";
import { startOfDay, subDays } from "date-fns";

/**
 * Generates a snapshot for a specific date (defaults to yesterday)
 * This records the total leads, open proposals, and won deals for that day.
 */
export async function generateSnapshot(targetDate?: Date) {
  const date = targetDate || subDays(startOfDay(new Date()), 1);
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  console.log(`Generating snapshot for: ${date.toISOString().split('T')[0]}`);

  try {
    // 1. Total leads created on this day
    const totalLeads = await prisma.quoteRequest.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDay,
        },
      },
    });

    // 2. Open proposals (status NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT)
    // This represents the current size of the active pipeline.
    // Note: Since we don't have historical status logs, this snapshot records
    // the TOTAL number of open proposals at the time of execution.
    const openProposals = await prisma.quoteRequest.count({
      where: {
        status: {
          in: ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT"],
        },
        // Removed createdAt constraint to capture the full active pipeline
      },
    });

    // 3. Won deals (status WON)
    // Here we use updatedAt because it represents when the lead was converted/won.
    const wonDeals = await prisma.quoteRequest.count({
      where: {
        status: "WON",
        updatedAt: {
          gte: date,
          lt: nextDay,
        },
      },
    });

    // 4. Upsert the snapshot
    const result = await prisma.analyticsSnapshot.upsert({
      where: {
        date: date,
      },
      update: {
        totalLeads,
        openProposals,
        wonDeals,
      },
      create: {
        date,
        totalLeads,
        openProposals,
        wonDeals,
      },
    });

    console.log(`Snapshot saved successfully:`, result);
    return result;
  } catch (error) {
    console.error("Error generating snapshot:", error);
    throw error;
  }
}

// If run directly via npx tsx
if (require.main === module) {
  generateSnapshot()
    .then(() => {
      console.log("Snapshot job completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Snapshot job failed:", err);
      process.exit(1);
    });
}
