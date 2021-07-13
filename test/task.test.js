const puppeteer = require('puppeteer');

//e2e tests
test('Si escribimos titulo o texto aparece el boton  "añadir-tarea" ', async()=>{
    const browser = await puppeteer.launch({ 
        headless: false,     //interfaz gráfica para el navegador
        slowMo: 10,
        args: ['--window-size=1120,920']
    }); 
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    await page.click('#title');
    await page.type('#title', 'hola cristian');

    // Buscamos en la página el botón de crear tarea, y devolvemos su valor de "visibility" en su propiedad style. En este caso es "visible"
    const addTaskBtn = await page.$eval('#createTask', element => element.style.visibility);

    await expect(addTaskBtn).toBe("visible")
    
    await browser.close();

    
})


test('Si escribimos titulo o texto y posteriormente los eliminamos, desaparece el botón "añadir-tarea" ', async()=>{
    const browser = await puppeteer.launch({ 
        headless: false,     //interfaz gráfica para el navegador
        slowMo: 10,
        args: ['--window-size=1120,920']
    }); 
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    await page.click('#title');
    await page.type('#title', 'Holalalaaa');
    
    // Borra contenido
    await page.$eval('#title', element => element.value = "");

    
    
    await page.focus('#text')
    

    // Buscamos en la página el botón de crear tarea, y devolvemos su valor de "visibility" en su propiedad style. En este caso es "hidden"
    //const addTaskBtn = await page.$eval('#createTask', element => element.style.visibility);


    const visibility = await page.$eval('#createTask', element => element.style.visibility);

    await expect(visibility).toBe("hidden")
    
    await browser.close();
})