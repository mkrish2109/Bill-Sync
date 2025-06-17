import { motion } from "framer-motion";
import { Card } from "flowbite-react";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// Color mapping for icons
const colorMap = {
  blue: "text-blue-500 dark:text-blue-400",
  green: "text-green-500 dark:text-green-400",
  purple: "text-purple-500 dark:text-purple-400",
  amber: "text-amber-500 dark:text-amber-400",
  red: "text-red-500 dark:text-red-400",
};

const AnimatedCard = ({ icon, title, description, color = "blue", delay = 0, className = "" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const iconColorClass = colorMap[color] || colorMap.blue;

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className="h-full hover:shadow-xl transition-all bg-background-surfaceLight dark:bg-background-surfaceDark border-border-light dark:border-border-dark">
        <div className={`${iconColorClass} text-4xl mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">{title}</h3>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;