"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    delay?: number;
}

export function ServiceCard({ title, description, icon, delay = 0 }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 group overflow-hidden cursor-pointer"
        >
            {/* Glowing orb background effect on hover */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-main/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-16 h-16 rounded-2xl bg-primary-light/50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary-main group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300">
                <div className="text-primary-main group-hover:text-white transition-colors duration-300 group-hover:animate-bounce">
                    {icon}
                </div>
            </div>
            <h3 className="font-heading font-black text-xl text-gray-900 dark:text-white mb-3 group-hover:text-primary-main transition-colors">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                {description}
            </p>
            
            {/* Animated bottom border */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-primary-main to-secondary-main w-0 group-hover:w-full transition-all duration-500 ease-out" />
        </motion.div>
    );
}
