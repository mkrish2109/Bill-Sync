import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsLinkedin,
  BsWhatsapp,
} from "react-icons/bs";
import { Logo } from "../../components/common/Logo";

function UserFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-background-dark border-t border-gray-200 dark:border-background-dark">
      <div className="w-full  p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between w-full">
          <div className="mb-6 md:mb-0">
            <a href="#" className="flex items-center">
              <Logo variant="full" size="lg" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Company</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">About Us</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Contact</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Careers</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Help Center</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Support</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">FAQs</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Documentation</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a href="#" className="hover:underline">
              Bill-Sync™
            </a>
            . All Rights Reserved.
          </span>
          <div className="mt-4 flex space-x-5 sm:mt-0 sm:justify-center">
            <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsFacebook className="h-5 w-5" />
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram page</span>
            </a>
            <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsTwitter className="h-5 w-5" />
              <span className="sr-only">Twitter page</span>
            </a>
            <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn page</span>
            </a>
            <a href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <BsWhatsapp className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
