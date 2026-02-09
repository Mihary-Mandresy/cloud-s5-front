<template>
  <div class="marker-popup">
    <h4 class="title">{{ point.name }}</h4>

    <div class="row">
      <Icon width="24" icon="mdi:calendar" />
      <span>{{ point.date }}</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:progress-check" />
      <span :class="['status', point.status]">
        {{ point.status }}
      </span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:ruler-square" />
      <span>{{ point.surface }} m²</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:cash" />
      <span>{{ point.budget.toLocaleString() }} Ar</span>
    </div>

    <div class="row">
      <Icon width="24" icon="mdi:domain" />
      <span>{{ point.entreprise }}</span>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"

defineProps({
  point: {
    type: Object,
    required: true
  }
})
</script>


<style scoped lang="scss">


.marker-popup {
  font-size: 13px;
  padding: 16px;
  width: 400px;

  .title {
    margin-bottom: 24px;
    font-size: 25px;
    font-weight: 600;
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