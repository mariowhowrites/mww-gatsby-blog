import React, { FC, ReactNode, ReactNodeArray } from "react"
import PrimaryNav from "./primary-nav"

interface LayoutProps {
  children: ReactNode | ReactNodeArray
}

export const Layout: FC<LayoutProps> = function({ children }) {
  return (
    <div
      className={`bg-beige relative font-body min-h-screen md:overflow-x-visible overflow-x-hidden`}
    >
      <PrimaryNav />
      <main className="pt-16">{children}</main>
      <footer className={`absolute bottom-0 pb-2 pl-2`}>
        © {new Date().getFullYear()}. Built By Mario
      </footer>
    </div>
  )
}
