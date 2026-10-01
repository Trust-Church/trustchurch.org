import Link from "next/link";
import Image from "next/image";

import Socials from "@/components/Socials";

const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: "/cross.svg",
  },
  {
    href: "/about",
    label: "About",
    icon: "/file.svg",
  },
  {
    href: "/volunteer",
    label: "Volunteer",
    icon: "/apply.png",
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#191b18] text-[#e9e9e3]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex min-h-[260px] flex-col justify-between gap-12 py-14 sm:flex-row sm:items-start sm:py-16">
          <div>
            <Link
              href="/"
              className="font-serif text-3xl tracking-[-0.035em] text-[#e9e9e3] no-underline"
            >
              Trust Church
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
              Loving God deeply.
              <br />
              Loving people practically.
            </p>
          </div>

          <div className="flex flex-col items-start gap-8 sm:items-end">
            <Socials />

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                >
                  <Image
                    aria-hidden
                    src={link.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="invert opacity-70"
                  />

                  <span>{link.label}</span>
                </Link>
              ))}

              <a
                href="https://www.bible.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
              >
                <Image
                  aria-hidden
                  src="/bible.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="invert opacity-70"
                />

                <span>Bible</span>

                <span
                  aria-hidden="true"
                  className="text-white/40"
                >
                  ↗
                </span>
              </a>
            </nav>
          </div>
        </div>

        <div className="flex min-h-[78px] flex-col justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:py-0">
          <p>
            © {new Date().getFullYear()} Trust Church
          </p>

          <p>
            Faith in action.
          </p>
        </div>
      </div>
    </footer>
  );
}