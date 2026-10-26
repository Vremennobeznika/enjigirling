/* Preserve bookmarked industry links while keeping a single calculator page. */
(function(){
 const target=new URL('calculator.html',location.href);
 target.search=location.search;
 if(/^#g\d+$/.test(location.hash))target.searchParams.set('industry',location.hash.slice(1));
 target.hash=target.searchParams.has('atlasTool')?'labAtlasTools':'calculatorCatalog';
 location.replace(target.href);
})();
