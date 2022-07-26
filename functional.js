import { check, sleep } from "k6";
import { chromium } from 'k6/x/browser';

// export const options = {
//     vus: 2,
//     // duration: '30s',
//   };

export default function(){
    const browser=chromium.launch(
        {
            headless:false,
            slowMo: '500ms'
        }
    );
    const context=browser.newContext();
    const page=context.newPage();

    // Access Home page
    const domain="http://www.jacplus.com.au";
    page.goto(domain,{waitUntil: "networkidle"});
    check(page,{'01-HomePage':(p)=>p.$('head > title').textContent().includes('JacarandaPLUS')});
    page.screenshot({path:'HomePage.png'});

    let emailTextbox=page.$('input[name="username"]');
    let passwordBox=page.$('input[name="password"]');
    let nextButton=page.$('//*[@id="idpLogin"]');
    let signInButton=page.$('input[id="submit"');

    // SAML Sign In
    emailTextbox.type('demohub@personal.com');
    nextButton.click();    
    page.waitForSelector('input[name="password"]');
    page.screenshot({path:'UserName.png'});
    
    // Log In action
    passwordBox.type('My@password');
    signInButton.click();
    page.waitForLoadState('networkidle');
    // sleep(3);
    page.waitForSelector('button[id="notificationsTab"]',{state:'attached'});
    check(page,{'02-Bookshelf':(p)=>p.$('head > title').textContent().includes('JacPLUS - Your bookshelf')});
    page.screenshot({path:'bookShelf.png'});
   
    // Close the browser
    page.close();
    browser.close();    
}
