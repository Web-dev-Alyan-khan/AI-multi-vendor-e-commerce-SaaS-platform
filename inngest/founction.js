import { prisma } from "@/prisma/db";
import { inngest } from "./client";

/**
 *  USER CREATED
 */
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-creation",
    retries: 2,
    triggers: [{ event: "clerk/user.created" }], // moved here
  },
  async ({ event, step }) => {
    const { id, name, email, image } = event.data;

    await step.run("create-user", async () => {
      await prisma.user.upsert({
        where: { id },
        update: {},
        create: {
          id,
          name,
          email,
          image: image ?? "",
          cart: {},
        },
      });
    });

    return { success: true };
  }
);

/**
 * USER UPDATED
 */
export const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-updation",
    retries: 2,
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event, step }) => {
    const { id, name, email, image } = event.data;

    await step.run("update-user", async () => {
      await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }),
        },
      });
    });

    return { success: true };
  }
);

/**
 * USER DELETED
 */
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
    retries: 1,
    triggers: [{ event: "clerk/user.deleted" }], //  FIXED
  },
  async ({ event, step }) => {
    const { id } = event.data;

    await step.run("delete-user", async () => {
      await prisma.user.delete({
        where: { id },
      }).catch(() => null);
    });

    return { success: true };
  }
);