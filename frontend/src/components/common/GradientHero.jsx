// components/common/GradientHero.jsx
import { motion } from "framer-motion";
import { Button } from "flowbite-react";

const GradientHero = ({ 
  title, 
  highlight, 
  subtitle, 
  primaryButtonText, 
  primaryButtonAction, 
  secondaryButtonText, 
  secondaryButtonAction,
  gradientFrom = "from-blue-500",
  gradientTo = "to-cyan-400",
  darkGradientFrom = "from-blue-700",
  darkGradientTo = "to-cyan-600",
  className = ""
}) => {
  return (
    <section className={`relative py-20 px-4 text-center bg-gradient-to-r ${gradientFrom} ${gradientTo} dark:${darkGradientFrom} dark:${darkGradientTo} text-white overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
        </svg>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          {title} <span className="text-yellow-300">{highlight}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          {primaryButtonText && (
            <Button
              gradientDuoTone="cyanToBlue"
              size="xl"
              className="group"
              onClick={primaryButtonAction}
            >
              <span className="group-hover:scale-105 transition-transform">
                {primaryButtonText}
              </span>
            </Button>
          )}
          {secondaryButtonText && (
            <Button
              outline
              color="light"
              size="xl"
              className="hover:bg-white hover:text-blue-600 transition-colors"
              onClick={secondaryButtonAction}
            >
              {secondaryButtonText}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GradientHero;