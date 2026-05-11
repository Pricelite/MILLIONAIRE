import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Anthony45", 10);
  const managerPassword = await bcrypt.hash("Demo12345!", 10);

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "restomaster-demo" },
    update: {},
    create: {
      name: "Restomaster Demo",
      slug: "restomaster-demo"
    }
  });

  await prisma.user.upsert({
    where: { email: "antoniwelh@gmail.com" },
    update: { role: Role.SUPER_ADMIN, restaurantId: restaurant.id, passwordHash: password },
    create: {
      email: "antoniwelh@gmail.com",
      role: Role.SUPER_ADMIN,
      passwordHash: password,
      restaurantId: restaurant.id
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@restomaster.dev" },
    update: { role: Role.MANAGER, restaurantId: restaurant.id, passwordHash: managerPassword },
    create: {
      email: "admin@restomaster.dev",
      role: Role.MANAGER,
      passwordHash: managerPassword,
      restaurantId: restaurant.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
