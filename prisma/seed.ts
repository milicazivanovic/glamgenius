import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.outfitFeedback.deleteMany();
    await prisma.plannedOutfit.deleteMany();
    await prisma.outfitItem.deleteMany();
    await prisma.outfit.deleteMany();
    await prisma.clothingItem.deleteMany();

    const items = [
        { name: "White Cotton T-Shirt", category: "TOP", color: "white", season: "ALL", tags: "casual,basic,everyday", timesWorn: 5, imageUrl: "/items/white-tshirt.png" },
        { name: "Navy Blazer", category: "OUTER", color: "navy", season: "FALL", tags: "formal,office,classic", timesWorn: 2, imageUrl: "/items/navy-blazer.png" },
        { name: "Black Skinny Jeans", category: "BOTTOM", color: "black", season: "ALL", tags: "casual,everyday,versatile", timesWorn: 8, imageUrl: "/items/black-jeans.png" },
        { name: "Beige Chinos", category: "BOTTOM", color: "beige", season: "SPRING", tags: "casual,smart-casual,office", timesWorn: 3, imageUrl: "/items/beige-chinos.png" },
        { name: "Red Silk Blouse", category: "TOP", color: "red", season: "ALL", tags: "formal,elegant,evening", timesWorn: 1, imageUrl: "/items/red-blouse.png" },
        { name: "Gray Wool Sweater", category: "TOP", color: "gray", season: "WINTER", tags: "casual,cozy,everyday", timesWorn: 6, imageUrl: "/items/gray-sweater.png" },
        { name: "White Sneakers", category: "SHOES", color: "white", season: "ALL", tags: "casual,everyday,sporty", timesWorn: 10, imageUrl: "/items/white-sneakers.png" },
        { name: "Black Leather Boots", category: "SHOES", color: "black", season: "FALL", tags: "casual,formal,versatile", timesWorn: 4, imageUrl: "/items/black-boots.png" },
        { name: "Floral Summer Dress", category: "TOP", color: "pink", season: "SUMMER", tags: "casual,feminine,weekend", timesWorn: 2, imageUrl: "/items/floral-dress.png" },
        { name: "Denim Jacket", category: "OUTER", color: "blue", season: "SPRING", tags: "casual,everyday,layering", timesWorn: 3, imageUrl: "/items/denim-jacket.png" },
        { name: "Khaki Cargo Shorts", category: "BOTTOM", color: "khaki", season: "SUMMER", tags: "casual,sporty,weekend", timesWorn: 4, imageUrl: "/items/khaki-shorts.png" },
        { name: "Brown Loafers", category: "SHOES", color: "brown", season: "ALL", tags: "smart-casual,office,classic", timesWorn: 7, imageUrl: "/items/brown-loafers.png" },
    ];

    for (const item of items) {
        await prisma.clothingItem.create({ data: item });
    }

    console.log("Seeded 12 clothing items with images");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
