<template>
  <div class="visiteur">
    <div id="map"></div>
    <legende />
    <TableauComparatif />
  </div>
</template>

<script setup>
import { onMounted, createApp } from "vue"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import TableauComparatif from "./TableauComparatif.vue"
import MarkerPopup from "./MarkerPopup.vue"
import Legende from "./Legende.vue"

const points = [
  {
    name: "Analakely",
    coords: [47.5146, -18.9084],
    date: "2025-01-12",
    status: "nouveau",
    surface: 1200,
    budget: 45000000,
    entreprise: "ENTREPRISE A"
  },
  {
    name: "Ivandry",
    coords: [47.5342, -18.8679],
    date: "2024-11-03",
    status: "en_cours",
    surface: 800,
    budget: 32000000,
    entreprise: "ENTREPRISE B"
  },
  {
    name: "Ankorondrano",
    coords: [47.5169, -18.8765],
    date: "2024-06-18",
    status: "terminé",
    surface: 1500,
    budget: 70000000,
    entreprise: "ENTREPRISE C"
  }
]

onMounted(() => {
  const map = new maplibregl.Map({
    container: "map",
    style: "http://localhost:3000/styles/basic-preview/style.json",
    center: [47.5079, -18.8792],
    zoom: 12
  })

  map.on("load", () => {
    points.forEach(p => {
      // 🔴 Marker
      const el = document.createElement("div")
      el.className = `marker status-${p.status}`

      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="marker-svg" viewBox="0 0 24 24">
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
        </svg>
      `

      new maplibregl.Marker({ element: el })
        .setLngLat(p.coords)
        .addTo(map)

      // Popup
      const popupContainer = document.createElement("div")
      createApp(MarkerPopup, { point: p }).mount(popupContainer)

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25
      }).setDOMContent(popupContainer)

      el.addEventListener("mouseenter", () => {
        popup.setLngLat(p.coords).addTo(map)
      })

      el.addEventListener("mouseleave", () => {
        popup.remove()
      })
    })
  })
})
</script>

<style lang="scss">
.visiteur {
  padding-top: $header-heigth;

  #map {
    width: 100%;
    height: calc(100vh - $header-heigth);
  }
}

.marker {
  cursor: pointer;

  &:hover {
    transform: scale(1.15);
  }

  &-svg {
    width: 38px;
    height: 38px;
  }
}

//  Couleur status
.status-nouveau {
  color: red;
}

.status-en_cours {
  color: #f59e0b;
}

.status-terminé {
  color: #16a34a;
}
</style>
