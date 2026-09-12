import Image from "next/image";
import EntranceAnimation from "./entrance-animation";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1830] px-6 py-12 text-white">
      <EntranceAnimation />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#1d3a6e] opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#c9a24b]/20 blur-3xl" />
      </div>

      <main className="relative z-10 flex w-full flex-col items-center text-center">
        <Image
          src="/brand/animated/loader-04-scan-diagonal.svg"
          alt="Ixlos School yuklanmoqda"
          width={3601}
          height={3601}
          className="h-auto w-[min(54vw,520px)] max-sm:w-[min(82vw,420px)]"
          priority
          unoptimized
        />

        <p className="-mt-5 max-w-lg text-base leading-7 text-white opacity-30 sm:text-lg">
          Ixlos School sahifasi ustida ish olib borilmoqda. Tez orada
          maktabimiz haqida to&apos;liq ma&apos;lumot bilan qaytamiz.
        </p>
      </main>
    </div>
  );
}
