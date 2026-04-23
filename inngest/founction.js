import { prisma } from "@/prisma/db";
import { inngest } from "./client";

// Inngest function to save user data to a database on creation
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-creation", triggers: [{ event: "clerk/user.created" }] },
    async ({ event, step }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name} ${last_name}`.trim();

        await step.run("save-user-to-db", async () => {
            return await prisma.user.create({
                data: {
                    id: id,
                    name: name,
                    email: email,
                    image: image_url,
                }
            });
        });
    }
);

// Inngest function to update user data
export const syncUserUpdation = inngest.createFunction(
    { id: "sync-user-updation", triggers: [{ event: "clerk/user.updated" }] },
    async ({ event, step }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name} ${last_name}`.trim();

        await step.run("update-user-in-db", async () => {
            return await prisma.user.update({
                where: { id: id },
                data: {
                    name: name,
                    email: email,
                    image: image_url,
                }
            });
        });
    }
);

// Inngest function to delete user data
export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-deletion", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event, step }) => {
        const { id } = event.data;

        await step.run("delete-user-from-db", async () => {
            return await prisma.user.delete({
                where: { id: id }
            });
        });
    }
);