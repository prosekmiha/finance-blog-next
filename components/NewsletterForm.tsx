"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("subscribers")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("You're already subscribed!");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-semibold text-[#0055a5]">
        You&apos;re in! We&apos;ll notify you when new articles drop.
      </p>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          disabled={status === "loading"}
          className="w-full px-3 py-2 rounded-lg border border-[#c5d8ef] bg-white text-sm focus:outline-none focus:border-[#0055a5] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2 rounded-lg bg-[#0055a5] text-white text-sm font-bold hover:bg-[#004494] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe Free"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-500">{errorMsg}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={status === "loading"}
        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0055a5] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 rounded-xl bg-[#0055a5] text-white text-sm font-bold hover:bg-[#004494] transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-red-500 -mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
