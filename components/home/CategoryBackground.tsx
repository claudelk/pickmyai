"use client"

import { useEffect } from "react"
import Image from "next/image"

interface CategoryBackgroundProps {
  imageSrc: string
  children: React.ReactNode
}

export function CategoryBackground({ imageSrc, children }: CategoryBackgroundProps) {
  // Add a class to the body so the navbar can go transparent
  useEffect(() => {
    document.body.classList.add("has-category-bg")
    return () => document.body.classList.remove("has-category-bg")
  }, [])

  return (
    <div className="relative min-h-screen -mt-16 pt-16">
      {/* Fixed full-screen background image — covers entire viewport including behind navbar */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
