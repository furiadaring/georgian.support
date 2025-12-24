import Image from "next/image";
import Link from "next/link";

interface SocialLink {
  href: string;
  icon: string;
  label: string;
  color?: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined";
  className?: string;
}

export default function SocialLinks({
  links,
  size = "md",
  variant = "default",
  className = "",
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
            variant === "outlined"
              ? "border border-current hover:bg-current/10"
              : "hover:opacity-80"
          }`}
          aria-label={link.label}
        >
          <Image
            src={link.icon}
            alt={link.label}
            width={iconSizes[size]}
            height={iconSizes[size]}
            unoptimized
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}
