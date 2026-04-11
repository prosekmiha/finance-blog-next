"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
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
        // unique violation — already subscribed
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
      <p className="text-sm font-semibold text-primary">
        You&apos;re in! 🎉 We&apos;ll notify you when new articles drop.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={status === "loading"}
        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-xs text-red-500 text-center sm:text-left -mt-1">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
