"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Socials from "@/components/Socials";

import styles from "./Navbar.module.css";

const navigation = [
  {
    label: "Home",
    href: "/",
    icon: "/cross.svg",
  },
  {
    label: "About",
    href: "/about",
    icon: "/file.svg",
  },
  {
    label: "Volunteer",
    href: "/volunteer",
    icon: "/apply.png",
  },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="Trust Church home"
            onClick={closeMenu}
          >
            <Image
              src="/logo-tp.png"
              alt="Trust Church"
              width={150}
              height={48}
              priority
              className={styles.logo}
            />
          </Link>

          <nav
            className={styles.desktopNav}
            aria-label="Primary navigation"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.active : undefined}
                >
                  <Image
                    aria-hidden
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={styles.navIcon}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}

            <a
              href="https://www.bible.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/bible.svg"
                alt=""
                width={16}
                height={16}
                className={styles.navIcon}
              />

              <span>Bible</span>

              <span
                aria-hidden="true"
                className={styles.externalIcon}
              >
                ↗
              </span>
            </a>
          </nav>

          <div className={styles.desktopSocials}>
            <Socials />
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${
            menuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={
                  isActive(item.href)
                    ? styles.mobileActive
                    : undefined
                }
              >
                <span className={styles.mobileNavLabel}>
                  <Image
                    aria-hidden
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className={styles.mobileNavIcon}
                  />

                  {item.label}
                </span>

                <span aria-hidden="true">→</span>
              </Link>
            ))}

            <a
              href="https://www.bible.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.mobileNavLabel}>
                <Image
                  aria-hidden
                  src="/bible.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.mobileNavIcon}
                />

                Bible
              </span>

              <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <div className={styles.mobileSocials}>
            <Socials />
          </div>
        </div>
      </div>
    </header>
  );
}