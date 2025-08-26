# 🧾 Microservicio de Pagos

API REST desarrollada en **Node.js + Express** para la gestión financiera de un Sistema Integral de una gasolinera.  

---

## Requisitos
- Una base de datos **MongoDB** (local, en Docker o en Atlas)
- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)


---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/pagos
````
---

## Proceso de instalación y ejecución
````
- git clone https://github.com/sebas413pa/microservicio-pagos.git
- cd microservicio-pagos
- npm install
- npm run dev
````
## Construcción y ejecución con Docker 🐳
```
- docker build -t usuario/microservicio-pagos .
- docker push usuario/microservicio-pagos
- docker run -d -p 3001:3001 --env-file .env usuario/microservicio-pagos
````
