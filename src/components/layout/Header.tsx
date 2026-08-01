import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

import {
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      {/* Announcement bar */}
      <div
        className={`overflow-hidden bg-black text-center text-[11px] uppercase tracking-[0.15em] text-white transition-all duration-300 ${scrolled
            ? 'max-h-0 py-0 opacity-0'
            : 'max-h-20 px-4 py-2'
          }`}
      >
        Free shipping on orders over $100
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 border-b border-neutral-200 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''
          }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen ? 'Close menu' : 'Open menu'
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.5} />
            ) : (
              <Menu size={21} strokeWidth={1.5} />
            )}
          </button>

          {/* Logo */}
          <a
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
            onClick={closeMenu}
          >
            ATELIER
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#shop"
              className="text-sm transition-opacity hover:opacity-60"
            >
              Shop
            </a>

            <a
              href="#collections"
              className="text-sm transition-opacity hover:opacity-60"
            >
              Collections
            </a>

            <a
              href="#about"
              className="text-sm transition-opacity hover:opacity-60"
            >
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              className="hidden sm:block"
            >
              <Search
                size={19}
                strokeWidth={1.5}
              />
            </button>

            <Link
              to="/cart"
              aria-label="Shopping bag"
              className="relative"
            >
              <ShoppingBag
                size={19}
                strokeWidth={1.5}
              />

              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 md:hidden ${menuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
          }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-28">
          <nav className="flex flex-col">
            <a
              href="#shop"
              onClick={closeMenu}
              className="border-b border-neutral-200 py-5 text-3xl font-medium tracking-tight"
            >
              Shop
            </a>

            <a
              href="#collections"
              onClick={closeMenu}
              className="border-b border-neutral-200 py-5 text-3xl font-medium tracking-tight"
            >
              Collections
            </a>

            <a
              href="#about"
              onClick={closeMenu}
              className="border-b border-neutral-200 py-5 text-3xl font-medium tracking-tight"
            >
              About
            </a>
          </nav>

          <div className="mt-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              ATELIER
            </p>

            <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">
              Thoughtful everyday pieces designed with
              simplicity and longevity in mind.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}