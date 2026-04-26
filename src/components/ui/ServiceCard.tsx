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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
        >
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-main transition-all">
                <div className="text-primary-main group-hover:text-white transition-colors">
                    {icon}
                </div>
            </div>
            <h3 className="font-heading font-semibold text-xl text-gray-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    );
}
