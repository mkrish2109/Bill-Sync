import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsLinkedin,
  BsWhatsapp,
} from "react-icons/bs";
import { Logo } from "../../components/common/Logo";
import { Link } from "react-router-dom";

function UserFooter() {
  return (
    <footer className="bg-background-surfaceLight dark:bg-background-dark border-t border-border-light dark:border-border-dark">
      <div className="w-full  p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between w-full">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <Logo variant="full" size="lg" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-text-light dark:text-text-dark">
                Company
              </h2>
              <ul className="text-text-mutedLight dark:text-text-mutedDark font-medium">
                <li className="mb-4">
                  <Link to="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-text-light dark:text-text-dark">
                Help Center
              </h2>
              <ul className="text-text-mutedLight dark:text-text-mutedDark font-medium">
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Support
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    FAQs
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-text-light dark:text-text-dark">
                Legal
              </h2>
              <ul className="text-text-mutedLight dark:text-text-mutedDark font-medium">
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-border-light dark:border-border-dark sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-text-mutedLight dark:text-text-mutedDark sm:text-center">
            © {new Date().getFullYear()}{" "}
            <Link to="/" className="hover:underline">
              Bill-Sync™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="mt-4 flex space-x-5 sm:mt-0 sm:justify-center">
            <Link
              to="/"
              className="text-text-mutedLight hover:text-text-light dark:hover:text-text-dark"
            >
              <BsFacebook className="h-5 w-5" />
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link
              to="/"
              className="text-text-mutedLight hover:text-text-light dark:hover:text-text-dark"
            >
              <BsInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram page</span>
            </Link>
            <Link
              to="/"
              className="text-text-mutedLight hover:text-text-light dark:hover:text-text-dark"
            >
              <BsTwitter className="h-5 w-5" />
              <span className="sr-only">Twitter page</span>
            </Link>
            <Link
              to="/"
              className="text-text-mutedLight hover:text-text-light dark:hover:text-text-dark"
            >
              <BsLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn page</span>
            </Link>
            <Link
              to="/"
              className="text-text-mutedLight hover:text-text-light dark:hover:text-text-dark"
            >
              <BsWhatsapp className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
