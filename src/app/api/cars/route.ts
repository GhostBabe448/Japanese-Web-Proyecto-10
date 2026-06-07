import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingType = searchParams.get("type");
  const origin = searchParams.get("origin");

  const where: Record<string, unknown> = { status: "active" };
  if (listingType) where.listingType = listingType;
  if (origin) where.origin = origin;

  const cars = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bids: true } } },
  });

  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      brand,
      model,
      year,
      price,
      mileage,
      description,
      imageUrl,
      origin,
      listingType,
      auctionDays,
    } = body;

    if (!title || !brand || !model || !year || !price || !mileage || !description || !imageUrl || !origin || !listingType) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    if (!["japanese", "classic"].includes(origin)) {
      return NextResponse.json({ error: "Origen inválido" }, { status: 400 });
    }

    if (!["sale", "auction"].includes(listingType)) {
      return NextResponse.json({ error: "Tipo de anuncio inválido" }, { status: 400 });
    }

    let auctionEnd: Date | null = null;
    if (listingType === "auction") {
      const days = Math.min(Math.max(Number(auctionDays) || 7, 1), 30);
      auctionEnd = new Date();
      auctionEnd.setDate(auctionEnd.getDate() + days);
    }

    const car = await prisma.car.create({
      data: {
        title,
        brand,
        model,
        year: Number(year),
        price: Number(price),
        mileage: Number(mileage),
        description,
        imageUrl,
        origin,
        listingType,
        auctionEnd,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear el anuncio" }, { status: 500 });
  }
}
