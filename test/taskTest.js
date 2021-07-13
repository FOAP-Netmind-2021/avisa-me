const puppeteer = require('puppeteer');

//e2e tests
test('empiezo a editar titulo o texto y aparece el boton de añadir', async()=>{
    const browser = await puppeteer.launch({ 
        headless: false,     //interfaz gráfica para el navegador
        slowMo: 70,
        args: ['--window-size=1120,920']
    }); 
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

})