"use client";

import { Check, Copy } from "lucide-react";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { useState } from "react";

const languageAliases: Record<string, Language> = {
  css: "css",
  html: "markup",
  javascript: "javascript",
  jsx: "jsx",
  json: "json",
  shell: "bash",
  tsx: "tsx",
  typescript: "typescript",
};

function resolveLanguage(language?: string | null): Language {
  if (!language) return "typescript";
  return languageAliases[language.toLowerCase()] ?? "typescript";
}

export function NoteCodePanel({
  caption,
  code,
  filename,
  language,
}: {
  caption?: string | null;
  code: string;
  filename?: string | null;
  language?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <figure className="my-12 overflow-hidden border border-black/10 bg-[#101318] shadow-[0_20px_55px_-38px_rgba(15,18,24,0.72)] sm:my-14">
      <div className="flex min-h-12 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-5">
        <div className="min-w-0 font-mono text-[0.6875rem] tracking-[0.02em] text-white/58">
          <span className="text-white/36">CODE / </span>
          <span className="truncate text-white/76">
            {filename || `example.${language === "tsx" ? "tsx" : "ts"}`}
          </span>
        </div>
        <button
          className="inline-flex min-h-10 shrink-0 items-center gap-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-white/64 transition-colors hover:text-white"
          onClick={handleCopy}
          type="button"
        >
          {copied ? <Check aria-hidden="true" size={13} /> : <Copy aria-hidden="true" size={13} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>

      <Highlight
        code={code.trimEnd()}
        language={resolveLanguage(language)}
        theme={themes.nightOwl}
      >
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="m-0 max-h-[38rem] overflow-auto py-6 font-mono text-xs leading-6 [tab-size:2]">
            <code className="grid min-w-max">
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line });
                return (
                  <span
                    key={`line-${lineIndex}`}
                    {...lineProps}
                    className={`${lineProps.className ?? ""} grid grid-cols-[2.75rem_minmax(0,1fr)] px-4 sm:px-5`}
                  >
                    <span aria-hidden="true" className="select-none pr-4 text-right text-white/24">
                      {lineIndex + 1}
                    </span>
                    <span>
                      {line.map((token, tokenIndex) => (
                        <span
                          key={`token-${lineIndex}-${tokenIndex}`}
                          {...getTokenProps({ token })}
                        />
                      ))}
                    </span>
                  </span>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>

      {caption ? (
        <figcaption className="border-t border-white/10 px-4 py-4 text-xs leading-5 text-white/54 sm:px-5">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
