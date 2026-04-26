const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial sitters...')

  const sitters = [
    {
      id: "cl_seed_sitter_1",
      name: "Sneha Sharma",
      type: "Certified Pet Sitter & Walker",
      location: "Bandra West, Mumbai",
      distance: "2.5 km away",
      rating: 4.9,
      reviews: 124,
      price: 800,
      about: "Hi! I'm Sneha, a lifelong animal lover and certified pet sitter with over 5 years of experience. I specialize in caring for dogs and cats of all ages, including seniors who need medication. I believe every pet deserves personalized attention, interactive playtime, and lots of cuddles while their parents are away.",
      verified: true,
      image: "SS"
    },
    {
      id: "cl_seed_sitter_2",
      name: "Happy Paws Boarding",
      type: "Boarding Center",
      location: "Koramangala, Bangalore",
      distance: "5.0 km away",
      rating: 4.8,
      reviews: 89,
      price: 1500,
      about: "A spacious, stress-free boarding center with dedicated play areas. We offer 24/7 video monitoring so you can see your pets anytime. All our staff are certified in pet first-aid.",
      verified: true,
      image: "HP"
    },
    {
      id: "cl_seed_sitter_3",
      name: "Rahul Verma",
      type: "Dog Walker & Sitter",
      location: "South Ex, Delhi",
      distance: "1.2 km away",
      rating: 5.0,
      reviews: 210,
      price: 500,
      about: "I am Rahul, providing energetic dog walks and drop-in visits. Perfect for high-energy breeds that need to burn off steam in the middle of the day. Fully insured.",
      verified: true,
      image: "RV"
    },
    {
      id: "cl_seed_sitter_4",
      name: "Cozy Cats Inn",
      type: "Boarding Center",
      location: "Andheri West, Mumbai",
      distance: "8.4 km away",
      rating: 4.7,
      reviews: 56,
      price: 1200,
      about: "A cat-exclusive boarding facility designed to keep your feline friends calm and relaxed. No barking dogs, just peaceful kitty condos with multi-level climbing structures and cozy beds.",
      verified: false,
      image: "CC"
    }
  ]

  for (const sitter of sitters) {
    await prisma.sitter.upsert({
      where: { id: sitter.id },
      update: {},
      create: sitter,
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
