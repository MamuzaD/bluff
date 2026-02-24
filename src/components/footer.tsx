export function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2">
      <h3 className="font-medium text-background">Built by Daniel, Bluff © {year}</h3>
    </div>
  )
}
