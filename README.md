# Sheiley Shop 
<div>
<img src="https://user-images.githubusercontent.com/3104648/28351989-7f68389e-6c4b-11e7-9bf2-e9fcd4977e7a.png" width="50" style="display: inline"/>
|
<img src="https://user-images.githubusercontent.com/35310226/177658962-85477241-4bf2-4647-9f30-7afa3ec3bc18.png" width="130" style="display: inline"/>
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
yarn serve:android
```

After the command is runny, the android studio will open and you can see the app in the emulator.

![](https://capacitorjs.com/assets/img/docs/android/running.png)

**Build**

```bash
yarn build:android
```

Run the following command in the `Android Studio` console, make a sure the terminal is in `src-capacitor/android` dir:

```
gradlew :app:bundleRelease
```

Now the **aab** file is on `src-capacitor\android\app\build\outputs\bundle\release`

Sign the **aab** file

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./secret/release-key.keystore ./src-capacitor/android/app/build/outputs/bundle/release/app-release.aab sheiley_shop_app
```

Enter the **Passpharese** for the keystore:

and now the **aab** file is ready to lunch in the store. :confetti_ball:

## IOS

To run app in `IOS mode`;

```bash
yarn serve:ios
```

After the command is runny, the xcode will open and you can see the app in the emulator.

![](https://capacitorjs.com/assets/img/docs/ios/running.png)

**Build**

```bash
yarn build:ios
```

Remember in `src-capacitor` all the dependencies need to be installed.

After build is complete and the xcode is open, you need create archive from the app:

- Select the device, Any iOS Device

![](./docs/ios-device-selection.png)


- Go to Product -> Archive

![](./docs/ios-create-archive.png)

Now you get a archivo for distribution.

![](./docs/archives.png)

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

Go to API repository [https://github.com/itsalb3rt/sheiley-shop-api](https://github.com/itsalb3rt/sheiley-shop-api)
