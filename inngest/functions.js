import { prisma } from "@/lib/db";
import { inngest } from "./client";



//Inngest Founction to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "user-create",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
      },
      create: {
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
        cart: {},
      },
    });

    return { ok: true };
  }
);
//Inngest Founction to update user data to a database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "user-update",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
      },
    });

    return { ok: true };
  }
);
//Inngest Founction to delete user  to a database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "user-delete",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.delete({
      where: { id: user.id },
    });

    return { ok: true };
  }
);
