const puppeteer = require('puppeteer');

const mongoose = require("mongoose");
const app = require('../../../app');

const {MONGO_PASSWORD, MONGO_USER, MONGO_DB, MONGO_HOST} = process.env //Requerimos variables de entorno
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/test`;
var port = "3001";

describe('Probando en creación de tareas', () => {

let server;

    beforeAll( async  () => {
        /* Runs before all tests */
        await mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });
        server = app.listen(port);
        
        // Podiamos haber requerido todo el app que nos proporciona el express-generator (const server = require("../bin/www")) 
        // Pero de esta forma nos aseguramos de una conexion limpia a otra base de datos para testear
    })


    afterAll( async ()=> {
        /* Runs after all tests */
        await server.close();
        await mongoose.disconnect();
    })


    
    /* e2e Tests */
    test('Si escribimos titulo o texto aparece el boton  "añadir-tarea" ', async ()=>{
        const browser = await puppeteer.launch({ 
            headless: true,     //interfaz gráfica para el navegador
            slowMo: 10,
            args: ['--window-size=1120,920']
        }); 
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}`);

        await page.click('#title');
        await page.type('#title', 'hola cristian');

        // Buscamos en la página el botón de crear tarea, y devolvemos su valor de "visibility" en su propiedad style. En este caso es "visible"
        const addTaskBtn = await page.$eval('#createTask', element => element.style.visibility);

        await expect(addTaskBtn).toBe("visible");
        
        await browser.close();
    });


    test('Si escribimos titulo o texto y posteriormente los eliminamos, desaparece el botón "añadir-tarea" ', async ()=>{
        const browser = await puppeteer.launch({ 
            headless: true,     //interfaz gráfica para el navegador
            slowMo: 10,
            args: ['--window-size=1120,920']
        }); 
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}`);

        await page.click('#title');
        await page.type('#title', 'Holalalaaa');
        
        // Borra contenido. Simulamos el retroceso en un campo para activar la función oninput()
        const inputValue = await page.$eval('#title', el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
        }

        // Buscamos en la página el botón de crear tarea, y devolvemos su valor de "visibility" en su propiedad style. En este caso es "hidden"
        const visibility = await page.$eval('#createTask', element => element.style.visibility);

        await expect(visibility).toBe("hidden");
        
        await browser.close();
    });

});