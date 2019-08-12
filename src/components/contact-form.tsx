import React, { useState, FC } from "react"
import axios from "axios"

export const ContactForm: FC = function() {
  let [inquiry, setInquiry] = useState("")
  let [name, setName] = useState("")
  let [email, setEmail] = useState("")
  let [statusMessage, setStatusMessage] = useState("")

  const canSubmit = () => ![name, email, inquiry].includes("")

  function onTextareaInput(event) {
    setInquiry(event.target.value)
  }

  async function onSubmit() {
    const url = "https://server-adsxy68we.now.sh"

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

      setName("")
      setEmail("")
      setInquiry("")
    }

    if (response.data === "failure") {
      setStatusMessage(
        "Egads! Something went wrong. Try again in a second, please."
      )
    }
  }

  return (
    <div className="ml-7 md:w-1/2 md:mx-auto flex flex-col pb-12">
      <h2 className="font-heading text-4xl md:text-6xl my-10 font-heading">
        In a Hurry? Use the Form
      </h2>
      <div className="flex flex-col md:flex-row mb-6 md:ml-7">
        <label
          style={{ width: "10%" }}
          className="font-semibold font-body text-2xl pr-4"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="bg-gray-100 border rounded shadow w-4/5 py-2 pl-2 md:w-full"
          id="name"
          name="name"
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row mb-6 md:ml-7">
        <label
          style={{ width: "10%" }}
          className="font-semibold font-body text-2xl pr-4"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="bg-gray-100 border rounded shadow w-4/5 py-2 pl-2 md:w-full"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row mb-6 md:ml-7">
        <label
          style={{ width: "10%" }}
          className="font-semibold font-body text-2xl pr-4"
          htmlFor="inquiry"
        >
          Inquiry
        </label>
        <textarea
          name="inquiry"
          className="bg-gray-100 border rounded shadow w-4/5 py-2 pl-2 md:w-full"
          rows={4}
          value={inquiry}
          onChange={onTextareaInput}
        />
      </div>
      <div className="font-heading my-2">{statusMessage}</div>
      <button
        className="w-1/2 md:w-1/5 mb-6 button bg-green-600 hover:bg-green-500 trans-button text-white antialiased border-gray-100 border font-bold rounded shadow-lg py-2"
        disabled={!canSubmit()}
        onClick={onSubmit}
      >
        Let's Connect
      </button>
    </div>
  )
}
