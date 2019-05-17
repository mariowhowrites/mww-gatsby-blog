import React from "react"

export default function SkillsSection() {
  return (
    <section
      className={`flex flex-col bg-light-black justify-center min-h-70vh`}
    >
      <div
        className={`w-1/4 md:text-right md:ml-0 ml-7 font-bold text-xl md:text-2xl mb-4 md:mb-0 text-gray-600 antialiased`}
      >
        My Skills
      </div>
      <article
        className={`text-4xl md:text-6xl md:w-1/2 md:pr-64 md:ml-25vw ml-7 md:pt-8 font-heading font-bold relative flex flex-col text-white font-body`}
      >
        <ul className="list-none">
          <li>
            <a>Design</a>
            <span className="ml-4 text-teal-500">&gt;</span>
          </li>
          <li>
            <a>Develop</a>
            <span className="ml-4 text-orange-500">&gt;</span>
          </li>
          <li>
            <a>Demystify</a>
            <span className="ml-4 text-red-600">&gt;</span>
          </li>
          <li>
            <a>Deliver</a>
            <span className="ml-4 text-green-700">&gt;</span>
          </li>
        </ul>
      </article>
    </section>
  )
}
