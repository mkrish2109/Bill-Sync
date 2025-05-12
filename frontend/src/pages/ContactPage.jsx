import { Button, TextInput, Textarea, Card, Alert } from "flowbite-react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Name
                </label>
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Email
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <Button
                type="submit"
                gradientDuoTone="cyanToBlue"
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="w-6 h-6 text-[#44b8ff] dark:text-blue-400 mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Business Avenue<br />
                      Tech City, TC 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaPhone className="w-6 h-6 text-[#44b8ff] dark:text-blue-400 mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +1 (555) 123-4567<br />
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaEnvelope className="w-6 h-6 text-[#44b8ff] dark:text-blue-400 mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      info@texbill.com<br />
                      support@texbill.com
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card className="p-0 overflow-hidden dark:bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209132873!2d-73.9878449245258!3d40.74844047138915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1623251156839!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="dark:filter dark:brightness-75"
                title="Office Location"
              ></iframe>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}