import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0 px-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} NextBay. Alle Rechte vorbehalten. Ein sicherer Hafen für
          den Untergrund.
        </p>
        <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground"></div>
      </div>
    </footer>
  )
}
