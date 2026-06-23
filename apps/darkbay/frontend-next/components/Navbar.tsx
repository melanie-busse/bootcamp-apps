import Link from "next/link"
import Image from 'next/image';

import { isAuthenticated } from "@/lib/api"
import { logoutAction } from "@/lib/authActions"
import { Button } from "@/components/ui/button"

export default async function Navbar() {
  const loggedIn = await isAuthenticated()

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-stone-900 bg-[url('/images/schiefer-hintergrund.jpg')] bg-cover bg-center shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo & Avatar */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* Avatar-Bild */}
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary bg-slate-800">
            <Image
                src="/images/logo.png"
                alt="Pirate Westie Avatar"
                fill
                sizes="60px"
                className="object-cover"
                priority
            />
          </div>

          {/* Text */}
          <span className="text-xl font-black tracking-wider text-primary uppercase transition-colors group-hover:text-primary/80">
            Next<span className="text-foreground">Bay</span>
          </span>
                </Link>


        {/* Navigation & Auth */}
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Marktplatz
          </Link>

          {loggedIn ? (
            <>
              <Link
                href="/auctions/create"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Auktion erstellen
              </Link>
              <Link
                href="/watchlist"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                ⭐ Merkliste
              </Link>
              <form action={logoutAction}>
                <Button variant="destructive" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrieren</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
