const puppeteer = require('puppeteer');

const mongoose = require("mongoose");
const app = require('../../../app');

const {MONGO_PASSWORD, MONGO_USER, MONGO_DB, MONGO_HOST} = process.env //Requerimos variables de entorno
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/test`;
var port = "3002";

describe('Modificación de settings', () => {

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

  test("Ocultar notas completadas mediante la setting correspondiente. Añado una nueva nota, la completo, voy a settings, marco el checkbox de 'Ocultar tareas completadas'. Vuelvo a la vista y las tareas completadas no aparecen", async()=>{
      const browser = await puppeteer.launch({
          headless:true,
          slowMo:10,
      });
      const page = await browser.newPage();
      await page.goto(`http://localhost:${port}`);
      await page.click("#title");
      await page.type("#title", "Prueba nota con Test");
      await page.click("#text");
      await page.type("#text", "Prueba texto con Test");
      await page.click("input[type=submit]");
      await page.click("#title");
      await page.type("#title", "Prueba nota con Test2");
      await page.click("#text");
      await page.type("#text", "Prueba texto con Test2");
      await page.click("input[type=submit]");
      await page.click("#title");
      await page.type("#title", "Prueba nota con Test3");
      await page.click("#text");
      await page.type("#text", "Prueba texto con Test3");
      await page.click("input[type=submit]");
      const notasTitle = await page.$$eval("._card__title", (notas) => notas.map((nota)=> nota.innerText));
      const TitleNotaFound = notasTitle.some(title => title == "Prueba nota con Test3");
      const idNota = await page.$eval("div[data-id]", nota => nota.dataset.id)
      await page.click(`div[data-id='${idNota}'] a`);
      const idWorkspace = await page.$eval("#idWorkspace", input => { return input.value});
      const settingsPage = await browser.newPage();
      await settingsPage.goto(`http://localhost:${port}/settings/${idWorkspace}`);
      await settingsPage.click("#hideCompletedTasksId");
      const checkboxStatus = await settingsPage.$eval("#hideCompletedTasksId", checkbox => {return checkbox.checked})
      const workspacePage = await browser.newPage();
      await workspacePage.goto(`http://localhost:${port}/${idWorkspace}`);
      let buscarNota = await workspacePage.$$eval("div._cardDisabled", el => el.length) //$$eval nunca da errores
      console.log(buscarNota);
    /*   const buscarNota = await page.$eval(`div[data-id=${idNota}]`);
      console.log(buscarNota); */

      expect(TitleNotaFound).toBe(true);
      expect(checkboxStatus).toBe(true);
      expect(buscarNota).toBe(0);
      
      browser.close();
  });
})