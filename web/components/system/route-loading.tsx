import { BrandMark } from "@/components/ui/brand-mark";
import { Container } from "@/components/ui/container";

type LoadingVariant = "archive" | "detail" | "home" | "standard";

function Pulse({ className }: { className: string }) {
  return <span aria-hidden="true" className={`system-skeleton block ${className}`} />;
}

function LoadingHeader() {
  const navigationWidths = ["w-10", "w-14", "w-8", "w-12", "w-10"];

  return (
    <header className="h-20 border-b border-black/[0.06] bg-background">
      <Container className="flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandMark className="w-[1.125rem]" />
          <span className="text-base font-bold">ITSEGHOSIME</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {navigationWidths.map((width, index) => (
            <Pulse className={`h-3 ${width}`} key={`${width}-${index}`} />
          ))}
        </div>
        <Pulse className="h-10 w-28" />
      </Container>
    </header>
  );
}

function ArchiveSkeleton() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-12">
        <div className="grid gap-5 border-b border-black/10 pb-10">
          <Pulse className="h-3 w-48" />
          <Pulse className="h-12 w-full max-w-3xl" />
          <Pulse className="h-5 w-full max-w-2xl" />
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/10 pb-5">
          <Pulse className="h-10 w-20" />
          <Pulse className="h-10 w-28" />
          <Pulse className="h-10 w-24" />
          <Pulse className="h-10 w-32" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[0, 1].map((item) => (
            <article className="grid gap-5 border border-black/10 bg-surface p-5" key={item}>
              <Pulse className="aspect-[16/10] w-full" />
              <div className="grid gap-3">
                <Pulse className="h-7 w-2/3" />
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-4/5" />
              </div>
              <div className="flex gap-2 border-t border-black/10 pt-4">
                <Pulse className="h-6 w-20" />
                <Pulse className="h-6 w-16" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </Container>
  );
}

function DetailSkeleton() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-[73rem] gap-10">
        <Pulse className="h-3 w-32" />
        <div className="grid gap-10 border-t border-black/10 pt-10 lg:grid-cols-12">
          <aside className="hidden gap-4 lg:col-span-3 lg:grid">
            <Pulse className="h-3 w-28" />
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-4/5" />
            <Pulse className="h-10 w-3/4" />
          </aside>
          <article className="grid min-w-0 gap-8 lg:col-span-9">
            <div className="grid gap-5">
              <Pulse className="h-3 w-48" />
              <Pulse className="h-14 w-full" />
              <Pulse className="h-14 w-4/5" />
              <Pulse className="h-6 w-3/4" />
            </div>
            <Pulse className="aspect-[16/10] w-full" />
            <div className="grid gap-4">
              <Pulse className="h-5 w-full" />
              <Pulse className="h-5 w-full" />
              <Pulse className="h-5 w-5/6" />
            </div>
          </article>
        </div>
      </div>
    </Container>
  );
}

function StandardSkeleton({ home = false }: { home?: boolean }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="grid min-h-[34rem] content-center gap-8">
        <Pulse className="h-3 w-44" />
        <div className="grid gap-4">
          <Pulse className={`${home ? "h-20" : "h-14"} w-full max-w-4xl`} />
          <Pulse className={`${home ? "h-20 w-4/5" : "h-14 w-3/4"} max-w-4xl`} />
        </div>
        <div className="grid max-w-2xl gap-3">
          <Pulse className="h-5 w-full" />
          <Pulse className="h-5 w-5/6" />
        </div>
        <div className="flex gap-3">
          <Pulse className="h-12 w-36" />
          <Pulse className="h-12 w-32" />
        </div>
      </div>
    </Container>
  );
}

export function RouteLoading({ variant }: { variant: LoadingVariant }) {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <LoadingHeader />
      <main id="main-content">
        {variant === "archive" ? <ArchiveSkeleton /> : null}
        {variant === "detail" ? <DetailSkeleton /> : null}
        {variant === "home" ? <StandardSkeleton home /> : null}
        {variant === "standard" ? <StandardSkeleton /> : null}
      </main>
      <p className="sr-only" role="status">
        Loading page content…
      </p>
    </div>
  );
}
