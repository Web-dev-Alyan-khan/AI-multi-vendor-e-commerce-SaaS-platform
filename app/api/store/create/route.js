import { prisma } from "@/lib/db";
import imagekit from "@/configs/imageKit";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const username = formData.get("username");
    const address = formData.get("address");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const image = formData.get("image");

    // ✅ Validation
    if (!name || !description || !username || !address || !email || !contact || !image) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Check if user already has store
    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });

    if (existingStore) {
      return Response.json({ error: "Store already exists" }, { status: 400 });
    }

    // ✅ Check username
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return Response.json({ error: "Username already taken" }, { status: 400 });
    }

    // ✅ Upload image to ImageKit
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "/stores",
    });

    // ✅ Optimized image
    const logoUrl = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // ✅ Create store
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        address,
        email,
        contact,
        logo: logoUrl,
        status: "pending",
      },
    });

    // ✅ Link store to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        store: {
          connect: { id: newStore.id },
        },
      },
    });

    return Response.json({ success: true, store: newStore});

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findFirst({
      where: { userId },
    });

    if (!store) {
      return Response.json({ store: null });
    }

    return Response.json({ store });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}