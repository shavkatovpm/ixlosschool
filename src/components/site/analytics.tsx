import Script from "next/script";
import { GA_ID_RE, YM_ID_RE, getIntegrations } from "@/lib/integrations";

export function Analytics() {
  const { gaId: ga, ymId: ym } = getIntegrations();
  const gaId = GA_ID_RE.test(ga) ? ga : null;
  const ymId = YM_ID_RE.test(ym) ? ym : null;

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
            {`window.ixlosYmId=${ymId};(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
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
