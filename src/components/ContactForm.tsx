"use client";

import { useState, type FormEvent } from "react";

/**
 * "Send a Message" form. This is a static site with no backend, so instead
 * of pretending to submit somewhere (and silently failing), it builds a
 * pre-filled mailto: link from what you typed and hands off to your mail
 * client — a real message actually gets sent, just through your own email.
 */
export default function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const body = `${message}\n\n— ${name || "Someone from your portfolio"}${
      fromEmail ? ` (${fromEmail})` : ""
    }`;
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject || "Hello from your portfolio"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  const inputClass =
    "w-full rounded-xl border border-hairline/15 bg-ink px-4 py-2.5 text-sm text-paper placeholder:text-paper/55 transition-colors focus:border-accent/50 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm text-paper/78">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm text-paper/78">
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm text-paper/78">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Let's work together"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm text-paper/78">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message here..."
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full gradient-bg px-6 py-3 text-base font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 3 3 10.5l7.5 3L13.5 21 21 3Z" />
        </svg>
        Send Message
      </button>
      <p className="text-xs text-paper/55">
        Opens your email app with this pre-filled — nothing is stored or sent from this page directly.
      </p>
    </form>
  );
}
