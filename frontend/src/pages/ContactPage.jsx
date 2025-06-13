import {
  Button,
  TextInput,
  Textarea,
  Card,
  Alert,
  Spinner,
} from "flowbite-react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { useState } from "react";
import { PageMeta } from "../components/common/PageMeta";
import SectionHeader from "../components/common/SectionHeader";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  return (
    <div className="bg-background-surfaceLight dark:bg-background-surfaceDark min-h-screen py-12 px-4">
      <PageMeta
        title="Contact | Bill Sync - Get Support & Assistance"
        description="Get in touch with Bill Sync's support team. We're here to help with any questions about our billing and payment management solutions."
        keywords="contact Bill Sync, customer support, help desk, technical support, customer service, contact information"
      />
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Contact Us"
          subtitle="Have questions or feedback? We'd love to hear from you!"
          className="mb-16"
        />

        {submitted && (
          <Alert
            color="success"
            icon={FaCheckCircle}
            className="mb-8 max-w-2xl mx-auto"
            onDismiss={() => setSubmitted(false)}
          >
            Thank you for your message! We'll get back to you soon.
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Contact Form */}
          <Card className="bg-background-light dark:bg-background-dark">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Name *
                </label>
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  color={errors.name ? "failure" : "gray"}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Email *
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  color={errors.email ? "failure" : "gray"}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  color={errors.message ? "failure" : "gray"}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                color="primary"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card className="bg-background-light dark:bg-background-dark">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-50 dark:bg-gray-700 mr-4">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      203 Angle Square, Digital Valley
                      <br />
                      Surat, Gujarat 394105
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-50 dark:bg-gray-700 mr-4">
                    <FaPhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +1 (555) 123-4567
                      <br />
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-blue-50 dark:bg-gray-700 mr-4">
                    <FaEnvelope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      info@example.com
                      <br />
                      support@example.com
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Hours */}
            <Card className="bg-background-light dark:bg-background-dark">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Business Hours
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Monday - Friday
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    9:00 AM - 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Saturday
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    10:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Sunday
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    Closed
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Map */}
        <Card className="p-0 overflow-hidden bg-background-light dark:bg-background-dark">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14874.692024199153!2d72.8311!3d21.1702!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e8466bcf6eb%3A0x6ab1d4013788d700!2s6VM7%2BJP%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1715765634561!5m2!1sen!2sin"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="dark:filter dark:brightness-75"
            title="Office Location"
          />
        </Card>
      </div>
    </div>
  );
}
