import React, { useState } from "react"
import axios from "axios"

import { rhythm } from "../utils/typography"

export default function ContactForm(_props) {
  let [inquiry, setInquiry] = useState("")

  function onTextareaInput(event) {
    inquiry = setInquiry(event.target.value)
  }

  async function onSubmit() {
    const url = "https://api-1pqle3bua.now.sh"

    const response = await axios.post(
      `${url}/sendMessage.js`,
      {
        inquiry: inquiry,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    console.log(response.data)
  }

  return (
    <div>
      <h2 style={{ marginBottom: rhythm(1.5) }}>Contact me</h2>
      <textarea
        onInput={onTextareaInput}
        style={{ marginBottom: rhythm(1.5) }}
      />
      <div dangerouslySetInnerHTML={{ __html: inquiry }} />
      <button
        style={{
          marginBottom: rhythm(3),
          backgroundColor: "blue",
          color: "white",
          borderRadius: rhythm(0.2),
        }}
        onClick={onSubmit}
      >
        Send Inquiry
      </button>
    </div>
  )
}
