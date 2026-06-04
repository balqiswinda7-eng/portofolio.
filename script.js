/* ════════════════════════════════
   SNAP ENGINE
════════════════════════════════ */
(function(){
  const TOTAL=4, ANIM=650;
  let cur=0, busy=false;

  const panels=[...document.querySelectorAll('.panel')];
  const dots=[...document.querySelectorAll('.dot')];
  const dLinks=[...document.querySelectorAll('.nav-link')];
  const mLinks=[...document.querySelectorAll('.mob-nav-link')];
  const prog=document.getElementById('progress-bar');
  const hint=document.getElementById('scroll-hint');
  const flash=document.getElementById('flash');
  const ham=document.getElementById('hamburger');
  const mob=document.getElementById('mobileMenu');
  const closeBtn=document.getElementById('closeMenu');

  /* hamburger toggle */
  function openMenu(){mob.classList.add('open');ham.classList.add('open')}
  function closeMenu(){mob.classList.remove('open');ham.classList.remove('open')}
  ham.addEventListener('click',()=>mob.classList.contains('open')?closeMenu():openMenu());
  closeBtn.addEventListener('click',closeMenu);

  function states(a){
    panels.forEach((p,i)=>{p.dataset.state=i<a?'after':i===a?'active':'before'});
  }
  function ui(i){
    prog.style.width=(TOTAL>1?i/(TOTAL-1)*100:100)+'%';
    dots.forEach((d,j)=>d.classList.toggle('active',j===i));
    dLinks.forEach((a,j)=>a.classList.toggle('active',j===i));
    mLinks.forEach((a,j)=>a.classList.toggle('active',j===i));
    hint.style.opacity=i>0?'0':'.45';
  }
  function doFlash(){flash.style.opacity='1';setTimeout(()=>flash.style.opacity='0',140)}

  function goTo(t){
    if(busy||t<0||t>=TOTAL||t===cur)return;
    busy=true; doFlash();
    cur=t; states(t); ui(t);
    setTimeout(()=>busy=false,ANIM);
  }

  /* Wheel */
  let acc=0,wt=null;
  window.addEventListener('wheel',e=>{
    e.preventDefault(); if(busy)return;
    acc+=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    clearTimeout(wt); wt=setTimeout(()=>acc=0,280);
    if(acc>55){acc=0;goTo(cur+1)}else if(acc<-55){acc=0;goTo(cur-1)}
  },{passive:false});

  /* Touch — vertical swipe only */
  let ty=0,tx=0,tMoved=false;
  window.addEventListener('touchstart',e=>{
    ty=e.touches[0].clientY; tx=e.touches[0].clientX; tMoved=false;
  },{passive:true});
  window.addEventListener('touchmove',e=>{tMoved=true},{passive:true});
  window.addEventListener('touchend',e=>{
    if(busy||!tMoved)return;
    const dy=ty-e.changedTouches[0].clientY;
    const dx=tx-e.changedTouches[0].clientX;
    // Only trigger vertical swipe if clearly more vertical than horizontal
    if(Math.abs(dy)>Math.abs(dx)*1.2&&Math.abs(dy)>45)goTo(cur+(dy>0?1:-1));
  },{passive:true});

  /* Keyboard */
  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='PageDown')goTo(cur+1);
    if(e.key==='ArrowUp'||e.key==='PageUp')goTo(cur-1);
  });

  /* Dots */
  dots.forEach(d=>d.addEventListener('click',()=>goTo(+d.dataset.index)));

  /* Desktop nav */
  dLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goTo(+a.dataset.index)}));

  /* Mobile nav */
  mLinks.forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault(); closeMenu(); goTo(+a.dataset.index);
  }));

  /* CTA buttons */
  document.querySelectorAll('.nav-action').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault(); goTo(+b.dataset.index);
  }));

  states(0); ui(0);
})();

/* ════════════════════════════════
   PROJECT SLIDER
════════════════════════════════ */
(function(){
  const sl=document.getElementById('projSlider');
  if(!sl)return;
  let dn=false, sx, sc;
  sl.addEventListener('mousedown',e=>{dn=true;sx=e.pageX-sl.offsetLeft;sc=sl.scrollLeft;sl.style.cursor='grabbing'});
  sl.addEventListener('mouseleave',()=>{dn=false;sl.style.cursor='grab'});
  sl.addEventListener('mouseup',()=>{dn=false;sl.style.cursor='grab'});
  sl.addEventListener('mousemove',e=>{
    if(!dn)return; e.preventDefault();
    sl.scrollLeft=sc-(e.pageX-sl.offsetLeft-sx)*1.4;
  });
  const STEP=240;
  document.getElementById('slidePrev').addEventListener('click',()=>sl.scrollBy({left:-STEP,behavior:'smooth'}));
  document.getElementById('slideNext').addEventListener('click',()=>sl.scrollBy({left:STEP,behavior:'smooth'}));
})();
