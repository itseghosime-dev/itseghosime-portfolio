"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

export function AutonomousMicroFormSandbox() {
  const [value, setValue] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInputEmpty = value.trim() === "";
  const isValid = !isInputEmpty && emailRegex.test(value);

  function handleQuickFill() {
    setValue("valid@domain.dev");
  }

  return (
    <div className="flex flex-col justify-between border border-[#d5ded6] bg-[#edf3ee] p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between font-mono text-xs text-[#425945]">
        <span>LIVE INTERACTIVE TEST BENCH</span>
        <span className="border border-[#ccd8ce] bg-white/70 px-2 py-0.5 text-[11px]">
          TRY: valid@domain.dev
        </span>
      </div>

      <div className="my-4 mx-auto w-full max-w-md space-y-4">
        <label
          className="block font-mono text-xs uppercase tracking-wider text-[#384e3a]"
          htmlFor="lab-micro-token-input"
        >
          Recipient Access Token
        </label>
        <div className="relative flex items-center">
          <input
            className={`w-full bg-white px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:outline-none transition-all ${
              isInputEmpty
                ? "border border-[#c1d0c3] focus:border-accent focus:ring-accent/30"
                : isValid
                  ? "border border-emerald-600 focus:border-emerald-600 focus:ring-emerald-500/30"
                  : "border border-red-500 focus:border-red-500 focus:ring-red-500/30"
            }`}
            id="lab-micro-token-input"
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type an email address..."
            type="text"
            value={value}
          />
          <div className="absolute right-3 flex items-center">
            {isInputEmpty ? (
              <HelpCircle
                aria-hidden="true"
                className="text-ink-muted"
                size={20}
              />
            ) : isValid ? (
              <CheckCircle2
                aria-hidden="true"
                className="text-emerald-600"
                size={20}
              />
            ) : (
              <XCircle aria-hidden="true" className="text-red-500" size={20} />
            )}
          </div>
        </div>

        <div className="flex min-h-[22px] items-center justify-between font-mono text-xs">
          <div
            className={
              isInputEmpty
                ? "text-[#596f5b]"
                : isValid
                  ? "font-semibold text-emerald-700"
                  : "font-medium text-red-600"
            }
          >
            {isInputEmpty
              ? "Status: Waiting for input..."
              : isValid
                ? "Status: ✓ Token verified & ready"
                : "Status: Invalid syntax (domain expected)"}
          </div>
          <button
            className="cursor-pointer font-mono text-xs text-accent underline hover:text-ink"
            onClick={handleQuickFill}
            type="button"
          >
            Fill Valid sample
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#d8e3d9] pt-4 font-mono text-[11px] text-[#5b725d]">
        <span>ASYNC TOKEN DEBOUNCE: 180ms</span>
        <span className="font-semibold text-emerald-700">OPTIMISTIC OK</span>
      </div>
    </div>
  );
}
