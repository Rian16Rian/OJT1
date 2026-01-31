<template>
  <main class="app-container">

<header class="header">

  <img src="/food-logo.png" class="logo" />

  <div class="title-group">

    <h1 class="brand-title">
      <span class="brand-accent">FIL</span>-Food
    </h1>
    
    <p class="brand-subtitle">
      Food is life.
    </p>
    
  </div>

</header>

    <FoodQueue />
  </main>

</template>

<script setup>
import FoodQueue from './components/FoodQueue.vue'
</script>
