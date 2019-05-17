import React, { useState } from "react"
import { Link, StaticQuery, graphql } from "gatsby"

function PrimaryNav() {
  let [showMobileNav, setShowMobileNav] = useState(false)

  return (
    <StaticQuery
      query={primaryNavQuery}
      render={data => {
        const { title } = data.site.siteMetadata

        return (
          <div className={`absolute mt-2 md:mt-8 w-full font-body font-bold`}>
            <div
              className={`flex justify-between px-7 md:px-24 mx-auto items-baseline relative`}
            >
              <Link to="/">
                <h3 className={`text-xl md:text-3xl`}>{title}</h3>
              </Link>
              <aside className={`hidden md:block text-3xl opacity-50`}>
                <a className={`mr-12`}>Services</a>
                <a className={`mr-12`}>About</a>
                <a className={`mr-12`}>Careers</a>
                <a className={`mr-12`}>Blog</a>
                <a>Contact</a>
              </aside>
              <aside
                onClick={() => setShowMobileNav(!showMobileNav)}
                className={`md:hidden text-3xl cursor-pointer select-none`}
              >
                &#9776;
              </aside>
              <MobileNav show={showMobileNav} />
            </div>
          </div>
        )
      }}
    />
  )
}

function MobileNav({ show }) {
  console.log(show)

  return !show ? null : (
    <div className="bg-light-black absolute right-2rem top-2.75rem px-4 z-10 text-white antialiased">
      <ul class="list-none">
        <li className="my-2">Services</li>
        <li className="my-2">About</li>
        <li className="my-2">Careers</li>
        <li className="my-2">Blog</li>
      </ul>
    </div>
  )
}

export default PrimaryNav

const primaryNavQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
