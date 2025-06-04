import { Avatar, Button, Card, Tooltip } from "flowbite-react";
import { 
  FaRegLightbulb, 
  FaChartLine, 
  FaShieldAlt, 
  FaHandshake,
} from "../components/icons/homeIcons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageMeta } from "../components/common/PageMeta";
import SectionHeader from "../components/common/SectionHeader";
import AnimatedCard from "../components/common/AnimatedCard";
import StepItem from "../components/common/StepItem";
import StatItem from "../components/common/StatItem";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="Home" />
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-700 dark:to-cyan-600 text-white py-20 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative ">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              >
                Simplify Your <span className="text-yellow-300">Billing</span> with Tex Bill
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl mb-8 max-w-lg"
              >
                The ultimate solution for efficient, accurate, and professional billing management.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  // gradientDuoTone="cyanToBlue" 
                  size="xl"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto group"
                >
                  <span className="group-hover:scale-105 transition-transform">
                    Get Started Free
                  </span>
                </Button>
                <Button 
                  outline 
                  color="light" 
                  size="xl"
                  onClick={() => navigate('/pricing')}
                  className="w-full sm:w-auto hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View Pricing
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Tooltip 
                      key={i} 
                      content={`User ${i}`} 
                      placement="bottom"
                      className="border border-gray-200 dark:border-gray-700"
                    >
                      <Avatar 
                        img={`/images/avatar${i}.webp`} 
                        rounded 
                        size="sm"
                        className="hover:scale-110 transition-transform"
                      />
                    </Tooltip>
                  ))}
                </div>
                <p className="text-sm text-blue-100 dark:text-blue-200">
                  Join <span className="font-bold">1,000+</span> satisfied customers
                </p>
              </motion.div>
            </div>
           <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img 
              src="/images/hero-image.webp"
              alt="Modern billing dashboard interface showing analytics and payment processing"
              className="relative w-full max-w-2xl mx-auto object-cover "
              fetchpriority="high"
              width="800"
              height="600"
              loading="eager"
              decoding="async"
            />

            </motion.div>
          </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-90">
              {['AWS', 'Stripe', 'Google Cloud', 'Microsoft', 'PayPal'].map((company) => (
                <motion.div
                  key={company}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-600 dark:text-gray-300 font-bold text-xl md:text-2xl hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <SectionHeader
              tagline="WHY CHOOSE US"
              title="Powerful Features Designed for You"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedCard
                icon={<FaRegLightbulb />}
                title="Intuitive Interface"
                description="Easy-to-use dashboard designed for efficiency and minimal training requirements."
                color="blue"
              />
              <AnimatedCard
                icon={<FaChartLine />}
                title="Real-time Analytics"
                description="Track your billing history, payments, and financial insights in real-time."
                color="green"
              />
              <AnimatedCard
                icon={<FaShieldAlt />}
                title="Secure & Reliable"
                description="Enterprise-grade security to protect your sensitive billing data."
                color="purple"
              />
              <AnimatedCard
                icon={<FaHandshake className="text-sky-500"/>}
                title="Client Management"
                description="Manage all your clients in one place with customizable billing options."
                color="amber"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <SectionHeader
              tagline="GET STARTED"
              title="How Tex Bill Works"
            />
            
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-blue-400/10 dark:bg-blue-600/10 rounded-2xl blur-lg"></div>
                  <img 
                    src="/images/dashboard-preview.webp"
                    alt="Tex Bill dashboard preview" 
                    className="relative rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full" 
                  />
                </motion.div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <StepItem
                  number="1"
                  title="Create Your Account"
                  description="Sign up in minutes and set up your profile with our easy onboarding process."
                />
                <StepItem
                  number="2"
                  title="Add Clients & Services"
                  description="Import your client list and define your service offerings with customizable rates."
                />
                <StepItem
                  number="3"
                  title="Generate Professional Bills"
                  description="Create, send, and track invoices with just a few clicks."
                />
                <StepItem
                  number="4"
                  title="Get Paid Faster"
                  description="Integrated payment options help you receive payments quickly and securely."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <SectionHeader
              tagline="TESTIMONIALS"
              title="Trusted by Businesses Worldwide"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Freelance Designer",
                  avatar: "/images/avatar1.webp",
                  quote: "Tex Bill has saved me so much time! I can now generate professional invoices in minutes and track all my payments in one place.",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Small Business Owner",
                  avatar: "/images/avatar2.webp",
                  quote: "The analytics dashboard gives me clear insights into my cash flow. I've improved my payment collection rate by 30% since switching.",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  role: "Consultant",
                  avatar: "/images/avatar3.webp",
                  quote: "Client management is so easy with Tex Bill. The recurring billing feature is a game-changer for my retainer clients.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="mb-4 flex items-center">
                      <Avatar img={testimonial.avatar} rounded size="lg" />
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <StarRating rating={testimonial.rating} />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-800 dark:to-cyan-700 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Invoices Generated" },
                { number: "$50M+", label: "Processed" },
                { number: "95%", label: "Customer Satisfaction" },
                { number: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <StatItem
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <SectionHeader
              title="Ready to Transform Your Billing Process?"
              subtitle="Join thousands of professionals who trust Tex Bill for their billing needs."
              className="mb-8 text-gray-800 dark:text-white"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="xl"
                onClick={() => navigate('/register')}
                className="mx-2 mb-4 group bg-blue-600 hover:bg-blue-700 text-white"
              >
                <span className="group-hover:scale-105 transition-transform">
                  Start Your Free Trial
                </span>
              </Button>
              <Button 
                outline 
                size="xl"
                onClick={() => navigate('/contact')}
                className="mx-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700 transition-colors"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

// Replace the star rating SVG with a simple component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex text-amber-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      {hasHalfStar && (
        <svg key="half" className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}

      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 fill-current text-gray-300" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};


export default HomePage;