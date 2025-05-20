// components/common/TeamMemberCard.jsx
import { motion } from "framer-motion";
import { Card, Avatar } from "flowbite-react";

const TeamMemberCard = ({ 
  name, 
  position, 
  bio, 
  image, 
  socialLinks, 
  delay = 0,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={className}
    >
      <Card className="text-center hover:shadow-xl transition-shadow dark:bg-gray-700 h-full">
        <Avatar
          img={image}
          alt={name}
          rounded
          size="xl"
          className="mx-auto mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{name}</h3>
        <p className="text-blue-500 dark:text-blue-400 mb-2">{position}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{bio}</p>
        {socialLinks && (
          <div className="flex justify-center space-x-3">
            {socialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;