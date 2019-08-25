<template>
  <div class="offline-information-container">
    <div class="offline-header">
         <font-awesome-icon icon="wifi"/>
         {{ $t('messages.internet_conection_lost') }}
         </div>
    <div class="offline-body">
        {{ $t('messages.intenet_required') }}
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