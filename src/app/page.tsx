"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { motion } from "framer-motion";
import {
  Heart, ShieldCheck, MapPin, Clock, Search,
  CalendarCheck, MessageCircle, Star, Smartphone, Activity, PawPrint
} from "lucide-react";

export default function Home() {
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-[500px] w-full max-w-lg mx-auto lg:ml-auto"
              >
                <div className="absolute inset-0 bg-gradient-brand rounded-[3rem] rotate-3 opacity-20 dark:opacity-40 shadow-xl" />
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-[3rem] -rotate-3 border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden flex items-center justify-center relative">
                  <img 
                    src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800&auto=format&fit=crop" 
                    alt="Cute golden retriever puppy" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Badge */}
                <Link href="/subscription" className="absolute -bottom-6 -left-6 block group/badge z-20">
                  <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-md group-hover/badge:scale-105 group-hover/badge:border-primary-main transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover/badge:bg-primary-main group-hover/badge:text-white transition-colors">
                        <Heart className="w-5 h-5 text-green-600 dark:text-green-400 group-hover/badge:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Emergency Support</p>
                        <p className="text-[10px] font-bold text-primary-main uppercase tracking-widest mt-0.5">Upgrade to Access 24/7</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
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
                { step: 1, title: "Search", desc: "Browse through our verified nearby professionals.", icon: <Search /> },
                { step: 2, title: "Book", desc: "Select services, dates, and customize care.", icon: <CalendarCheck /> },
                { step: 3, title: "Track", desc: "Get live updates on WhatsApp, photos, and camera feeds.", icon: <Smartphone /> },
                { step: 4, title: "Review", desc: "Share your experience and give ratings.", icon: <Star /> },
              ].map((item, i) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 shadow-xl flex items-center justify-center mb-6 text-primary-main z-10 relative">
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary-main text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {item.step}
                    </span>
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">{item.desc}</p>
                </div>
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
            <Link href="/signup">
              <Button size="lg" className="px-12 py-6 text-lg rounded-full shadow-xl shadow-primary-main/30">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
