const { ExpectationFailed } = require("http-errors");
const { TestWatcher } = require("jest");
const puppeteer = require("puppeteer");

test("Crear nuevo Workspace y añadir nota. Añado una nueva nota y se crea automáticamente el Workspace con su url dinámica", async()=>{
    const browser = await puppeteer.launch({
        headless:true,
        slowMo:10,
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");
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
    const notasText = await page.$$eval("._card__text", (notas) => notas.map((nota)=> nota.innerText));
    const TitleNotaFound = notasTitle.some(title => title == "Prueba nota con Test3");
    const TextNotaFound = notasText.some(text => text == "Prueba texto con Test3");
    const idNota = await page.$eval("div[data-id]", nota => nota.dataset.id)
    await page.click(`div[data-id='${idNota}'] a`);
    const idWorkspace = await page.$eval("#idWorkspace", input => { return input.value});
    const settingsPage = await browser.newPage();
    await settingsPage.goto(`http://localhost:3000/settings/${idWorkspace}`);
    await settingsPage.click("#hideCompletedTasksId");
    const checkboxStatus = await settingsPage.$eval("#hideCompletedTasksId", checkbox => {return checkbox.checked})
    const workspacePage = await browser.newPage();
    await workspacePage.goto(`http://localhost:3000/${idWorkspace}`);
    let buscarNota = await workspacePage.$$eval("div._cardDisabled", el => el.length) //$$eval nunca da errores
    console.log(buscarNota);
  /*   const buscarNota = await page.$eval(`div[data-id=${idNota}]`);
    console.log(buscarNota); */

    expect(TitleNotaFound).toBe(true);
    expect(TextNotaFound).toBe(true);
    expect(checkboxStatus).toBe(true);
    expect(buscarNota).toBe(0);
    
    browser.close();
});
