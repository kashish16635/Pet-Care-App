const { PrismaClient } = require('@prisma/client')

const seedPrisma = new PrismaClient()

async function main() {
  console.log('Seeding comprehensive India-wide sitters...')

  const sitters = [
    // MUMBAI & THANE
    {
      id: "sit_mum_1",
      name: "Sneha Sharma",
      type: "Certified Pet Sitter & Walker",
      location: "Bandra West, Mumbai",
      distance: "2.5 km away",
      rating: 4.9,
      reviews: 124,
      price: 800,
      about: "Lifelong animal lover and certified pet sitter with 5+ years experience.",
      verified: true,
      image: "SS"
    },
    {
      id: "sit_thane_1",
      name: "Arjun Mehta",
      type: "Boarding Center & Daycare",
      location: "Thane West, Maharashtra",
      distance: "1.5 km away",
      rating: 4.7,
      reviews: 45,
      price: 1200,
      about: "Spacious home boarding in Thane with a dedicated pet terrace.",
      verified: true,
      image: "AM"
    },
    // RAJASTHAN
    {
      id: "sit_jaipur_1",
      name: "Amit Kasliwal",
      type: "Dog Walker & Trainer",
      location: "C-Scheme, Jaipur, Rajasthan",
      distance: "1.2 km away",
      rating: 4.9,
      reviews: 45,
      price: 600,
      about: "Professional dog walker in Jaipur with expertise in handling large breeds.",
      verified: true,
      image: "AK"
    },
    {
      id: "sit_udaipur_1",
      name: "Priya Mewada",
      type: "Cat Sitter",
      location: "Fateh Sagar, Udaipur, Rajasthan",
      distance: "3.0 km away",
      rating: 5.0,
      reviews: 32,
      price: 900,
      about: "I offer a loving home environment for your cats in Udaipur.",
      verified: true,
      image: "PM"
    },
    // DELHI & NORTH
    {
      id: "sit_del_1",
      name: "Rahul Verma",
      type: "Dog Walker & Sitter",
      location: "South Ex, Delhi",
      distance: "1.2 km away",
      rating: 5.0,
      reviews: 210,
      price: 500,
      about: "Providing energetic dog walks and drop-in visits in South Delhi.",
      verified: true,
      image: "RV"
    },
    {
      id: "sit_chd_1",
      name: "Simran Kaur",
      type: "Pet Groomer & Sitter",
      location: "Sector 17, Chandigarh",
      distance: "2.0 km away",
      rating: 4.8,
      reviews: 54,
      price: 1100,
      about: "Chandigarh's favorite pet sitter. I love all furry friends!",
      verified: true,
      image: "SK"
    },
    // SOUTH INDIA
    {
      id: "sit_blr_1",
      name: "Happy Paws Boarding",
      type: "Boarding Center",
      location: "Koramangala, Bangalore",
      distance: "5.0 km away",
      rating: 4.8,
      reviews: 89,
      price: 1500,
      about: "A spacious, stress-free boarding center with dedicated play areas.",
      verified: true,
      image: "HP"
    },
    {
      id: "sit_hyd_1",
      name: "Kiran Reddy",
      type: "Dog Walker",
      location: "Jubilee Hills, Hyderabad",
      distance: "4.1 km away",
      rating: 4.9,
      reviews: 78,
      price: 750,
      about: "Active dog walker in Hyderabad. I ensure your pet stays fit and happy.",
      verified: true,
      image: "KR"
    },
    // INDORE & MP
    {
      id: "sit_indore_1",
      name: "Vikram Singh",
      type: "Pet Care Specialist",
      location: "Vijay Nagar, Indore, MP",
      distance: "2.1 km away",
      rating: 4.8,
      reviews: 67,
      price: 700,
      about: "Experienced pet caregiver in Indore providing sitting and walking.",
      verified: true,
      image: "VS"
    },
    // AHMEDABAD
    {
      id: "sit_ahm_1",
      name: "Dharmesh Patel",
      type: "Professional Sitter",
      location: "Satellite, Ahmedabad, Gujarat",
      distance: "3.5 km away",
      rating: 4.7,
      reviews: 42,
      price: 650,
      about: "Reliable pet care in Ahmedabad. Available for long-term sitting.",
      verified: true,
      image: "DP"
    },
    // UTTAR PRADESH
    {
      id: "sit_kanpur_1",
      name: "Rishi Srivastava",
      type: "Dog Walker & Sitter",
      location: "Swaroop Nagar, Kanpur, Uttar Pradesh",
      distance: "1.8 km away",
      rating: 4.9,
      reviews: 38,
      price: 550,
      about: "Pet lover in Kanpur. I provide daily walks and home visits.",
      verified: true,
      image: "RS"
    },
    {
      id: "sit_lucknow_1",
      name: "Manasvi Gupta",
      type: "Certified Sitter",
      location: "Gomti Nagar, Lucknow, Uttar Pradesh",
      distance: "2.4 km away",
      rating: 4.8,
      reviews: 47,
      price: 700,
      about: "Professional pet sitting in the heart of Lucknow.",
      verified: true,
      image: "MG"
    }
  ]

  for (const sitter of sitters) {
    await seedPrisma.sitter.upsert({
      where: { id: sitter.id },
      update: {},
      create: sitter,
    })
  }

  console.log('India-wide seeding finished.')
}

main()
  .then(async () => {
    await seedPrisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await seedPrisma.$disconnect()
    process.exit(1)
  })
