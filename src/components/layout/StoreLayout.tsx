import type { ReactNode } from 'react'

import { BackToTop } from '../ui/BackToTop'
import { Footer } from './Footer'
import { Header } from './Header'

type StoreLayoutProps = {
  children: ReactNode
}

export function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <>
      <Header />

      {children}

      <Footer />

      <BackToTop />
    </>
  )
}