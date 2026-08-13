"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { WalletButton } from "@/components/wallet-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/demo",    label: "Demo"     },
  { href: "/issuer",  label: "Issuer"   },
  { href: "/investor",label: "Investor" },
  { href: "/auditor", label: "Auditor"  },
  { href: "/proofs",  label: "Proofs"   }
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo size="sm" priority className="transition-colors group-hover:border-gold/50" />
          <span className="text-base font-semibold tracking-tight text-text-1">
            Kavro
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "text-gold"
                    : "text-text-2 hover:text-text-1"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-px animate-fade-in rounded-full bg-gold [animation-duration:180ms] motion-reduce:animate-none" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/architecture" className="hidden text-xs font-medium text-text-3 transition-colors hover:text-text-1 lg:inline-flex">
            Docs
          </Link>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
