/* Accessible compact navigation on narrow screens; preserves all nine links. */
(function(){
  'use strict';
  function init(){
    const nav=document.querySelector('nav.eng-tabs');
    if(!nav || nav.dataset.enhanced==='true') return;
    nav.dataset.enhanced='true';
    const wrapper=document.createElement('div');
    wrapper.className='site-nav-wrap';
    nav.parentNode.insertBefore(wrapper,nav);
    wrapper.appendChild(nav);
    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='site-nav-toggle';
    toggle.setAttribute('aria-controls','site-main-navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent='Разделы сайта';
    nav.id='site-main-navigation';
    const current=nav.querySelector('.eng-tab.active');
    if(current)current.setAttribute('aria-current','page');
    nav.setAttribute('aria-label','Основная навигация');
    wrapper.insertBefore(toggle,nav);
    function close(){
      toggle.setAttribute('aria-expanded','false');
      wrapper.classList.remove('site-nav-open');
    }
    toggle.addEventListener('click',()=>{
      const isOpen=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!isOpen));
      wrapper.classList.toggle('site-nav-open',!isOpen);
    });
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
    const mq=window.matchMedia('(min-width: 861px)');
    if(mq.addEventListener) mq.addEventListener('change',close);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
