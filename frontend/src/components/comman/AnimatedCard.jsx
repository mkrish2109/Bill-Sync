// components/common/AnimatedCard.jsx
import { motion } from "framer-motion";
import { Card } from "flowbite-react";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AnimatedCard = ({ icon, title, description, color, delay = 0, className = "" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

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
      <Card className="h-full hover:shadow-xl transition-all dark:bg-gray-800">
        <div className={`text-${color}-500 dark:text-${color}-400 text-4xl mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;