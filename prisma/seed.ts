import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CAR_IMAGES } from "../src/lib/carImages";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const password = await bcrypt.hash("demo123", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@waauto.com" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "demo@waauto.com",
      password,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "vendedor@waauto.com" },
    update: {},
    create: {
      name: "Takeshi Yamamoto",
      email: "vendedor@waauto.com",
      password,
    },
  });

  await prisma.bid.deleteMany();
  await prisma.car.deleteMany();

  const cars = [
    // ── Subastas activas ──
    {
      title: "Nissan Skyline GT-R R34 V-Spec II",
      brand: "Nissan",
      model: "Skyline GT-R R34",
      year: 2002,
      price: 185000,
      mileage: 42000,
      description:
        "Legendario GT-R R34 V-Spec II en estado impecable. Motor RB26DETT original, transmisión Getrag de 6 velocidades. Interior negro intacto, historial completo en concesionario.",
      imageUrl: CAR_IMAGES.skylineR34,
      origin: "japanese",
      listingType: "auction",
      auctionEnd: daysFromNow(5),
      sellerId: seller.id,
    },
    {
      title: "Honda NSX Type-R NA1",
      brand: "Honda",
      model: "NSX Type-R",
      year: 1995,
      price: 210000,
      mileage: 31000,
      description:
        "NSX Type-R NA1, el superdeportivo japonés perfeccionado con Ayrton Senna. Motor VTEC V6 de 280 CV, chasis de aluminio. Pieza de museo.",
      imageUrl: CAR_IMAGES.nsxNA1,
      origin: "japanese",
      listingType: "auction",
      auctionEnd: daysFromNow(3),
      sellerId: seller.id,
    },
    {
      title: "Datsun 240Z",
      brand: "Datsun",
      model: "240Z",
      year: 1973,
      price: 45000,
      mileage: 89000,
      description:
        "El Fairlady Z que inició la leyenda. Restauración respetuosa, motor L24 de 2.4L, carrocería sin óxido, interior original.",
      imageUrl: CAR_IMAGES.datsun240Z,
      origin: "classic",
      listingType: "auction",
      auctionEnd: daysFromNow(7),
      sellerId: seller.id,
    },
    {
      title: "Lexus LFA",
      brand: "Lexus",
      model: "LFA",
      year: 2012,
      price: 380000,
      mileage: 12000,
      description:
        "Solo 500 unidades producidas. Motor V10 de 4.8L desarrollado con Yamaha, 552 CV. El superdeportivo japonés definitivo.",
      imageUrl: CAR_IMAGES.lfa,
      origin: "japanese",
      listingType: "auction",
      auctionEnd: daysFromNow(10),
      sellerId: seller.id,
    },
    {
      title: "Ferrari F40",
      brand: "Ferrari",
      model: "F40",
      year: 1990,
      price: 1200000,
      mileage: 18000,
      description:
        "Icono absoluto de Maranello. Motor V8 biturbo de 478 CV, solo 1315 unidades. Clásico valorado en ascenso constante.",
      imageUrl: CAR_IMAGES.ferrariF40,
      origin: "classic",
      listingType: "auction",
      auctionEnd: daysFromNow(14),
      sellerId: seller.id,
    },
    {
      title: "Toyota 2000GT",
      brand: "Toyota",
      model: "2000GT",
      year: 1967,
      price: 750000,
      mileage: 45000,
      description:
        "Uno de los 351 ejemplares fabricados. El primer superdeportivo japonés, motor 2.0L de 150 CV. Obra de arte sobre ruedas.",
      imageUrl: CAR_IMAGES.toyota2000GT,
      origin: "japanese",
      listingType: "auction",
      auctionEnd: daysFromNow(21),
      sellerId: seller.id,
    },

    // ── Venta directa — Japoneses ──
    {
      title: "Toyota Supra MK4 Twin Turbo",
      brand: "Toyota",
      model: "Supra MK4",
      year: 1998,
      price: 95000,
      mileage: 78000,
      description:
        "Supra MK4 2JZ-GTE twin turbo, uno de los deportivos japoneses más deseados. Pintura Super White original, targa roof, documentación al día.",
      imageUrl: CAR_IMAGES.supraA80,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Mazda RX-7 FD3S Spirit R",
      brand: "Mazda",
      model: "RX-7 FD",
      year: 2002,
      price: 72000,
      mileage: 55000,
      description:
        "Edición Spirit R, última evolución del RX-7 con motor rotativo 13B-REW. Solo 1500 unidades. Estado de coleccionista.",
      imageUrl: CAR_IMAGES.rx7FD,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Mitsubishi Lancer Evolution VI Tommi Mäkinen",
      brand: "Mitsubishi",
      model: "Lancer Evo VI",
      year: 2000,
      price: 58000,
      mileage: 95000,
      description:
        "Edición Tommi Mäkinen del Evo VI. Motor 4G63 turbo, tracción integral, spoiler trasero característico. Importado JDM.",
      imageUrl: CAR_IMAGES.evo6,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Subaru Impreza WRX STI Spec C",
      brand: "Subaru",
      model: "Impreza WRX STI",
      year: 2004,
      price: 35000,
      mileage: 110000,
      description:
        "STI Spec C con motor EJ257 boxer turbo. Diferencial DCCD, frenos Brembo, alerón de carbono. Listo para rally o calle.",
      imageUrl: CAR_IMAGES.wrxSTI,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Toyota AE86 Sprinter Trueno",
      brand: "Toyota",
      model: "AE86 Trueno",
      year: 1985,
      price: 42000,
      mileage: 145000,
      description:
        "El coche de Initial D. Motor 4A-GE de 16 válvulas, tracción trasera pura. Pintura panda original, muy buscado por coleccionistas.",
      imageUrl: CAR_IMAGES.ae86,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan Silvia S15 Spec-R",
      brand: "Nissan",
      model: "Silvia S15",
      year: 2000,
      price: 48000,
      mileage: 88000,
      description:
        "S15 Spec-R con motor SR20DET de 250 CV. El drifter por excelencia. Carrocería aero kit original, interior en perfecto estado.",
      imageUrl: CAR_IMAGES.silviaS15,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Honda Integra Type R DC2",
      brand: "Honda",
      model: "Integra Type R",
      year: 1998,
      price: 55000,
      mileage: 72000,
      description:
        "Type R con motor B18C VTEC de 200 CV. Cambio de 5 velocidades de precisión quirúrgica. Championship White, número de serie verificado.",
      imageUrl: CAR_IMAGES.integraTypeR,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Honda S2000 AP1",
      brand: "Honda",
      model: "S2000",
      year: 2001,
      price: 38000,
      mileage: 65000,
      description:
        "Roadster con motor F20C de 240 CV a 9000 rpm. Cambio manual de 6 velocidades, tracción trasera. Berlina Black, capota nueva.",
      imageUrl: CAR_IMAGES.s2000,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan Skyline GT-R R32",
      brand: "Nissan",
      model: "Skyline GT-R R32",
      year: 1992,
      price: 62000,
      mileage: 98000,
      description:
        "Godzilla en su forma original. RB26DETT twin turbo, ATTESA E-TS AWD. El GT-R que dominó el Group A en Australia.",
      imageUrl: CAR_IMAGES.skylineR32,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan Skyline GT-R R33",
      brand: "Nissan",
      model: "Skyline GT-R R33",
      year: 1997,
      price: 78000,
      mileage: 71000,
      description:
        "R33 con motor RB26DETT mejorado, frenos Brembo de serie. Más refinado que el R32, más accesible que el R34.",
      imageUrl: CAR_IMAGES.skylineR33,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan GT-R R35 Premium",
      brand: "Nissan",
      model: "GT-R R35",
      year: 2018,
      price: 95000,
      mileage: 42000,
      description:
        "GT-R R35 con motor VR38DETT de 570 CV. Transmisión de doble embrague, tracción ATTESA E-TS. Tecnología de superdeportivo accesible.",
      imageUrl: CAR_IMAGES.gtrR35,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan 350Z Touring",
      brand: "Nissan",
      model: "350Z",
      year: 2005,
      price: 22000,
      mileage: 95000,
      description:
        "350Z con motor VQ35DE de 287 CV. Diseño atemporal de Ajay Panchal, coupé 2+2 con capota descapotable. Sunset Orange.",
      imageUrl: CAR_IMAGES.nissan350Z,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Mazda MX-5 NA Miata",
      brand: "Mazda",
      model: "MX-5 NA",
      year: 1994,
      price: 14000,
      mileage: 120000,
      description:
        "El roadster jinba ittai original. Motor 1.8L, capota manual, peso pluma de 980 kg. Perfecto para domingos soleados.",
      imageUrl: CAR_IMAGES.mx5NA,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Toyota Celica GT-Four ST205",
      brand: "Toyota",
      model: "Celica GT-Four",
      year: 1996,
      price: 52000,
      mileage: 105000,
      description:
        "Campeón del WRC 1996. Motor 3S-GTE turbo, tracción integral. El Celica que ganó el mundial de rallyes.",
      imageUrl: CAR_IMAGES.celicaGT4,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Mitsubishi 3000GT VR-4",
      brand: "Mitsubishi",
      model: "3000GT VR-4",
      year: 1997,
      price: 32000,
      mileage: 115000,
      description:
        "VR-4 con motor 6G72 twin turbo de 320 CV, tracción AWD y dirección en las cuatro ruedas. Tecnología de superdeportivo a precio accesible.",
      imageUrl: CAR_IMAGES.mitsubishi3000GT,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Mitsubishi GTO Twin Turbo",
      brand: "Mitsubishi",
      model: "GTO",
      year: 1995,
      price: 28000,
      mileage: 130000,
      description:
        "Versión japonesa del 3000GT. Motor 6G72 twin turbo, techo elevable opcional, aerodinámica activa. Gran turismo japonés.",
      imageUrl: CAR_IMAGES.gto3000GT,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Nissan Fairlady Z Z432",
      brand: "Nissan",
      model: "Fairlady Z",
      year: 1970,
      price: 185000,
      mileage: 52000,
      description:
        "Solo 420 unidades con motor S20 de 160 CV (4 válvulas, 3 carburadores, 2 escapes). El Z más exclusivo de la historia.",
      imageUrl: CAR_IMAGES.fairladyZ,
      origin: "japanese",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "Datsun 510 Bluebird",
      brand: "Datsun",
      model: "510",
      year: 1971,
      price: 28000,
      mileage: 95000,
      description:
        "El sedán que derrotó a los Alfa Romeo en Trans-Am. Motor L16 de 96 CV, suspensión independiente. Leyenda del motorsport japonés.",
      imageUrl: CAR_IMAGES.datsun510,
      origin: "classic",
      listingType: "sale",
      sellerId: seller.id,
    },

    // ── Clásicos valorados ──
    {
      title: "Porsche 911 Carrera 3.2",
      brand: "Porsche",
      model: "911 Carrera",
      year: 1989,
      price: 68000,
      mileage: 120000,
      description:
        "Clásico alemán atemporal. Motor boxer 3.2L, cambio manual, color Guards Red. Restauración parcial con facturas.",
      imageUrl: CAR_IMAGES.porsche911,
      origin: "classic",
      listingType: "sale",
      sellerId: seller.id,
    },
    {
      title: "BMW E30 M3",
      brand: "BMW",
      model: "M3 E30",
      year: 1989,
      price: 85000,
      mileage: 98000,
      description:
        "El M3 original, campeón de DTM. Motor S14 de 4 cilindros con 200 CV, solo 17.970 unidades. Henna Red, interior negro.",
      imageUrl: CAR_IMAGES.bmwE30M3,
      origin: "classic",
      listingType: "sale",
      sellerId: seller.id,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  const skyline = await prisma.car.findFirst({
    where: { title: { contains: "R34" } },
  });

  const nsx = await prisma.car.findFirst({
    where: { title: { contains: "NSX" } },
  });

  if (skyline) {
    await prisma.bid.createMany({
      data: [
        { amount: 186000, carId: skyline.id, bidderId: demoUser.id },
        { amount: 187500, carId: skyline.id, bidderId: demoUser.id },
      ],
    });
    await prisma.car.update({
      where: { id: skyline.id },
      data: { price: 187500 },
    });
  }

  if (nsx) {
    await prisma.bid.create({
      data: { amount: 215000, carId: nsx.id, bidderId: demoUser.id },
    });
    await prisma.car.update({
      where: { id: nsx.id },
      data: { price: 215000 },
    });
  }

  console.log(`✅ ${cars.length} coches insertados con imágenes verificadas`);
  console.log("   Demo: demo@waauto.com / demo123");
  console.log("   Vendedor: vendedor@waauto.com / demo123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
