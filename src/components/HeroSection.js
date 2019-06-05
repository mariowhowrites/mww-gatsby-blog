import React from "react"

export default function HeroSection() {
  return (
    <div
      className={`flex flex-col-reverse mt-16`}
      style={{ minHeight: "60vh", paddingBottom: "20vh" }}
    >
      <p
        className={`text-5xl md:text-6xl ml-7 md:ml-25vw md:w-3/5 xl:w-1/2 pr-0 md:pr-64 pt-8 font-heading relative`}
      >
        Words for humans & computers too
      </p>
      <div
        className={`ml-7 md:ml-0 md:w-25vw md:text-right font-bold text-2xl text-gray-500`}
      >
        Mario Vega
      </div>
    </div>
  )
}
