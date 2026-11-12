"use client";

import { ParticleText } from "@/components/particle-intro";
import { useEffect, useRef, useState } from "react";

export function EmailDisplay({ email, particle = false }: { email: string; particle?: boolean }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notification, setNotification] = useState<"copied" | "failed" | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyEmail() {
    if (!email) return;
    let success = false;

    try {
      await navigator.clipboard.writeText(email);
      success = true;
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      try {
        success = document.execCommand("copy");
      } finally {
        input.remove();
      }
    }

    setNotification(success ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotification(null), 2100);
  }

  return (
    <div className="email-stage" data-reveal="email" data-signal="section">
      <button
        className="email-stage__button"
        type="button"
        onClick={copyEmail}
        disabled={!email}
        aria-label={email ? `Copy ${email}` : "Email not configured"}
      >
        <span className="email-stage__text" data-text={email || "your@email.com"}>
          {particle ? <ParticleText text={email || "your@email.com"} /> : email || "your@email.com"}
        </span>
      </button>
      <div className={`copy-toast${notification ? " copy-toast--visible" : ""}`} role="status" aria-live="polite">
        {notification === "copied" ? "Copied" : notification === "failed" ? "Could not copy" : ""}
      </div>
    </div>
  );
}
