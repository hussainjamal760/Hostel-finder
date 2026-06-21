"use client";

import React from "react";
import Link from "next/link";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineArrowRight,
} from "react-icons/hi";
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: "Find Hostels", href: "/hostels" },
      { name: "Browse by City", href: "/hostels" },
      { name: "Popular Areas", href: "/hostels" },
      { name: "Map View", href: "/hostels" },
    ],
    forManagers: [
      { name: "List Your Hostel", href: "/hostel-dashboard" },
      { name: "Manager Dashboard", href: "/hostel-dashboard" },
      { name: "About", href: "/about" },
    ],
    support: [
      { name: "Help Center", href: "/contact" },
      { name: "Contact Us", href: "/contact" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/in/hussain-jamal-b5a76531a/",
      label: "LinkedIn",
    },
    {
      icon: FaGithub,
      href: "https://github.com/hussainjamal760",
      label: "GitHub",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/923181792848",
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#1a0f0a] dark:bg-[#fcf2e9]">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#fcf2e9]/20 dark:via-[#2c1b13]/20 to-transparent" />
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#2c1b13]/30 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-[300px] w-[300px] rounded-full bg-[#2c1b13]/20 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-20 pb-8 md:px-12">
        {/* Main Footer */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-6 inline-block">
              <h2 className="text-2xl font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                Hostelites
              </h2>
            </Link>

            <p className="mb-6 max-w-sm leading-relaxed text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
              Pakistan&apos;s #1 platform for finding and listing quality
              hostels. Connecting students and professionals with their
              perfect accommodation.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                <HiOutlineLocationMarker size={18} />
                <span className="text-sm">Lahore, Pakistan</span>
              </div>

              <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                <HiOutlineMail size={18} />
                <a
                  href="mailto:hjamal9865@gmail.com"
                  className="text-sm hover:text-[#fcf2e9] dark:hover:text-[#2c1b13]"
                >
                  hjamal9865@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                <HiOutlinePhone size={18} />
                <a
                  href="tel:+923181792848"
                  className="text-sm hover:text-[#fcf2e9] dark:hover:text-[#2c1b13]"
                >
                  +92 318 1792848
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13]">
              Explore
            </h3>

            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#fcf2e9]/60 transition-colors hover:text-[#fcf2e9] dark:text-[#2c1b13]/60 dark:hover:text-[#2c1b13]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Managers */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13]">
              For Managers
            </h3>

            <ul className="space-y-3">
              {footerLinks.forManagers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#fcf2e9]/60 transition-colors hover:text-[#fcf2e9] dark:text-[#2c1b13]/60 dark:hover:text-[#2c1b13]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13]">
              Stay Updated
            </h3>

            <p className="mb-4 text-sm text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
              Subscribe to get the latest hostels and exclusive deals.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-[#fcf2e9]/10 bg-[#fcf2e9]/5 px-4 py-3 text-sm text-[#fcf2e9] placeholder:text-[#fcf2e9]/40 focus:border-[#fcf2e9]/30 focus:outline-none dark:border-[#2c1b13]/10 dark:bg-[#2c1b13]/5 dark:text-[#2c1b13] dark:placeholder:text-[#2c1b13]/40 dark:focus:border-[#2c1b13]/30"
              />

              <button
                type="submit"
                className="rounded-xl bg-[#fcf2e9] px-4 py-3 text-[#2c1b13] transition-transform hover:scale-105 active:scale-95 dark:bg-[#2c1b13] dark:text-[#fcf2e9]"
              >
                <HiOutlineArrowRight size={18} />
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="rounded-xl bg-[#fcf2e9]/5 p-3 text-[#fcf2e9]/60 transition-all hover:bg-[#fcf2e9]/10 hover:text-[#fcf2e9] dark:bg-[#2c1b13]/5 dark:text-[#2c1b13]/60 dark:hover:bg-[#2c1b13]/10 dark:hover:text-[#2c1b13]"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#fcf2e9]/10 pt-8 dark:border-[#2c1b13]/10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-[#fcf2e9]/40 dark:text-[#2c1b13]/40">
              © {currentYear} Hostelites. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[#fcf2e9]/40 transition-colors hover:text-[#fcf2e9]/70 dark:text-[#2c1b13]/40 dark:hover:text-[#2c1b13]/70"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-[#fcf2e9]/40 transition-colors hover:text-[#fcf2e9]/70 dark:text-[#2c1b13]/40 dark:hover:text-[#2c1b13]/70"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;