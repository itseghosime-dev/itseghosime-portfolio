"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

type FormState = "default" | "error" | "submitting" | "success" | "validation";

type ContactFields = {
  category: string;
  company: string;
  email: string;
  fullName: string;
  message: string;
  website: string;
};

const initialFields: ContactFields = {
  category: "Job opportunity",
  company: "",
  email: "",
  fullName: "",
  message: "",
  website: "",
};

const categories = [
  "Job opportunity",
  "Freelance / Contract",
  "Collaboration",
  "Project",
  "Other",
];

function hasValidFields(fields: ContactFields) {
  return (
    fields.fullName.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(fields.email.trim()) &&
    fields.message.trim().length >= 20
  );
}

type ContactOutcomeProps = {
  email: string;
  onReset: () => void;
  state: "error" | "success";
};

function ContactOutcome({ email, onReset, state }: ContactOutcomeProps) {
  const isSuccess = state === "success";

  return (
    <div
      className={`grid min-h-72 content-center border p-7 sm:p-10 ${
        isSuccess
          ? "border-[#65bf91]/45 bg-[#effaf4]"
          : "border-[var(--error)]/25 bg-[var(--error-soft)]/35"
      }`}
      aria-live={isSuccess ? "polite" : "assertive"}
      role={isSuccess ? "status" : "alert"}
    >
      <div className="max-w-xl">
        <div className="flex flex-col gap-2">
          <span
            className={`grid size-10 place-items-center rounded-full border text-lg ${
              isSuccess
                ? "border-[#65bf91]/40 bg-[#d9f5e6] text-[#167548]"
                : "border-[var(--error)]/25 bg-white/55 text-[var(--error)]"
            }`}
            aria-hidden="true"
          >
            {isSuccess ? (
              <Check aria-hidden="true" size={20} strokeWidth={2} />
            ) : (
              <CircleAlert aria-hidden="true" size={20} strokeWidth={1.8} />
            )}
          </span>
          <h3 className="font-serif text-3xl leading-tight">
            {isSuccess ? "Message sent." : "That didn’t go through."}
          </h3>
        </div>
        <p className="mt-3 max-w-lg text-sm leading-6 text-ink-soft">
          {isSuccess
            ? "Thanks for reaching out. A confirmation is in your inbox, and I’ll review your note carefully."
            : "The delivery service couldn’t complete your message. Try again, or reach me directly by email."}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {isSuccess ? (
            <Link
              className="inline-flex min-h-11 items-center justify-center bg-ink px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-accent"
              href="/work"
            >
              Back to work{" "}
              <ArrowRight
                aria-hidden="true"
                className="ml-2"
                size={16}
                strokeWidth={1.8}
              />
            </Link>
          ) : (
            <button
              className="min-h-11 cursor-pointer bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
              type="button"
              onClick={onReset}
            >
              Try again
            </button>
          )}
          {isSuccess ? (
            <button
              className="min-h-11 cursor-pointer border border-black/20 bg-transparent px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-white/60"
              type="button"
              onClick={onReset}
            >
              Send another message
            </button>
          ) : (
            <a
              className="inline-flex min-h-11 items-center justify-center border border-black/20 bg-transparent px-5 py-2.5 text-sm font-semibold no-underline transition-colors hover:border-ink hover:bg-white/60"
              href={`mailto:${email}`}
            >
              Send email{" "}
              <ArrowUpRight
                aria-hidden="true"
                className="ml-2"
                size={16}
                strokeWidth={1.8}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

type ContactFormProps = {
  email: string;
};

export function ContactForm({ email }: ContactFormProps) {
  const formId = useId();
  const [fields, setFields] = useState(initialFields);
  const [state, setState] = useState<FormState>("default");

  function updateField<Key extends keyof ContactFields>(
    key: Key,
    value: ContactFields[Key],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
    if (state !== "default") {
      setState("default");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasValidFields(fields)) {
      setState("validation");
      return;
    }

    setState("submitting");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(fields),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setState("success");
      setFields(initialFields);
    } catch {
      setState("error");
    }
  }

  const validationVisible = state === "validation";
  const isSubmitting = state === "submitting";

  return (
    <section id="contact-form" aria-labelledby={`${formId}-title`}>
      <div className="mb-8 flex flex-col gap-3 border-b border-black/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <h2
          className="font-serif text-3xl leading-tight"
          id={`${formId}-title`}
        >
          Send a message
        </h2>
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-muted">
          Fields marked * are required
        </span>
      </div>

      {state === "success" || state === "error" ? (
        <ContactOutcome
          email={email}
          state={state}
          onReset={() => setState("default")}
        />
      ) : (
        <form className="grid gap-7" noValidate onSubmit={submit}>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink">
              Project classification <span className="text-accent">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  className={`cursor-pointer border px-3 py-2 text-xs transition-colors ${
                    fields.category === category
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-black/15 bg-surface text-ink-soft hover:border-ink"
                  }`}
                  key={category}
                >
                  <input
                    className="sr-only"
                    checked={fields.category === category}
                    disabled={isSubmitting}
                    name="category"
                    type="radio"
                    value={category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-2">
            <label
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em]"
              htmlFor={`${formId}-name`}
            >
              Full name <span className="text-accent">*</span>
            </label>
            <input
              className={`min-h-12 border bg-surface px-4 outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--focus-ring)] ${
                validationVisible && fields.fullName.trim().length < 2
                  ? "border-[var(--error)]"
                  : "border-black/15"
              }`}
              id={`${formId}-name`}
              name="fullName"
              placeholder="Your full name"
              autoComplete="name"
              disabled={isSubmitting}
              value={fields.fullName}
              aria-describedby={
                validationVisible ? `${formId}-name-error` : undefined
              }
              aria-invalid={
                validationVisible && fields.fullName.trim().length < 2
              }
              onChange={(event) => updateField("fullName", event.target.value)}
            />
            {validationVisible && fields.fullName.trim().length < 2 ? (
              <p
                className="text-xs text-[var(--error)]"
                id={`${formId}-name-error`}
              >
                Enter at least two characters.
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em]"
              htmlFor={`${formId}-email`}
            >
              Email address <span className="text-accent">*</span>
            </label>
            <input
              className={`min-h-12 border bg-surface px-4 outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--focus-ring)] ${
                validationVisible && !/^\S+@\S+\.\S+$/.test(fields.email.trim())
                  ? "border-[var(--error)]"
                  : "border-black/15"
              }`}
              id={`${formId}-email`}
              name="email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              value={fields.email}
              aria-describedby={
                validationVisible ? `${formId}-email-error` : undefined
              }
              aria-invalid={
                validationVisible && !/^\S+@\S+\.\S+$/.test(fields.email.trim())
              }
              onChange={(event) => updateField("email", event.target.value)}
            />
            {validationVisible &&
            !/^\S+@\S+\.\S+$/.test(fields.email.trim()) ? (
              <p
                className="text-xs text-[var(--error)]"
                id={`${formId}-email-error`}
              >
                Enter a valid email address.
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <label
                className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em]"
                htmlFor={`${formId}-company`}
              >
                Organization / company
              </label>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-muted">
                Optional
              </span>
            </div>
            <input
              className="min-h-12 border border-black/15 bg-surface px-4 outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--focus-ring)]"
              id={`${formId}-company`}
              name="company"
              placeholder="Studio, startup, or company name"
              autoComplete="organization"
              disabled={isSubmitting}
              value={fields.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em]"
              htmlFor={`${formId}-message`}
            >
              Message <span className="text-accent">*</span>
            </label>
            <textarea
              className={`min-h-36 resize-y border bg-surface px-4 py-3 outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--focus-ring)] ${
                validationVisible && fields.message.trim().length < 20
                  ? "border-[var(--error)]"
                  : "border-black/15"
              }`}
              id={`${formId}-message`}
              name="message"
              placeholder="Tell me about the role, product, timeline, or scope…"
              disabled={isSubmitting}
              value={fields.message}
              aria-describedby={
                validationVisible ? `${formId}-message-error` : undefined
              }
              aria-invalid={
                validationVisible && fields.message.trim().length < 20
              }
              onChange={(event) => updateField("message", event.target.value)}
            />
            {validationVisible && fields.message.trim().length < 20 ? (
              <p
                className="text-xs text-[var(--error)]"
                id={`${formId}-message-error`}
              >
                Add at least 20 characters so I have enough context.
              </p>
            ) : null}
          </div>

          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input
              id={`${formId}-website`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={fields.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70 sm:min-w-40"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                <>
                  Send dispatch
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
                </>
              )}
            </button>
            <p className="flex items-start gap-2 text-xs leading-5 text-ink-muted">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-accent"
                size={14}
                strokeWidth={1.8}
              />
              Protected with a hidden anti-spam field and server-side
              validation.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
