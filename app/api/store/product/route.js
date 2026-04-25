import { prisma } from "@/lib/db";
import authSeller from "@/middleware/authSeller";
import imagekit from "@/lib/imagekit";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ check seller
    let storeId;
    try {
      storeId = await authSeller(userId);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 403 });
    }

    // ✅ get form data
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images"); // multiple images

    // validation
    if (!name || !description || isNaN(mrp) || isNaN(price) || !category || images.length === 0){
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // upload images
    const imageUrls = [];

    for (let img of images) {
      const bytes = await img.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await imagekit.upload({
        file: buffer,
        fileName: img.name,
        folder: "/products",
      });

      const url = imagekit.url({
        path: upload.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
        ],
      });

      imageUrls.push(url);
    }

    // ✅ create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imageUrls,
        storeId,
      },
    });

  return Response.json({
  success: true,
  product,
  message: "Product added successfully",
});
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
//Get All products for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    //check seller
    let storeId;
    try {
      storeId = await authSeller(userId);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 403 });
    }

    // get all products of this seller
    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
