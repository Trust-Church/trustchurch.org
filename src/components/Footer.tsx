"use client";

import Socials from "@/components/Socials";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function normalizePath(p: string) {
  if (!p) return "/";
  // remove query/hash just in case, and strip trailing slashes (except "/")
  const base = p.split("?")[0].split("#")[0];
  return base.length > 1 ? base.replace(/\/+$/, "") : base;
}

function isRouteActive(pathname: string, href: string, match: "exact" | "prefix") {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (match === "exact") return current === target;

  // prefix match: "/volunteer" matches "/volunteer" and "/volunteer/anything"
  return current === target || current.startsWith(`${target}/`);
}

export default function Footer() {
  const pathname = usePathname() || "/";

  const navLinks = [
    {
      href: "/",
      label: "Home",
      icon: { src: "/cross.svg", alt: "Cross icon", w: 16, h: 16 },
      className: "flex items-center gap-2 hover:underline hover:underline-offset-4",
      match: "exact" as const,
    },
    {
      href: "/about",
      label: "About",
      icon: { src: "/file.svg", alt: "File icon", w: 16, h: 16 },
      className:
        "flex items-center gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-md",
      match: "exact" as const,
    },
    {
      href: "/volunteer",
      label: "Volunteer",
      icon: { src: "/apply.png", alt: "Application icon", w: 16, h: 16 },
      className:
        "flex items-center gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-md",
      match: "prefix" as const, // ✅ hides on /volunteer AND /volunteer/*
    },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !isRouteActive(pathname, link.href, link.match)
  );

  return (
    <footer className="row-start-3 mt-6 flex flex-col items-center justify-center gap-4">
      <nav className="flex items-center justify-center gap-3 sm:gap-6 whitespace-nowrap">
        {filteredLinks.map((link) => (
          <Link key={link.href} href={link.href} className={link.className}>
            <Image
              aria-hidden
              src={link.icon.src}
              alt={link.icon.alt}
              width={link.icon.w}
              height={link.icon.h}
            />
            {link.label}
          </Link>
        ))}

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-md"
          href="https://www.bible.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/bible.svg" alt="Bible icon" width={16} height={16} />
          <span className="hidden sm:inline">Read the Bible →</span>
          <span className="sm:hidden">Bible →</span>
        </a>
      </nav>

      <Socials />
    </footer>
  );
}
