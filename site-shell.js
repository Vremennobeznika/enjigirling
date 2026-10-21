/* Shared visual shell. Existing content and community links remain intact. */
(function(){
'use strict';
function init(){
  const root=document.querySelector('.eng-calendar-root');
  const main=document.querySelector('main.site-page');
  if(!main)return;
  // Every page needs a stable main landmark and a keyboard skip link.
  if(!main.id) main.id='main-content';
  if(!document.querySelector('.skip-link')){
    const skip=document.createElement('a');
    skip.className='skip-link';skip.href='#'+main.id;
    skip.textContent='Перейти к содержимому';
    document.body.insertBefore(skip,document.body.firstChild);
  }
  // Some standalone tool pages had no visible heading in the main landmark.
  const topbar=main.querySelector('.site-topbar');
  if(topbar && !topbar.querySelector('.theme-toggle')){
    const theme=document.querySelector('.theme-toggle');
    if(theme)topbar.appendChild(theme);
  }
  if(root && !root.querySelector('.site-topbar')){
    const top=document.createElement('div');
    top.className='site-topbar site-topbar--shared';
    const brand=document.createElement('a');
    brand.className='site-brand';brand.href='index.html';
    brand.textContent='ENJIGIRLING ';
    const subtitle=document.createElement('span');
    subtitle.textContent='/ ENGINEERING INDEX';brand.appendChild(subtitle);
    top.appendChild(brand);
    const theme=document.querySelector('.footer-theme .theme-toggle');
    if(theme){theme.type='button';top.appendChild(theme);}
    root.insertBefore(top,root.firstChild);
  }
  let footer=document.querySelector('footer');
  if(!footer){
    footer=document.createElement('footer');
    footer.className='site-footer';
    main.insertAdjacentElement('afterend',footer);
  }
  if(!footer.querySelector('.site-footer-links')){
    const links=document.createElement('div');
    links.className='site-footer-links';
    const destinations=[
      ['https://t.me/enjigirling','Telegram-канал'],
      ['https://t.me/evosif','Связаться в Telegram'],
      ['mailto:eva.tselikina@ya.ru','Написать письмо'],
      ['resources.html','Дружеские каналы и ресурсы']
    ];
    for(const [href,label] of destinations){
      const a=document.createElement('a');
      a.href=href;a.textContent=label;a.className='footer-btn';
      if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}
      links.appendChild(a);
    }
    const container=footer.querySelector('.container')||footer;
    container.appendChild(links);
  }
  if(!footer.querySelector('.footer-copy')&&!footer.querySelector('.site-footer-copy')){
    const copyright=document.createElement('p');
    copyright.className='site-footer-copy';
    copyright.textContent='© 2026 — ENJIGIRLING';
    footer.appendChild(copyright);
  }
}
init();
})();
