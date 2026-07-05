"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, wire this to an email service
    setSubmitted(true);
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-medium mb-3">Get in Touch</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-6">Contact Us</h2>
            <p className="text-stone-600 leading-relaxed mb-10">
              Whether you&apos;re looking for a specific piece, want to learn about a jewellery era, or need help with an order — our team of experts is here to assist you.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: "📍",
                  title: "Visit Us",
                  lines: ["12 Heritage Lane, Kala Ghoda", "Mumbai, Maharashtra 400001"],
                },
                {
                  icon: "📞",
                  title: "Call Us",
                  lines: ["+91 98765 43210", "Mon–Sat: 10am – 7pm IST"],
                },
                {
                  icon: "✉️",
                  title: "Email Us",
                  lines: ["hello@jewelsantique.com", "We reply within 24 hours"],
                },
              ].map((c) => (
                <div key={c.title} className="flex gap-4">
                  <span className="text-xl mt-0.5">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{c.title}</p>
                    {c.lines.map((l) => (
                      <p key={l} className="text-stone-600 text-sm">{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2">Thank You!</h3>
                <p className="text-stone-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you're looking for..."
                    rows={5}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-800 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
