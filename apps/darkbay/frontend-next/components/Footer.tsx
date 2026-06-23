export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-stone-900 bg-[url('/images/schiefer-hintergrund.jpg')] bg-cover bg-center py-1 mt-10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
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
