import { FaXTwitter, FaInstagram, FaGithub, FaWater } from "react-icons/fa6";

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/trust_church",
    Icon: FaInstagram,
  },
  {
    name: "GitHub",
    href: "https://github.com/trustchurch",
    Icon: FaGithub,
  },
  {
    name: "Primal",
    href: "https://primal.net/trustchurch",
    Icon: FaWater,
  },
  {
    name: "X",
    href: "https://x.com/TrustChurchOrg",
    Icon: FaXTwitter,
  },
] as const;

export default function Socials() {
  return (
    <section aria-label="Social links" className="flex items-center gap-3">
      {socials.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={name}
          title={name}
          className="inline-flex items-center justify-center rounded-full p-2 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black/40"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </section>
  );
}
