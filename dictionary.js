document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('dictionaryGrid');
    const emptyMsg = document.getElementById('dictionaryEmpty');
    const searchInput = document.getElementById('searchInput');

    const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });
    const orderedTerms = [...dictionary].sort((a, b) => collator.compare(a.term, b.term));
    const searchable=orderedTerms.map(item=>({item,text:([item.term,item.def,...(item.aliases||[])].join(' ')).toLocaleLowerCase('ru-RU')}));
    const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const reset=document.createElement('button');reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить поиск';
    searchInput.insertAdjacentElement('afterend',reset);reset.insertAdjacentElement('afterend',status);
    reset.addEventListener('click',()=>{searchInput.value='';renderTerms(orderedTerms);searchInput.focus();});
    function renderTerms(items) {
        status.textContent='Найдено: '+items.length+' из '+dictionary.length;
        reset.hidden=!searchInput.value.trim();
        grid.innerHTML = '';
        if (items.length === 0) {
            emptyMsg.style.display = 'block';
            grid.dataset.ready = 'true';
            return;
        }
        emptyMsg.style.display = 'none';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'eng-card';
            const title=document.createElement('h2');title.className='eng-title';title.textContent=item.term;
            const description=document.createElement('p');description.className='eng-desc';description.textContent=item.def;
            card.append(title,description);
            const sources = (item.sources || []).filter(source => /^https:\/\//i.test(source.url || ''));
            if (sources.length) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');summary.textContent = 'Источники';details.append(summary);
                const list = document.createElement('ul');
                for (const source of sources) {
                    const row = document.createElement('li'), link = document.createElement('a');
                    link.textContent = source.title;link.href = source.url;link.target = '_blank';link.rel = 'noopener noreferrer';
                    row.append(link);list.append(row);
                }
                details.append(list);card.append(details);
            }
            grid.appendChild(card);
        });
        grid.dataset.ready = 'true';
    }

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const items = searchable.filter(entry=>entry.text.includes(q)).map(entry=>entry.item);
        renderTerms(items);
    });

    const requested=new URLSearchParams(location.search).get('q');
    if(requested){searchInput.value=requested;searchInput.dispatchEvent(new Event('input',{bubbles:true}));}
    else renderTerms(orderedTerms);
});
