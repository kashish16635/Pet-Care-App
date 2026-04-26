import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, ShieldCheck, CheckCircle2, Clock, CalendarHeart, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function SitterProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const sitter = await prisma.sitter.findUnique({
        where: { id },
        include: {
            reviewsList: {
                include: { user: true },
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!sitter) {
        return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Sitter not found</div>;
    }

    // Default mock data for fields not yet in DB
    const services = [
        "Dog Walking (30-60 mins)",
        "Drop-in Visits",
        "House Sitting",
        "Basic Puppy Training"
    ];
    const gallery = ["Pet Playing", "Walking Dog", "Happy Cat"];
    const actualReviews = sitter.reviewsList || [];

    return (
        <div className="min-h-screen bg-background-soft font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row gap-8">

                    {/* Avatar Area */}
                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary-light to-secondary-light dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center shrink-0 shadow-md">
                        <span className="text-5xl font-bold text-primary-main dark:text-white/50 mb-2">
                            {sitter.name.split(' ').map(n => n[0]).join('').toUpperCase() || "S"}
                        </span>
                        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3" /> Aadhar Verified
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{sitter.name}</h1>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-primary-main">₹{sitter.price || 500}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">starting per service</p>
                                </div>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-3">{sitter.type}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <MapPin className="w-4 h-4 text-primary-main" /> {sitter.location}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-gray-900 dark:text-white">{sitter.rating}</span>
                                    ({sitter.reviews} reviews)
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <Clock className="w-4 h-4 text-secondary-main" /> {sitter.distance}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <Link href={`/book/${sitter.id}`} className="flex-1 md:flex-none md:w-64">
                                <Button size="lg" className="w-full h-14 text-lg">
                                    <CalendarHeart className="w-5 h-5 mr-2" /> Book Now
                                </Button>
                            </Link>
                            {sitter.userId && (
                                <Link href={`/messages/${sitter.userId}`} className="hidden sm:flex">
                                    <Button size="lg" variant="outline" className="h-14 px-6">Message</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">About {sitter.name.split(' ')[0]}</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{sitter.about || "This caregiver is ready to help!"}</p>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">Services Offered</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map((service, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-200">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Recent Reviews</h2>
                            <div className="flex flex-col gap-6">
                                {actualReviews.length > 0 ? actualReviews.map((review: any) => (
                                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-secondary-main">
                                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white ml-2">{review.user?.name || "Anonymous User"}</span>
                                        </div>
                                        {review.comment && <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>}
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">No reviews yet.</p>
                                )}
                            </div>
                            <Button variant="link" className="mt-4 p-0 h-auto font-semibold">Read all {sitter.reviews} reviews →</Button>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-6">
                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4">Why Book With Us?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <ShieldCheck className="w-6 h-6 text-primary-main shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">Aadhar Verified</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Identity and background checks cleared.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <Heart className="w-6 h-6 text-secondary-main shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">Premium Insurance</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Up to ₹50,000 coverage for vet emergencies.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4">Gallery</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {gallery.map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium p-2 text-center border border-gray-200 dark:border-gray-700">
                                        {img}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
