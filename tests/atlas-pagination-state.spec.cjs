const {test,expect}=require('@playwright/test');
for(const [name,grid,search,batch] of [
 ['materials','#materialGrid','#materialSearch',18],
 ['processes','#processGrid','#processSearch',24]
])test(name+' pagination keeps the open card and resets after filtering',async({page})=>{
 await page.setViewportSize({width:375,height:900});
 await page.goto('/'+name+'.html');
 const cards=page.locator(grid+' > article'),first=cards.first();
 await expect(cards).toHaveCount(batch);
 await first.locator('details > summary').first().click();
 await expect(first.locator('details').first()).toHaveAttribute('open','');
 await first.evaluate(node=>{window.paginationOriginalCard=node;});
 await page.locator('.process-show-more').click();
 await expect(cards).toHaveCount(batch*2);
 await expect(first.locator('details').first()).toHaveAttribute('open','');
 expect(await first.evaluate(node=>node===window.paginationOriginalCard)).toBe(true);
 const ids=await cards.evaluateAll(nodes=>nodes.map(n=>n.id));
 expect(new Set(ids).size).toBe(ids.length);
 await page.locator(search).fill('__no_match_for_pagination__');
 await expect(cards).toHaveCount(0);
 await expect(page.locator('.process-show-more')).toBeHidden();
 await page.locator(search).fill('');
 await expect(cards).toHaveCount(batch);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
});
