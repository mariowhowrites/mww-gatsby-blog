import React from "react"

export default function ContactMe() {
  return (
    <section
      className={`flex flex-col bg-beige justify-center items-center md:min-h-60vh min-h-50vh`}
    >
      <h3 className="text-4xl md:text-6xl font-heading mb-8">Ready to talk?</h3>
      <a className="text-2xl md:text-4xl font-bold font-body text-teal-500">
        Contact Me &gt;
      </a>
    </section>
  )
}
