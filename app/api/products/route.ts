import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: true 
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST create or update product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name, price, desc, image, isPopular, categoryName } = data;

    // 1. Find or create the category
    // If categoryName is empty, use "Uncategorized"
    const catName = categoryName || "Uncategorized";
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });

    // 2. Prepare the upsert data
    // If id is not a valid CUID or is missing, treat as create
    const productId = id && id.toString().length > 5 ? id : "new-product-" + Date.now();

    const product = await prisma.product.upsert({
      where: { id: productId },
      update: {
        name,
        price: parseFloat(price),
        desc,
        image,
        isPopular: !!isPopular,
        categoryId: category.id,
      },
      create: {
        name,
        price: parseFloat(price),
        desc,
        image,
        isPopular: !!isPopular,
        categoryId: category.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Save Product Error:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
