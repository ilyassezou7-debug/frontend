import type { Metadata, Viewport } from "next";

/**
 * Root layout for the German Amazon bridge pages (route group "(bridge)").
 * Deliberately separate from the store layout: no global stylesheet, no Arabic fonts, no store providers, no TikTok.
 * Everything the first screen needs is inline, so nothing blocks the first paint:
 *   - ~4 KB of CSS in a <style> tag, one self-hosted font file (preloaded, font-display: swap)
 *   - a ~1 KB Meta sender instead of fbevents.js: PageView on load, ViewContent, and InitiateCheckout on every
 *     a[data-amz] click, posted to facebook.com/tr with keepalive (survives the redirect to Amazon). It creates
 *     _fbp/_fbc exactly like fbevents.js, incl. the fbclid of the ad click, so ad attribution keeps working.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "800384379801833";

export const metadata: Metadata = {
  metadataBase: new URL("https://atlaspure.shop"),
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#FFFBFD" };

const CSS = `
@font-face{font-family:Nunito;src:url(/fonts/nunito-latin-var.woff2) format("woff2");font-weight:700 900;font-display:swap}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:#F4ECF2;color:#2A1B3D;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
a{color:inherit}
.wrap{max-width:540px;margin:0 auto;background:#FFFBFD;box-shadow:0 0 60px rgba(42,27,61,.10)}
.nu{font-family:Nunito,system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
.blk{display:block}
.pages{padding:40px 20px;background:#F7F1FA}
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#19A7A5;text-align:center}
.h2{font-family:Nunito,system-ui,sans-serif;font-weight:900;font-size:30px;line-height:1.15;text-align:center;margin-top:4px;text-wrap:balance}
.spread{margin-top:24px;background:#fff;border-radius:16px;padding:8px;border:1px solid #EDE0F1}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.spread img{border-radius:6px}
.cap{text-align:center;font-size:12px;color:#7A6A86;padding:8px 0 4px}
.cards{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{background:#fff;border-radius:12px;overflow:hidden;border:1px solid #EDE0F1}
.card img{border-bottom:1px solid #EDE0F1}
.card figcaption{padding:12px}
.card b{display:block;font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:14px;line-height:1.2}
.card span{display:block;font-size:12px;color:#4B3A5C;margin-top:4px;line-height:1.35}
.row{padding:0 20px 40px;display:flex;justify-content:center}
.row.dark{background:#2A1B3D;padding:32px 20px}
.btn{display:flex;width:100%;max-width:460px;white-space:nowrap;align-items:center;justify-content:center;gap:12px;border-radius:999px;background:#E8356D;color:#fff;font-family:Nunito,system-ui,sans-serif;font-weight:800;font-size:17px;padding:16px 20px;text-decoration:none;box-shadow:0 10px 24px rgba(232,53,109,.35)}
.btn:hover{background:#D12A60}
.btn i{font-style:normal;border-radius:999px;background:rgba(255,255,255,.2);padding:4px 12px;font-size:16px}
.btn:focus-visible,.blk:focus-visible{outline:4px solid #2A1B3D;outline-offset:2px}
.pulse{animation:bdp 2.4s ease-in-out infinite}
@keyframes bdp{50%{transform:scale(1.025)}}
@media (prefers-reduced-motion:reduce){.pulse{animation:none}}
.faq{padding:40px 20px}
.faq details{border:1px solid #EDE0F1;background:#fff;border-radius:16px;padding:0 16px;margin-top:12px}
.faq summary{cursor:pointer;list-style:none;padding:16px 0;display:flex;justify-content:space-between;align-items:center;gap:16px;font-weight:700}
.faq summary::-webkit-details-marker{display:none}
.faq summary span{color:#E8356D;font-size:24px;line-height:1;transition:transform .2s}
.faq details[open] summary span{transform:rotate(45deg)}
.faq p{padding-bottom:16px;color:#4B3A5C;font-size:14px;line-height:1.6}
.foot{padding:24px 20px;text-align:center;font-size:12px;color:#7A6A86;border-top:1px solid #F2E4EC}
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:50;background:#fff;border-top:1px solid #F2E4EC;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px))}
.sticky .btn{max-width:508px;margin:0 auto;font-size:18px;padding:14px 16px}
.spacer{height:80px}
`;

const PIXEL = `
!function(f,b){if(f.fbq)return;var id='${PIXEL_ID}',now=Date.now();
function ck(n){var m=b.cookie.match('(?:^|; )'+n+'=([^;]+)');return m?m[1]:null}
function set(n,v){b.cookie=n+'='+v+';path=/;max-age=7776000;SameSite=Lax'}
var fbp=ck('_fbp');if(!fbp){fbp='fb.1.'+now+'.'+Math.floor(Math.random()*2147483647);set('_fbp',fbp)}
var cl=new URLSearchParams(location.search).get('fbclid'),fbc=ck('_fbc');
if(cl&&(!fbc||fbc.split('.').pop()!==cl)){fbc='fb.1.'+now+'.'+cl;set('_fbc',fbc)}
f.__eid=function(){return (f.crypto&&crypto.randomUUID)?crypto.randomUUID():now+'-'+Math.random().toString(36).slice(2)};
var pv=0;f.fbq=function(cmd,ev,cd,opt){if(cmd!=='track')return;if(ev==='PageView'){if(pv)return;pv=1}
  var q=new URLSearchParams({id:id,ev:ev,dl:location.href,rl:b.referrer,ts:String(Date.now()),fbp:fbp});
  if(fbc)q.set('fbc',fbc);if(opt&&opt.eventID)q.set('eid',opt.eventID);
  if(cd)for(var k in cd){var v=cd[k];q.set('cd['+k+']',typeof v==='object'?JSON.stringify(v):String(v))}
  var u='https://www.facebook.com/tr?'+q.toString();
  try{fetch(u,{mode:'no-cors',keepalive:true,credentials:'include'})}catch(e){new Image().src=u}};
f.fbq.lite=1;f.fbq('track','PageView');
b.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[data-amz]');if(!a)return;
  e.preventDefault();var p=f.__product||{};
  try{f.fbq('track','InitiateCheckout',p,{eventID:f.__eid()})}catch(x){}
  setTimeout(function(){location.href=a.href},150)});
}(window,document);
`;

export default function BridgeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" dir="ltr">
      <head>
        <link rel="preload" href="/fonts/nunito-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <script dangerouslySetInnerHTML={{ __html: PIXEL }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
