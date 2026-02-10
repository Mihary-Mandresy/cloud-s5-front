<template>
  <div class="marker-popup">
    <h4 class="title">{{ point.titre }}</h4>

    <div class="row">
      <Icon width="24" icon="mdi:calendar" />
      <span>{{ formatDate(point.date_creation) }}</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:progress-check" />
      <span :class="['status', getStatusClass(point.statut)]">
        {{ getStatusLabel(point.statut) }}
      </span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:ruler-square" />
      <span>{{ parseFloat(point.surface_m2).toFixed(2) }} m²</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:cash" />
      <span>{{ parseFloat(point.budget).toLocaleString('fr-FR') }} Ar</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:domain" />
      <span>{{ point.entreprise_responsable }}</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:progress-clock" />
      <span>{{ parseFloat(point.avancement).toFixed(1) }}% avancement</span>
    </div>

    <div class="description" v-if="point.description">
      <p>{{ point.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"

const props = defineProps({
  point: {
    type: Object,
    required: true
  }
})

// Mapping du statut numérique vers label texte
const getStatusLabel = (statut) => {
  const statusMap = {
    1: "Nouveau",
    2: "En cours",
    3: "Terminé"
  }
  return statusMap[statut] || "Inconnu"
}

// Mapping du statut numérique vers classe CSS
const getStatusClass = (statut) => {
  const statusMap = {
    1: "nouveau",
    2: "en_cours",
    3: "terminé"
  }  
  return statusMap[statut] || "inconnu"
}

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

console.log("MarkerPopup point:", props.point)
</script>


<style scoped lang="scss">


.marker-popup {
  font-size: 13px;
  padding: 16px;
  width: 250px;

  & > * {
    text-wrap: wrap;
  }

  .title {
    margin-bottom: 24px;
    font-size: 25px;
    text-align: center;
    font-weight: 600;
    line-height: 1.2;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 8px;
    width: 300px !important;

    .iconify {
      font-size: 16px;
      color: #6b7280;
    }
  }

  .status {
    font-weight: 600;

    &.nouveau {
      color: red;
    }

    &.en_cours {
      color: #f59e0b;
    }

    &.terminé {
      color: #16a34a;
    }
  }
}
</style>