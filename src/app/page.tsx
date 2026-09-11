export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#0b1830] px-6 py-16 text-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#1d3a6e] opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#c9a24b]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* Emblem */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9a24b] bg-[#0b1830] shadow-[0_0_30px_rgba(201,162,75,0.35)]">
          <span className="font-serif text-2xl font-bold tracking-wide text-[#c9a24b]">
            IS
          </span>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a24b]">
          Ixlos School
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Xususiy maktab
        </h1>

        <div className="my-10 flex items-center gap-4">
          <span className="h-px w-10 bg-[#c9a24b]/60" />
          <h2 className="text-4xl font-extrabold tracking-[0.15em] text-[#c9a24b] sm:text-5xl">
            TEZ KUNDA
          </h2>
          <span className="h-px w-10 bg-[#c9a24b]/60" />
        </div>

        <p className="max-w-md text-base leading-7 text-slate-300 sm:text-lg">
          Ixlos School sahifasi ustida ish olib borilmoqda. Tez orada
          maktabimiz haqida to&apos;liq ma&apos;lumot bilan qaytamiz.
        </p>

        <div className="mt-12 flex flex-col items-center gap-2 text-sm text-slate-400">
          <span className="uppercase tracking-widest text-slate-500">
            Bog&apos;lanish uchun
          </span>
          <a
            href="tel:+998000000000"
            className="text-lg font-medium text-white transition-colors hover:text-[#c9a24b]"
          >
            +998 00 000 00 00
          </a>
        </div>
      </main>

      <footer className="relative z-10 mt-16 text-xs text-slate-500">
        © {new Date().getFullYear()} Ixlos School. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
}
