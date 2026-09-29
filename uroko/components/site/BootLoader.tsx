import { emblemPath, emblemViewBox } from "@/lib/content/emblem-path";

/**
 * Boot screen, played on every full page load.
 *
 * 1. Black screen, the emblem as a dim outline; crimson ink rises through it.
 * 2. The inked mark fades and becomes a window: the overlay is black with an
 *    emblem-shaped hole (a CSS mask), so the page shows through the mark.
 * 3. The overlay scales up from the centre and fades, flying the viewer
 *    through the window into the hero, while the 3D pair slides in.
 *
 * The motion is plain CSS (transform, opacity, clip-path) so it starts with
 * the first paint and never waits for JavaScript. The inline script only
 * pins the page to the top, blocks scrolling while it plays, and tells the
 * 3D emblem when the window opens ("uroko:reveal") and when it is done
 * ("uroko:ready"). Without JavaScript the overlay still plays and hides.
 */
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${emblemViewBox}"><path fill-rule="evenodd" d="${emblemPath}"/></svg>`;
const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

const script = `(function(){
  var d=document.documentElement,b=document.getElementById("boot");
  if(!b)return;
  try{history.scrollRestoration="manual"}catch(e){}
  scrollTo(0,0);
  d.classList.add("boot-play");
  var keys={" ":1,ArrowDown:1,ArrowUp:1,PageDown:1,PageUp:1,Home:1,End:1};
  function block(e){if(e.type!=="keydown"||keys[e.key]){e.preventDefault();e.stopPropagation()}}
  var opts={capture:true,passive:false};
  ["wheel","touchmove","keydown"].forEach(function(t){addEventListener(t,block,opts)});
  var revealed=false,done=false;
  function reveal(){if(revealed)return;revealed=true;d.dataset.revealed="1";dispatchEvent(new Event("uroko:reveal"))}
  function finish(){
    if(done)return;done=true;reveal();
    ["wheel","touchmove","keydown"].forEach(function(t){removeEventListener(t,block,opts)});
    d.dataset.ready="1";b.setAttribute("data-done","");dispatchEvent(new Event("uroko:ready"));
  }
  b.addEventListener("animationstart",function(e){if(e.animationName==="boot-open")reveal()});
  b.addEventListener("animationend",function(e){if(e.target===b&&e.animationName==="boot-fade")finish()});
  setTimeout(finish,4500);
})();`;

export function BootLoader() {
  return (
    <>
      <div
        id="boot"
        aria-hidden="true"
        className="boot"
        suppressHydrationWarning
      >
        <div className="boot-veil" style={{ "--boot-mask": maskUrl } as React.CSSProperties} />
        <div className="boot-mark">
          <svg viewBox={emblemViewBox} className="boot-mark-base">
            <path fill="currentColor" fillRule="evenodd" d={emblemPath} />
          </svg>
          <svg viewBox={emblemViewBox} className="boot-mark-ink">
            <path fill="currentColor" fillRule="evenodd" d={emblemPath} />
          </svg>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
