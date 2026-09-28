"use client";

import { FormEvent, useState } from "react";
import styles from "./NewsletterForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We could not add you to the community."
        );
      }

      setStatus("success");
      setMessage(
        "Welcome to God's community. We're glad you're here."
      );

      setEmail("");
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <label
          className={styles.label}
          htmlFor="newsletter-email"
        >
          Join God&apos;s community
        </label>

        <div className={styles.control}>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            disabled={status === "loading"}
            required
          />

          <button
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Joining..."
              : "Join the community"}

            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`${styles.message} ${
            status === "error"
              ? styles.error
              : ""
          }`}
          role={
            status === "error"
              ? "alert"
              : "status"
          }
        >
          {message}
        </p>
      )}

      <p className={styles.note}>
        Stay connected with Trust Church and hear about ways to serve,
        grow, and get involved.
      </p>
    </div>
  );
}