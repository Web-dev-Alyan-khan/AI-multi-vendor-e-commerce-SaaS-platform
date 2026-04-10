import prisma from "@/lib/prisma";
import { inngest } from "./client";

// Update the event name to match Clerk's standard output
export const syncUserCreation = inngest.createFunction(
    { 
        id: 'sync-user-create',
        event: 'user.created' // Changed: removed clerk/
    },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                image: data.image_url
            }
        });
    }
);

export const syncUserUpdation = inngest.createFunction(
    { 
        id: 'sync-user-update',
        event: 'user.updated' // Changed: removed clerk/
    },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: data.email_addresses[0].email_address,
                name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                image: data.image_url
            }
        });
    }
);

export const syncUserDeletion = inngest.createFunction(
    { 
        id: 'sync-user-delete',
        event: 'user.deleted' // Changed: removed clerk/
    },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            where: { id: data.id }
        });
    }
);