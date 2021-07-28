<table>
    <tr>
        <td width="1200">
           <img src="https://avisame-app.herokuapp.com/images/logo_avisame.svg"/>
        </td>
    </tr>
    <tr>
        <td>
            <div align="center">
                <h2>Bienvenidos a Avísame!</h2>
                Aplicación liviana y segura para compartir notas y crear recordatorios.
            </div>     
        </td>
    </tr>
</table> 
npm start...  

``` javascript
> avisa-me@0.0.0 start
> nodemon ./bin/www

[nodemon] 2.0.8
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
```
  


## Demo de la aplicación






https://user-images.githubusercontent.com/80530839/127242060-3aad3520-f6eb-4056-a1fd-45fab455f593.mp4







Pàgina Web [Avísame](https://avisame-app.herokuapp.com/)

---

## Instalación y uso 🔧

``` javascript
npm install
```

Configurar las variables de entorno  
```
MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_HOST, NODEMAILER_HOST, NODEMAILER_USER y NODEMAILER_PASSWORD
```
- Inicia nodemon en el directorio .bin/www
``` javascript
npm start 
```
- Inicia Jest con puppeteer y supertest para los test del proyecto
``` javascript
npm test 
```


---
## Construido con 🛠️

- [NodeJS](https://nodejs.org/) - Nos permite tener una aplicación web o API, del lado servidor, usando JavaScript   
- [Express](https://expressjs.com/) - Dota de funcionalidades y minimalismo extra a NodeJS en cuanto a las aplicaciones web o API's  
- [MongoDB](https://www.mongodb.com/) - Sistema de base de datos NoSQL. Lenguaje JavaScript. Facilidad y escalabilidad en su uso  
- [Bootstrap 5.0](https://getbootstrap.com/docs/5.0/getting-started/introduction/) - Librería que simplifica el diseño y la adaptación del mismo para cualquier agente de usuario

Esquema tecnologías usadas  
![Esquema Tecnologías](https://user-images.githubusercontent.com/78435266/126797167-0bce29e3-e8ba-4f89-b899-2f0f7e171684.png)  
[Más detalles de la arquitectura](https://github.com/FOAP-Netmind-2021/avisa-me/wiki/Tecnolog%C3%ADas-usadas-en-la-aplicaci%C3%B3n)  

Esquema base de datos  
![Esquema Base de datos](https://user-images.githubusercontent.com/79173115/126785229-7a484ec2-dd25-474b-a64f-8766a9cf2a4f.PNG)    
[Más detalles de la base de datos](https://github.com/FOAP-Netmind-2021/avisa-me/wiki/Esquema-de-datos-de-la-aplicaci%C3%B3n)  

## Wiki 📖

Puedes encontrar información de cómo hemos llevado a cabo este proyecto en [Wiki](https://github.com/FOAP-Netmind-2021/avisa-me/wiki)



---

Prueba de Jose