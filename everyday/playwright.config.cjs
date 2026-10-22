const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests',
 testMatch:/.*\.spec\.cjs$/,
 timeout:35000,
 expect:{timeout:7000},
 fullyParallel:false,
 retries:process.env.CI?1:0,
 reporter:process.env.CI?'github':'list',
 use:{baseURL:'http://127.0.0.1:8765',trace:'retain-on-failure',screenshot:'only-on-failure',...devices['Desktop Chrome']},
 projects:[{name:'chromium-desktop',use:{viewport:{width:1366,height:900}}}],
 webServer:{command:'python3 -m http.server 8765 --bind 127.0.0.1',cwd:require('node:path').resolve(__dirname,'..'),url:'http://127.0.0.1:8765/',reuseExistingServer:!process.env.CI,timeout:30000}
});