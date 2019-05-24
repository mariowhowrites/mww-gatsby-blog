import React from "react"
import PrimaryNav from "./primary-nav"

class Layout extends React.Component {
  render() {
    const { children } = this.props

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
}

export default Layout
