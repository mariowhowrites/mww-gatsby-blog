import React, { useState } from "react"
import axios from "axios"

import { rhythm } from "../utils/typography"

export default function ContactForm(_props) {
  let [inquiry, setInquiry] = useState("")
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [statusMessage, setStatusMessage] = useState("")

  function onTextareaInput(event) {
    setInquiry(event.target.value)
  }

  async function onSubmit() {
    const url = "https://api-1pqle3bua.now.sh"

    const response = await axios.post(
      `${url}/sendMessage.js`,
      {
        name,
        email,
        inquiry,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (response.data === "success") {
      setStatusMessage("Success! I'll be in touch.")
    }

    if (response.data === "failure") {
      setStatusMessage(
        "Egads! Something went wrong. Try again in a second, please."
      )
    }
  }

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
      }}
    >
      <h2 style={{ marginBottom: rhythm(1.5) }}>Contact me</h2>
      <span style={{ marginBottom: rhythm(1.0) }}>
        <label htmlFor="name" style={{ marginRight: rhythm(0.5) }}>
          Name
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onInput={event => setName(event.target.value)}
        />
      </span>
      <span style={{ marginBottom: rhythm(1.0) }}>
        <label htmlFor="email" style={{ marginRight: rhythm(0.5) }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={name}
          onInput={event => setName(event.target.value)}
        />
      </span>
      <label htmlFor="inquiry">Inquiry</label>
      <textarea
        name="inquiry"
        onInput={onTextareaInput}
        style={{ marginBottom: rhythm(1.5) }}
      />
      <div dangerouslySetInnerHTML={{ __html: statusMessage }} />
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
