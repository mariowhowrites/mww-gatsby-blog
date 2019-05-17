import React from "react"

export default function HeroSection() {
  return (
    <div
      className={`flex flex-col-reverse`}
      style={{ minHeight: "80vh", paddingBottom: "20vh" }}
    >
      <p
        className={`text-5xl md:text-6xl ml-7 md:ml-25vw md:w-1/2 pr-0 md:pr-64 pt-8 font-heading relative`}
      >
        Words for humans & computers too
      </p>
      <div
        style={{ width: "25vw", letterSpacing: "-0.3rem" }}
        className={`ml-7 md:ml-0 md:text-right font-thin text-2xl text-gray-500`}
      >
        ------------------------------
      </div>
    </div>
  )
}
