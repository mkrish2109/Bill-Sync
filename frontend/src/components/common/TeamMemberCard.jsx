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
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={className}
    >
      <Card className="text-center hover:shadow-xl transition-shadow bg-background-surfaceLight dark:bg-background-surfaceDark h-full">
        <Avatar
          img={image}
          alt={name}
          rounded
          size="xl"
          className="mx-auto mb-4"
        />
        <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
          {name}
        </h3>
        <p className="text-primary-light dark:text-primary-dark mb-2">{position}</p>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark mb-4">{bio}</p>
        {socialLinks && (
          <div className="flex justify-center space-x-3">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-mutedLight hover:text-primary-light dark:text-text-mutedDark dark:hover:text-primary-dark transition-colors"
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
