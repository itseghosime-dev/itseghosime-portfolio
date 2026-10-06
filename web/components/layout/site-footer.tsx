import { Container } from "@/components/ui/container";

type SiteFooterProps = {
  footerText?: string;
  siteName: string;
};

export function SiteFooter({ footerText, siteName }: SiteFooterProps) {
  return (
    <footer className="text-ink-muted">
      <Container className="flex flex-col justify-between gap-4 border-t border-black/8 py-12 text-xs sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {siteName}
        </p>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em]">
          {footerText ?? "Built with intent · Accessible by default"}
        </p>
      </Container>
    </footer>
  );
}
