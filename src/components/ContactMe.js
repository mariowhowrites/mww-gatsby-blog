import React from "react"
import { Link } from "gatsby"

export default function ContactMe() {
  return (
    <section
      className={`flex flex-col bg-beige justify-center pl-7 md:pl-25vw md:min-h-60vh min-h-50vh`}
    >
      <h3 className="text-8xl md:text-12xl font-heading mb-8">
        <span role="img" aria-label="Mailbox">
          📬
        </span>
      </h3>
      <Link
        to="/contact"
        className="text-2xl md:text-4xl font-bold font-body text-teal-500"
      >
        Contact Me &gt;
      </Link>
    </section>
  )
}
