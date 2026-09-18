const root = document.querySelector('[data-wl-output]');
if (root) {
  const track = root.querySelector('[data-output-track]');
  const slides = [...track.children];
  const tabs = [...root.querySelectorAll('[data-output-tab]')];
  const title = root.querySelector('.wl-output__caption [data-output-title]');
  const desc = root.querySelector('.wl-output__caption [data-output-desc]');
  const count = root.querySelector('[data-output-count]');
  const prev = root.querySelector('[data-output-prev]');
  const next = root.querySelector('[data-output-next]');
  const categoryTabs = tabs[0]?.parentElement;
  const urls = ['crm','restaurant-ordering','ecommerce','client-portal','ai-saas','booking','membership','blog','admin-dashboard','business','internal-tools','mobile-apps','automations'];
  slides.forEach((slide,i) => {
    const address = slide.querySelector('.wl-output__chrome span');
    if (address) address.textContent = `yourbrand.com/${urls[i]}`;
    slide.querySelector('img')?.setAttribute('draggable', 'false');
  });
  let active = 0;
  let raf = 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render(index) {
    active = index;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
    tabs.forEach((tab,i)=>tab.setAttribute('aria-current',String(i===index)));
    title.textContent = slides[index].dataset.outputTitle;
    desc.textContent = slides[index].dataset.outputDesc;
    count.textContent = `${String(index+1).padStart(2,'0')} / ${slides.length}`;
    prev.disabled = index===0;
    next.disabled = index===slides.length-1;
  }
  function go(index) {
    index = Math.max(0,Math.min(slides.length-1,index));
    render(index);
    track.scrollTo({left:slides[index].offsetLeft-(track.clientWidth-slides[index].clientWidth)/2,behavior:reduced()?'instant':'smooth'});
    const row = tabs[index].parentElement;
    row.scrollTo({left:tabs[index].offsetLeft-(row.clientWidth-tabs[index].clientWidth)/2,behavior:reduced()?'instant':'smooth'});
  }
  function enableDrag(element) {
    if (!element) return;
    let startX = 0;
    let startScroll = 0;
    let pointerId = null;
    let dragged = false;
    element.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = element.scrollLeft;
      dragged = false;
    });
    element.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (!dragged && Math.abs(distance) < 6) return;
      if (!dragged) {
        dragged = true;
        element.setPointerCapture(pointerId);
        element.classList.add('is-dragging');
      }
      event.preventDefault();
      element.scrollLeft = startScroll - distance;
    });
    const release = event => {
      if (event.pointerId !== pointerId) return;
      const id = pointerId;
      pointerId = null;
      element.classList.remove('is-dragging');
      if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
    };
    element.addEventListener('pointerup', release);
    element.addEventListener('pointercancel', release);
    element.addEventListener('lostpointercapture', release);
    element.addEventListener('pointerleave', event => {
      if (!dragged) release(event);
    });
    element.addEventListener('click', event => {
      if (!dragged) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      dragged = false;
    }, true);
    element.addEventListener('dragstart', event => event.preventDefault());
  }
  enableDrag(categoryTabs);
  enableDrag(track);
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>go(i)));
  prev.addEventListener('click',()=>go(active-1));
  next.addEventListener('click',()=>go(active+1));
  root.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    go(event.key==='Home'?0:event.key==='End'?slides.length-1:active+(event.key==='ArrowRight'?1:-1));
  });
  track.addEventListener('scroll',()=>{
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const center=track.scrollLeft+track.clientWidth/2;
      let closest=0;
      slides.forEach((s,i)=>{if(Math.abs(s.offsetLeft+s.clientWidth/2-center)<Math.abs(slides[closest].offsetLeft+slides[closest].clientWidth/2-center))closest=i});
      render(closest);
    });
  },{passive:true});
}
