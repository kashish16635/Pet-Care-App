"use client"; //jab bhi user se interaction krna ho to use krte he 

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { motion, useMotionValue as motionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";
import {
  Heart, ShieldCheck, MapPin, Clock, Search,
  CalendarCheck, MessageCircle, Star, Smartphone, Activity, PawPrint, Crown
} from "lucide-react";

function HeroImage() {
  const x = motionValue(0);
  const y = motionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] mx-auto lg:ml-auto"
      style={{ perspective: 1200 }}
    >
      {/* Continuous floating animation wrapper */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full relative group"
        >

        
        {/* Main image container */}
        <motion.div 
            style={{ transform: "translateZ(20px)" }}
            className="absolute inset-0 flex items-center justify-center relative pointer-events-none mix-blend-multiply"
        >
          <video
            src="/sticker-dog.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
          />
        </motion.div>
        
        {/* Floating Badge - Subscription */}
        <motion.div style={{ transform: "translateZ(80px)" }} className="absolute -bottom-6 -left-6 z-20">
            <Link href="/subscription">
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl px-5 py-3.5 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white dark:border-gray-800 cursor-pointer flex items-center gap-3"
            >
                <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-full blur-lg opacity-20 hover:opacity-40 transition-opacity" />
                <div className="relative h-10 w-10 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center shadow-sm">
                    <Crown className="w-5 h-5 text-amber-600" />
                </div>
                </div>
                <div>
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Go Pro</span>
                    <div className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Exclusive Plans</p>
                </div>
            </motion.div>
            </Link>
        </motion.div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { data: session } = useSession();//janne ke liye ki user logged in hai ya nhi

  return (
    <div className="min-h-screen bg-background-soft font-sans">
      <Navbar />

      <main className="pt-20">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/50 to-white dark:from-gray-900 dark:to-background pt-20 pb-32">
          {/* Background Blob Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-primary-light to-secondary-light dark:from-primary-dark/30 dark:to-secondary-dark/30 blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-lighten" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-secondary-main animate-pulse" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Over 10,000+ Pets Cared For ❤️ India-wide</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  Trusted Pet Care, <br />
                  <span className="text-gradient">Anytime Anywhere</span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Connect with verified pet sitters, boarding centers, and vet professionals across India. Give your furry friends the love and attention they deserve while you travel.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/search?type=sitter" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full">Book a Sitter</Button>
                  </Link>
                  <Link href="/search?type=boarding" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full">Find Boarding</Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5"><ShieldCheck className="w-5 h-5 text-green-500" /> Aadhar-Verified Sitters</div>
                  <div className="flex items-center gap-1.5"><Heart className="w-5 h-5 text-red-500" /> 4.9/5 Average Rating</div>
                </div>
              </motion.div>

              {/* Hero Image / Placeholder */}
              <HeroImage />
            </div>
          </div>
        </section>

        {/* --- PROBLEM & SOLUTION SECTION --- */}
        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              Because Pets Are Family, They Never Deserve to Be Left Behind.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
              For busy professionals and frequent travelers in bustling Indian cities, finding trustworthy and emotional care for your pets can be stressful. We bridge the gap by connecting you with passionate, thoroughly vetted local caregivers who treat your pets like their own.
            </p>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-primary-main font-semibold tracking-wider uppercase text-sm">What We Offer</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 text-gray-900 dark:text-white">Comprehensive Pet Care</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard
                title="Pet Sitting at Home"
                description="Verified professionals provide personalized love and care within the comfort of your pet's own home."
                icon={<Heart className="w-7 h-7" />}
                delay={0}
              />
              <ServiceCard
                title="Boarding Centers"
                description="Safe, spacious, and highly-rated boarding facilities for when you need to travel out of town."
                icon={<MapPin className="w-7 h-7" />}
                delay={0.1}
              />
              <ServiceCard
                title="Grooming & Training"
                description="Keep your pets looking their best and well-behaved with professional dog groomers and trainers."
                icon={<Star className="w-7 h-7" />}
                delay={0.2}
              />
              <ServiceCard
                title="Vet Consultation"
                description="Access quick telemedicine and coordinate emergency vet support 24/7 whenever you need it."
                icon={<Activity className="w-7 h-7" />}
                delay={0.3}
              />
              <ServiceCard
                title="Pet Pickup & Drop"
                description="Convenient transport services for your pet to the vet or boarding facility with live tracking."
                icon={<MapPin className="w-7 h-7" />}
                delay={0.4}
              />
              <ServiceCard
                title="Accessories Marketplace"
                description="Find high-quality food, toys, and custom accessories recommended by verified experts."
                icon={<Search className="w-7 h-7" />}
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16 text-gray-900 dark:text-white">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 dark:bg-gray-800 -z-10" />

              {[
                { step: 1, title: "Search", desc: "Browse through our verified nearby professionals.", icon: <Search />, href: "/search" },
                { step: 2, title: "Book", desc: "Select services, dates, and customize care.", icon: <CalendarCheck />, href: "/search" },
                { step: 3, title: "Track", desc: "Get live updates with photos, and camera feeds.", icon: <Smartphone />, href: "/dashboard" },
                { step: 4, title: "Review", desc: "Share your experience and give ratings.", icon: <Star />, href: "/history" },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, type: "spring" }}
                >
                  <Link href={item.href} className="group block">
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ y: -15, scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_rgba(244,63,94,0.2)] flex items-center justify-center mb-6 text-primary-main group-hover:text-secondary-main group-hover:border-secondary-main/30 transition-all duration-300 z-10 relative"
                      >
                        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary-main text-white font-black flex items-center justify-center text-sm shadow-md group-hover:animate-bounce">
                          {item.step}
                        </span>
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                      </motion.div>
                      <h3 className="font-heading font-black text-xl mb-2 text-gray-900 dark:text-white group-hover:text-primary-main transition-colors">{item.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="reviews" className="py-24 bg-gradient-to-br from-primary-light/40 to-secondary-light/40 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-gray-900 dark:text-white">Loved by Pet Parents Across India</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { name: "Aditi S., Mumbai", text: "Being a frequent traveler, finding a safe place for my Indie was a nightmare. Paws & Care changed everything for me!" },
                { name: "Rahul M., Bangalore", text: "The WhatsApp tracking feature gave me so much peace of mind while I was stuck in traffic. I could see my cat is happy and fed." },
                { name: "Priya T., Delhi", text: "I had a midnight emergency with my dog, and the 24/7 vet consultation saved us. The caregivers are truly angels." }
              ].map((review, i) => (
                <div key={i} className="bg-white dark:bg-gray-950 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex gap-1 text-secondary-main mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{review.text}"</p>
                  <p className="font-bold text-gray-900 dark:text-white font-heading">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <Heart className="w-16 h-16 mx-auto text-primary-main mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white">Give Your Pet the Love They Deserve ❤️</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Join thousands of happy pet parents today.</p>
            <Link href={session ? "/search" : "/signup"}>
              <Button size="lg" className="px-12 py-6 text-lg rounded-full shadow-xl shadow-primary-main/30">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
