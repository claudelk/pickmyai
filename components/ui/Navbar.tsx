"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "/", label: "Compare" },
    { href: "/learn", label: "Learn" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center px-6">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#2563EB]">
          PickMyAI
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-slate-900 underline underline-offset-4"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-slate-100 focus:ring-2 focus:ring-blue-500"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 sm:hidden">
          <div className="flex flex-col p-4 gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 ${
                  pathname === link.href
                    ? "text-slate-900 underline underline-offset-4"
                    : "text-slate-500"
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
