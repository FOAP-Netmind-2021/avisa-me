const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require('../../../app');

const request = supertest(app);

const {MONGO_PASSWORD, MONGO_USER, MONGO_DB, MONGO_HOST} = process.env //Requerimos variables de entorno
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/test`;


describe('Probando end-points', () => {

    let server;

    beforeAll( async  () => {
        /* Runs before all tests */
        await mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });
        server = app.listen(3000);
        
        // Podiamos haber requerido todo el app que nos proporciona el express-generator (const server = require("../bin/www")) 
        // Pero de esta forma nos aseguramos de una conexion limpia a otra base de datos para testear
    })


    afterAll( async () => {
        /* Runs after all tests */
        await server.close();
        await mongoose.disconnect();
    })

    
    /* Tests */
    test("Probamos que un GET a un end-point existente retorna status 200", async () => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
      });

    test("Probamos que un GET a un end-point NO existente retorna status 404", async () => {
       const response = await request.get("/89/qsqws");
       expect(response.status).toBe(404);
      });

    test("Crear una tarea vacía, en el end-point /addTask, debe hacer saltar a express-validator con un error 400", async() => {
        const task = {
            title: "",
            text: ""
        };
        try {
            const response = await request.post('/addTask').send(task);
            expect(response.status).toBe(400);

        } catch (err) {
            console.log(`Error ${err}`);
        }
    });

  });