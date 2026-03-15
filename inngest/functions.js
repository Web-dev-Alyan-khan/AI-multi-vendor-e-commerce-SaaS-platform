import { inngest } from "./client"
import { prisma } from "../lib/prisma"

// Save user
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event }) => {

    const { id, first_name, last_name, email_addresses, image_url } = event.data

    await prisma.user.create({
      data: {
        id: id,
        name: first_name + " " + last_name,
        email: email_addresses[0].email_address,
        image: image_url
      }
    })
  }
)


// Update user
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {

    const { id, first_name, last_name, image_url } = event.data

    await prisma.user.update({
      where: { id },
      data: {
        name: first_name + " " + last_name,
        image: image_url
      }
    })
  }
)


// Delete user
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {

    const { id } = event.data

    await prisma.user.delete({
      where: { id }
    })
  }
)