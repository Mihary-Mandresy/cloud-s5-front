<template>
  <div class="visiteur">
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

onMounted(async () => {
  const map = new maplibregl.Map({
    container: "map",
    style: "http://localhost:3000/styles/basic-preview/style.json",
    center: [47.5079, -18.8792],
    zoom: 12
  })

})
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 100vh;
}

.marker {
  cursor: pointer;
  transform: translate(-50%, -100%);
}
</style>