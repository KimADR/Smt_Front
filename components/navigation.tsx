"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, BarChart3, Building2, Menu, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Tableau de Bord", href: "/dashboard", icon: BarChart3 },
  { name: "Entreprises", href: "/entreprises", icon: Building2 },
  { name: "Mouvements", href: "/mouvements", icon: Zap },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg animate-glow"
                : "hover:bg-secondary hover:text-secondary-foreground",
              mobile && "text-lg",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive && "scale-110",
                !isActive && "group-hover:scale-105",
              )}
            />
            <span className="font-medium">{item.name}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border z-40 flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-xl animate-float">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SMT</h1>
              <p className="text-sm text-muted-foreground">Trésorerie Moderne</p>
            </div>
          </div>

          <div className="space-y-2">
            <NavItems />
          </div>
        </div>

        <div className="mt-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>v2.0</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SMT</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary rounded-xl">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">SMT</h1>
                    <p className="text-sm text-muted-foreground">Trésorerie Moderne</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <NavItems mobile />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

  {/* Spacer removed: main now uses responsive padding (lg:pl-64 / pt-16) */}
    </>
  )
}
