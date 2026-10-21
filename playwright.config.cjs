const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
 testDir: './tests',
 testMatch: /.*\.spec\.cjs$/,
 timeout: 30000,
 expect: {timeout: 7000},
 fullyParallel: false,
 retries: process.env.CI ? 1 : 0,
 reporter: process.env.CI ? 'github' : 'list',
 use: {
   baseURL: 'http://127.0.0.1:8765',
   trace: 'retain-on-failure',
   screenshot: 'only-on-failure'
 },
 projects: [
   {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
   {name:'chromium-mobile',testMatch:/mobile-smoke\.spec\.cjs$/,use:{...devices['Desktop Chrome'],viewport:{width:375,height:812},isMobile:true,hasTouch:true}}
 ],
 webServer: {
   command: 'python3 -m http.server 8765 --bind 127.0.0.1',
   url:'http://127.0.0.1:8765/',
   reuseExistingServer: !process.env.CI,
   timeout:30000
 }
});
