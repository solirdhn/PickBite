import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all orders with their lines and product details
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        lines: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create a new order
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      customerName, 
      orderType, 
      total, 
      paymentMethod, 
      status, 
      items 
    } = data;

    // Use a transaction to ensure all or nothing
    const order = await prisma.$transaction(async (tx: any) => {
      // 1. Create the base order
      // (orderNumber is automatic and sequential)
      const newOrder = await tx.order.create({
        data: {
          customerName: customerName || "Counter Customer",
          orderType: orderType || "Dine In",
          total: parseFloat(total),
          paymentMethod: paymentMethod || "Cash",
          status: status || "Pending",
        },
      });

      // 2. Map items to OrderLines
      if (items && Array.isArray(items)) {
        const lineItems = items.map((item: any) => ({
          orderId: newOrder.id,
          productId: item.productId || null, // Can be null for custom items
          name: item.name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        }));

        await tx.orderLine.createMany({
          data: lineItems,
        });
      }

      // Return the complete order for the frontend
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: { lines: true },
      });
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Save Order Error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
