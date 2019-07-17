<template>
  <div class="offline-information-container">
    <div class="offline-header">
         <font-awesome-icon icon="wifi"/>
         ¡No tenemos conexión a internet!
         </div>
    <div class="offline-body">
        Debes tener conexión a internet para realizar esta acción...
    </div>
  </div>
</template>

<style>
.offline-information-container{
    margin-top: 40%;
    text-align: center;
}
.offline-header {
  font-size: 30px;
  color: var(--grey);
}

.offline-body{
    margin-top: 5%;
}
</style>