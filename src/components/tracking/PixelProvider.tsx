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

/** Store pages: runs in <head> before React. It creates the fbq/ttq queues at once (so the ViewContent that a product
 *  page fires during hydration can never be dropped), writes _fbp/_fbc like fbevents.js would (so an fbclid survives a
 *  client-side navigation), and downloads the two ~250 KB ad libraries only after the first interaction or 3.5 s after
 *  load - they no longer compete with the product photo for the phone's bandwidth and CPU. Queued events flush on load.
 *  The PageView itself is sent at once from here (1 small request, ~0 ms) instead of waiting in the queue for the
 *  250 KB library: visitors who left before the library loaded were never counted, so Meta's "link click -> landing
 *  page view" rate showed ~50% while many of them had arrived. It is the only Meta PageView (trackPageView skips it).
 *  Bots/headless browsers are skipped here (fbevents' own BotBlocking would drop them; for them trackPageView falls back).
 *  autoConfig off: Meta's "automatic events" fired a SECOND Purchase on /thank-you (cs_est, no value, own event id -
 *  never deduplicated) and a SubscribedButtonClick on every button. All events we need are sent explicitly. */
export const PIXEL_BOOT = `!function(w,d){
var now=Date.now();function ck(n){var m=d.cookie.match('(?:^|; )'+n+'=([^;]+)');return m?m[1]:null}
function sc(n,v){d.cookie=n+'='+v+';path=/;max-age=7776000;SameSite=Lax'}
if(!ck('_fbp'))sc('_fbp','fb.1.'+now+'.'+Math.floor(Math.random()*2147483647));
var cl=new URLSearchParams(location.search).get('fbclid'),fbc=ck('_fbc');
if(cl&&(!fbc||fbc.split('.').pop()!==cl))sc('_fbc','fb.1.'+now+'.'+cl);
var pq=new URLSearchParams({id:'${META_PIXEL_ID}',ev:'PageView',dl:location.href,rl:d.referrer,ts:String(now),fbp:ck('_fbp')||'',
 eid:'pv.'+now+'.'+Math.random().toString(36).slice(2,10)});if(ck('_fbc'))pq.set('fbc',ck('_fbc'));
var pu='https://www.facebook.com/tr?'+pq.toString();
if(!navigator.webdriver&&!/bot|crawl|spider|slurp|headless|lighthouse|facebookexternalhit|preview/i.test(navigator.userAgent)){
 try{fetch(pu,{mode:'no-cors',keepalive:true,credentials:'include'})}catch(e){(new Image).src=pu}w.__fbPV=1}
if(!w.fbq){var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!w._fbq)w._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];n('set','autoConfig',false,'${META_PIXEL_ID}');n('init','${META_PIXEL_ID}')}
var tq=w.ttq=w.ttq||[];tq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
tq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<tq.methods.length;i++)tq.setAndDefer(tq,tq.methods[i]);
var go=0;function load(){if(go)return;go=1;
 var s=d.createElement('script');s.async=1;s.src='https://connect.facebook.net/en_US/fbevents.js';d.head.appendChild(s);
 w.TiktokAnalyticsObject='ttq';tq._i=tq._i||{};tq._i['${TIKTOK_PIXEL_ID}']=[];tq._i['${TIKTOK_PIXEL_ID}']._u='https://analytics.tiktok.com/i18n/pixel/events.js';
 tq._t=tq._t||{};tq._t['${TIKTOK_PIXEL_ID}']=+new Date;tq._o=tq._o||{};tq._o['${TIKTOK_PIXEL_ID}']={};
 tq.instance=function(t){for(var e=tq._i[t]||[],k=0;k<tq.methods.length;k++)tq.setAndDefer(e,tq.methods[k]);return e};
 var t=d.createElement('script');t.async=1;t.src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${TIKTOK_PIXEL_ID}&lib=ttq';d.head.appendChild(t)}
['pointerdown','touchstart','scroll','keydown','mousemove'].forEach(function(e){w.addEventListener(e,load,{once:!0,passive:!0})});
w.addEventListener('load',function(){setTimeout(load,6000)});
tq.page()}(window,document);`;

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
      {/* Meta + TikTok for store pages: queues and deferred loader are in <head>, see PIXEL_BOOT */}

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
