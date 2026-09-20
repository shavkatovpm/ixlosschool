import Script from "next/script";

const GA_ID = /^G-[A-Z0-9]{4,20}$/;
const YM_ID = /^\d{5,12}$/;

export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const ym = process.env.NEXT_PUBLIC_YM_ID;
  const gaId = ga && GA_ID.test(ga) ? ga : null;
  const ymId = ym && YM_ID.test(ym) ? ym : null;

  if (!gaId && !ymId) return null;

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
      {ymId ? (
        <>
          <Script id="ym-init" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://mc.yandex.ru/watch/${ymId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          </noscript>
        </>
      ) : null}
    </>
  );
}
