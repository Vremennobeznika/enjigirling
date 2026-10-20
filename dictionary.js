document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('dictionaryGrid');
    const emptyMsg = document.getElementById('dictionaryEmpty');
    const searchInput = document.getElementById('searchInput');

    const controls=searchInput.parentElement;
    const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const reset=document.createElement('button');reset.type='button';reset.className='eng-filter-btn filter-reset';reset.textContent='Сбросить поиск';
    searchInput.insertAdjacentElement('afterend',reset);reset.insertAdjacentElement('afterend',status);
    reset.addEventListener('click',()=>{searchInput.value='';renderTerms(dictionary);searchInput.focus();});
    function renderTerms(items) {
        status.textContent='Найдено: '+items.length+' из '+dictionary.length;
        reset.hidden=!searchInput.value.trim();
        grid.innerHTML = '';
        if (items.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'eng-card';
            const title=document.createElement('h3');title.className='eng-title';title.textContent=item.term;
            const description=document.createElement('p');description.className='eng-desc';description.textContent=item.def;
            card.append(title,description);
            grid.appendChild(card);
        });
    }

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const items = dictionary.filter(item =>
            item.term.toLowerCase().includes(q) || item.def.toLowerCase().includes(q)
        );
        renderTerms(items);
    });

    renderTerms(dictionary);
});