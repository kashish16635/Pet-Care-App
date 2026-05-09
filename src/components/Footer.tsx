import Link from "next/link";
import { PawPrint, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/Button";

export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 pt-16 pb-8 border-t border-gray-100 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-primary-main rounded-xl">
                                <PawPrint className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">
                                Paws & Care
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Trusted pet care services connecting you with verified sitters, groomers, and vets. Give your pet the love they deserve, anytime, anywhere.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="p-2 bg-white dark:bg-gray-900 shadow-sm rounded-full text-gray-400 hover:text-primary-main transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white dark:bg-gray-900 shadow-sm rounded-full text-gray-400 hover:text-primary-main transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white dark:bg-gray-900 shadow-sm rounded-full text-gray-400 hover:text-primary-main transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Services</h3>
                        <ul className="space-y-3">
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Pet Sitting</Link></li>
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Boarding Centers</Link></li>
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Grooming & Training</Link></li>
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Vet Consultation</Link></li>
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Pet Pickup & Drop</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Company</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">About Us</Link></li>
                            <li><Link href="/#how-it-works" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">How it Works</Link></li>
                            <li><Link href="/#trust" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Trust & Safety</Link></li>
                            <li><Link href="/search" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Careers</Link></li>
                            <li><Link href="mailto:hello@pawsandcare.com" className="text-gray-500 dark:text-gray-400 hover:text-primary-main text-sm transition-colors font-medium">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="w-5 h-5 text-primary-main shrink-0" />
                                <span className="font-medium">123 Pet Avenue, Suite 100<br />New York, NY 10001</span>
                            </li>
                            <li>
                                <a href="tel:+18001237297" className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-main transition-colors font-medium">
                                    <Phone className="w-5 h-5 text-primary-main shrink-0" />
                                    <span>+1 (800) 123-PAWS</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hello@pawsandcare.com" className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-main transition-colors font-medium">
                                    <Mail className="w-5 h-5 text-primary-main shrink-0" />
                                    <span>hello@pawsandcare.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-[12px] font-medium">
                        © {new Date().getFullYear()} Paws & Care Platforms. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-[12px] font-medium">
                        <Link href="/" className="text-gray-400 hover:text-primary-main transition-colors">Privacy Policy</Link>
                        <Link href="/" className="text-gray-400 hover:text-primary-main transition-colors">Terms of Service</Link>
                        <Link href="/" className="text-gray-400 hover:text-primary-main transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
