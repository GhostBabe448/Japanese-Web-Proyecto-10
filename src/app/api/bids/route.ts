import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAuctionActive } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión para pujar" }, { status: 401 });
  }

  try {
    const { carId, amount } = await request.json();

    if (!carId || !amount) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    });

    if (!car || car.listingType !== "auction") {
      return NextResponse.json({ error: "Subasta no encontrada" }, { status: 404 });
    }

    if (!isAuctionActive(car.auctionEnd)) {
      return NextResponse.json({ error: "La subasta ha finalizado" }, { status: 400 });
    }

    if (car.sellerId === session.user.id) {
      return NextResponse.json({ error: "No puedes pujar en tu propia subasta" }, { status: 400 });
    }

    const currentHighest = car.bids[0]?.amount ?? car.price;
    const minBid = currentHighest + 100;

    if (Number(amount) < minBid) {
      return NextResponse.json(
        { error: `La puja mínima es ${minBid} €` },
        { status: 400 }
      );
    }

    const [bid] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          amount: Number(amount),
          carId,
          bidderId: session.user.id,
        },
      }),
      prisma.car.update({
        where: { id: carId },
        data: { price: Number(amount) },
      }),
    ]);

    return NextResponse.json(bid, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al registrar la puja" }, { status: 500 });
  }
}
