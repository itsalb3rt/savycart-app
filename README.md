# Sheiley Shop 
<img src="https://user-images.githubusercontent.com/3104648/28351989-7f68389e-6c4b-11e7-9bf2-e9fcd4977e7a.png" width="50"/>
|
<img src="https://user-images.githubusercontent.com/35310226/177658962-85477241-4bf2-4647-9f30-7afa3ec3bc18.png" width="130"/>
</div>
<p style="float:left;">
<img src="https://i.imgur.com/UqnVH51.png" width="150" />
<img src="https://i.imgur.com/nLCoQRr.png" width="200" />
<img src="https://i.imgur.com/0gXjfy9.png" width="150" />
</p>

---

## Content

  - [Description](#description)
  - [Features](#features)
  - [Get started :star:](#get-started)
  - [Frontend :heart_eyes: ](#frontend)
    - [API entry point](#api-entry-point)
    - [Frontend production](#frontend-production)
  - [Backend :sunglasses: ](#backend)
    - [Database](#database)
    - [Backend production](#backend-production)
    - [Extra](#extra)
  - [Docker](#docker)

---

### Description

**Sheiley Shop** is a **PWA** and **Android** APP to track personal purchases, No more paper and pencil to go to the supermarket :department_store:


### Features

- Multi-user
- Multi-languages
- Very intuitive and easy to use, it has a clean interface with few buttons
- List of products
- Favorite products
- Product categories
- Unit of measurement
- Shopping history
- Shopping cart
- And more...

### Get started 

**Requirements:**
- PHP 7.1.2 o superior
- Mysql 5.6
- NodeJs 10
- NPM 6.4
- Composer 1.8

---

## Frontend

```bash
git clone https://github.com/itsalb3rt/sheiley_shop_app.git
```

```bash
yarn install 
```

```bash
yarn serve
# or run the next command for production
yarn build
```

## Android

To run app in `Android mode`;

```bash
yarn start:android
```

Remember in `src-capacitor` all the dependencies need to be installed.

### API entry point

change the API entry pont in `env` file

```env
VUE_APP_API_DEV=http://localhost/sheiley_shop_api
VUE_APP_API_PRO=https://example.com/sheiley_shop_api
```

:tada: This is all you need to test it in your local environment!

## Frontend production


If you hosted the app in subdirectory go to `vue.config.js` and set the subdirectory name in `publicPath` property 

---

## Backend

The REST API is made in PHP so a server with PHP 7.1 or higher is required.

```bash
$ git clone https://github.com/itsalb3rt/sheiley-shop-api.git
```

```bash
$ composer require itsalb3rt/sheiley-shop-api
```

### Database

Inside the *root* directory of the REST API enter `etc/sheiley_shop.sql` this file contains all the script from the database.

After executing the script in the Mysql database, it remains to enter the directory `config/config.php.ini` and set user database, username and password.

```ini
<?php return; ?>
; Database config
host=localhost
user=root
pass=toor
dbname=sheiley_shop
driver=mysql
charset=utf8
collation=utf8mb4_unicode_ci
prefix=""
port=""
```

### Backend production

In the `system/webroot/` directory you will find a file named `FrontController.php` inside this you must modify the constant `ENVIROMENT` and put the value `pro`.

---

## Docker

Remember set the `.env` file vars before.

```bash
$ docker-compose up -d
```

### Extra

Inside the `etc` directory of the [API REST repository](https://github.com/itsalb3rt/sheiley-shop-api)
You will find the entity relationship diagram created in `starUML` and the prototype created in` Adobe XD`, you can play with this.
