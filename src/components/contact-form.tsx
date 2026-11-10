"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");
    const data = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");
      form.reset();
      setStatus("sent");
      setMessage("Thanks! Your message has been sent.");
    } catch {
      setStatus("error");
      setMessage("Could not send your message. Please try again or contact me by email.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <input type="hidden" name="access_key" value="4a5b602b-5d74-4cdb-becc-4bb400b026d3" />
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
      <div className="contact-form__intro">
        <span className="contact-form__eyebrow">Contact / 01</span>
        <h1>Let’s<br />talk<span>.</span></h1>
        <p>Have a project in mind? Tell me about it.</p>
        <a href="#contact-email">Or reach me by email <span aria-hidden="true">↓</span></a>
      </div>
      <div className="contact-form__fields">
      <label><span>01 / Name</span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
      <label><span>02 / Email</span><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
      <label><span>03 / Message</span><textarea name="message" rows={4} placeholder="Tell me about your project" required /></label>
      <p className="contact-form__privacy">Your details are processed to answer your enquiry. See the <a href={`${process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? ""}/datenschutz/`}>privacy policy</a>.</p>
      <button type="submit" disabled={status === "sending"}>
        <span>{status === "sending" ? "Sending…" : "Send message"}</span><span aria-hidden="true">↗</span>
      </button>
      <p className="contact-form__status" role="status" aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
