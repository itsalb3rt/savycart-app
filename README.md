# Sheiley Shop <img src="https://user-images.githubusercontent.com/3104648/28351989-7f68389e-6c4b-11e7-9bf2-e9fcd4977e7a.png" width="50"/>
</div>
<p style="float:left;">
<img src="https://i.imgur.com/UqnVH51.png" width="150" />
<img src="https://i.imgur.com/nLCoQRr.png" width="200" />
<img src="https://i.imgur.com/0gXjfy9.png" width="150" />
</p>

---

### Introducción

**Sheiley Shop** es una **PWA**  para dar seguimiento a las compras personales, del hogar y hasta de una micro empresa, para que pueda gastar menos y ahorrar más. Se acabó el tener que escribir con papel y lápiz las compras que va a realizar.

### Características

**Sheiley Shop** cuenta con un montón de funciones, a continuación algunas de las más relevantes.

- Multi-usuario
- Multi-idiomas
- Muy intuitivo y fácil de usar, cuenta con una interfaz limpia con pocos botones
- Crea una lista de productos personalizados
- Obtén un precio final más acercado a la realidad tomando en cuenta el impuesto de cada artículo

### InstalaciónInstalación 

**Requisitos:**
- PHP 7.1.2 o superior
- Mysql 5.6
- NodeJs 10
- NPM 6.4
- Composer 1.8

---
Esta aplicación consta de 2 partes el Front-End que está construido sobre VUE y un API REST construido con PHP.


**PWA**

`git clone https://github.com/itsalb3rt/sheiley_shop_app.git`

Después de clonado el repositorio ejecutar 

`npm install `

**API REST**

El API REST está hecho en PHP por lo que se requiere un servidor con PHP 7.1 o superior.

`composer require itsalb3rt/sheiley-shop-api`
 
### Configuración

**Base de datos**

Dentro del directorio *raíz* del API REST ingresar a `etc/ sheiley_shop.sql` este archivo contiene todo el script de la base de datos.

Luego de ejecutado el script en la base de datos Mysql resta ingresar al directorio
`config/ config.php.ini` e ingresar los datos correspondiente a tu base de datos, usuario y password.

---

**App**

Para que el Front-End interactúe con el API REST se debe ingresar al directorio `src/store.js` en el objeto `state` cambiar la dirección del API según corresponda;

```javascript
apiDomain: (process.env.NODE_ENV == 'development') ?
'http://localhost/sheiley_shop_api' : 
'https://production.domain.com/sheiley_shop_api' ;

```
Con esto ya estarás listo para comenzar a utilizar la app en entorno de desarrollo, **¡Felicidades!**

---

### Desplegar app para producción

`npm run build`

Una vez culmine de compilarse la versión para producción, dentro del directorio raíz del front-end encontraras un archivo `.htaccess` el cual debes copiar en el nuevo directorio `dist`.

Crear un directorio en tu servidor llamado `sheiley_shop` y copia todo el contenido del directorio `dist` junto al `.htaccess`

Este archivo contiene las reglas de enrutamiento principales para que todo funcione a la hora de ingresar la URL en el navegador, de ser necesario puedes modificarlo según corresponda.

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /sheiley_shop/index.html [L] < -- Ruta de tu directorio en producción
</IfModule>
```

---

### Desplegar API REST

En el directorio `system/webroot/` encontraras un archivo con nombrado `FrontController.php` dentro de este debes modificar la constante `ENVIROMENT` y colocarle el valor `pro`.
