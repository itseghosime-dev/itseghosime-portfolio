import { Highlight, themes, type Language } from "prism-react-renderer";

const languageAliases: Record<string, Language> = {
  javascript: "javascript",
  jsx: "jsx",
  json: "json",
  shell: "bash",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
};

function resolveLanguage(language?: string | null): Language {
  if (!language) return "typescript";
  return languageAliases[language.toLowerCase()] ?? "typescript";
}

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string | null;
}) {
  return (
    <Highlight
      code={code.trimEnd()}
      language={resolveLanguage(language)}
      theme={themes.nightOwl}
    >
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className="m-0 max-h-[36rem] overflow-auto bg-[#101318] py-5 font-mono text-xs leading-6 [tab-size:2]">
          <code className="grid min-w-max">
            {tokens.map((line, lineIndex) => {
              const lineProps = getLineProps({ line });

              return (
                <span
                  {...lineProps}
                  className={`${lineProps.className ?? ""} grid grid-cols-[2.75rem_minmax(0,1fr)] px-4 sm:px-5`}
                  key={lineIndex}
                >
                  <span
                    aria-hidden="true"
                    className="select-none pr-4 text-right text-white/28"
                  >
                    {lineIndex + 1}
                  </span>
                  <span>
                    {line.map((token, tokenIndex) => (
                      <span
                        {...getTokenProps({ token })}
                        key={`${lineIndex}-${tokenIndex}`}
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
  );
}
