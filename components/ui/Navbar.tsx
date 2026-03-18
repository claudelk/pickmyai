"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "./Logo"

export function Navbar() {
  return (
    <Suspense>
      <NavbarInner />
    </Suspense>
  )
}

function NavbarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const logoVariant = (searchParams.get("logo") as "a" | "d") || "d"

  // Preserve all query params across navigation
  const qs = searchParams.toString()
  const suffix = qs ? `?${qs}` : ""

  const links = [
    { href: "/", label: "Compare" },
    { href: "/learn", label: "Learn" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-warm-50/80 backdrop-blur-md border-b border-warm-200 h-16 flex items-center px-6">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <a href={`/${suffix}`} className="text-accent-600">
          <Logo variant={logoVariant} />
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`${link.href}${suffix}`}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-warm-800 underline underline-offset-4 decoration-accent-400"
                  : "text-warm-500 hover:text-warm-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-warm-100 transition-colors duration-200 focus:ring-2 focus:ring-accent-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} className="text-warm-600" /> : <Menu size={20} className="text-warm-600" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-warm-50 border-b border-warm-200 sm:hidden">
          <div className="flex flex-col p-4 gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={`${link.href}${suffix}`}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 ${
                  pathname === link.href
                    ? "text-warm-800 underline underline-offset-4 decoration-accent-400"
                    : "text-warm-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
