import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Sørg for at denne er her
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Viktig Spørreundersøkelse til Gaven!",
  description: "Noen spørsmål for å lage den perfekte gaven.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body className={inter.className}>
        <Link href="/admin" className="text-sm font-medium hover:underline">
          Admin Dashboard
        </Link>
        {children}
      </body>
    </html>
  )
}
