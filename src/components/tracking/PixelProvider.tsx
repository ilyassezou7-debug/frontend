"use client";

import { useEffect, type ReactNode } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { trackPageView, saveLandingUrl } from "@/lib/tracking";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "800384379801833";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "D8506I3C77U73K7PGR40";
const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

/** Speed-critical ad bridge pages (German Amazon books): no TikTok, and instead of Meta's 250 KB library (≈2.8 s of
 *  phone CPU) a 1 KB sender posts events straight to facebook.com/tr. It creates _fbp/_fbc exactly like fbevents.js
 *  (incl. fbclid from the ad click), so attribution keeps working; keepalive requests survive the redirect to Amazon. */
const DEFERRED_PATHS = ["/lp/bestie-duell"];

interface PixelProviderProps {
  children: ReactNode;
}

export default function PixelProvider({ children }: PixelProviderProps) {
  const pathname = usePathname() || "";
  const deferred = DEFERRED_PATHS.some((p) => pathname.startsWith(p));
  useEffect(() => {
    saveLandingUrl();
    trackPageView();
  }, []);

  return (
    <>
      {/* Meta Pixel */}
      {META_PIXEL_ID && deferred && (
        <Script
          id="meta-pixel-lite"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b){if(f.fbq)return;var id='${META_PIXEL_ID}',now=Date.now();
              function ck(n){var m=b.cookie.match('(?:^|; )'+n+'=([^;]+)');return m?m[1]:null}
              function set(n,v){b.cookie=n+'='+v+';path=/;max-age=7776000;SameSite=Lax'}
              var fbp=ck('_fbp');if(!fbp){fbp='fb.1.'+now+'.'+Math.floor(Math.random()*2147483647);set('_fbp',fbp)}
              var cl=new URLSearchParams(location.search).get('fbclid'),fbc=ck('_fbc');
              if(cl&&(!fbc||fbc.split('.').pop()!==cl)){fbc='fb.1.'+now+'.'+cl;set('_fbc',fbc)}
              var pv=0;f.fbq=function(cmd,ev,cd,opt){if(cmd!=='track')return;if(ev==='PageView'){if(pv)return;pv=1}
                var q=new URLSearchParams({id:id,ev:ev,dl:location.href,rl:b.referrer,ts:String(Date.now()),fbp:fbp});
                if(fbc)q.set('fbc',fbc);if(opt&&opt.eventID)q.set('eid',opt.eventID);
                if(cd)for(var k in cd){var v=cd[k];q.set('cd['+k+']',typeof v==='object'?JSON.stringify(v):String(v))}
                var u='https://www.facebook.com/tr?'+q.toString();
                try{fetch(u,{mode:'no-cors',keepalive:true,credentials:'include'})}catch(e){new Image().src=u}};
              f.fbq.lite=1;f.fbq('track','PageView')}(window,document);
            `,
          }}
        />
      )}
      {META_PIXEL_ID && !deferred && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* TikTok Pixel */}
      {TIKTOK_PIXEL_ID && !deferred && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
                var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* Snapchat Pixel — lowest priority, deferred until browser is idle */}
      {SNAP_PIXEL_ID && (
        <Script
          id="snap-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '${SNAP_PIXEL_ID}');
              snaptr('track', 'PAGE_VIEW');
            `,
          }}
        />
      )}

      {children}
    </>
  );
}
