/* Accessible compact navigation on narrow screens; preserves all nine links. */
(function(){
  'use strict';
  function init(){
    const nav=document.querySelector('nav.eng-tabs');
    if(!nav || nav.dataset.enhanced==='true') return;
    nav.dataset.enhanced='true';
    // Reuse server-rendered navigation, avoiding a large layout shift.
    // Older pages without static markup remain backward compatible.
    const wrapper=nav.parentElement.classList.contains('site-nav-wrap')?nav.parentElement:document.createElement('div');
    if(!wrapper.classList.contains('site-nav-wrap')){
      wrapper.className='site-nav-wrap';
      nav.parentNode.insertBefore(wrapper,nav);
      wrapper.appendChild(nav);
    }
    const toggle=wrapper.querySelector('.site-nav-toggle')||document.createElement('button');
    toggle.type='button';
    toggle.className='site-nav-toggle';
    toggle.setAttribute('aria-controls','site-main-navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent='Разделы сайта';
    toggle.setAttribute('aria-label','Открыть разделы сайта');
    nav.id='site-main-navigation';
    const current=nav.querySelector('.eng-tab.active');
    if(current)current.setAttribute('aria-current','page');
    nav.setAttribute('aria-label','Основная навигация');
    if(toggle.parentElement!==wrapper)wrapper.insertBefore(toggle,nav);
    function close(){
      toggle.setAttribute('aria-expanded','false');
      wrapper.classList.remove('site-nav-open');
      toggle.setAttribute('aria-label','Открыть разделы сайта');
    }
    toggle.addEventListener('click',()=>{
      const isOpen=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!isOpen));
      wrapper.classList.toggle('site-nav-open',!isOpen);
      toggle.setAttribute('aria-label',isOpen?'Открыть разделы сайта':'Закрыть разделы сайта');
    });
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('click',e=>{if(!wrapper.contains(e.target))close();});
    wrapper.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
    const mq=window.matchMedia('(min-width: 861px)');
    if(mq.addEventListener) mq.addEventListener('change',close);
  }
  init();
})();
