import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Horror', 'Romance', 'Science Fiction'];
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { slug: name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/ /g, '-') },
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
