<template>
  <div class="manager-container">
    <div class="signalements-page">

      <!-- ===== Mode d'affichage ===== -->
      <div class="view-toggle">
        <button class="view-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">
          <Icon icon="mdi:table" class="icon" />
          Tableau
        </button>
        <button class="view-btn" :class="{ active: viewMode === 'cards' }" @click="viewMode = 'cards'">
          <Icon icon="mdi:view-grid" class="icon" />
          Cartes
        </button>
      </div>

      <!-- ===== Filtres ===== -->
      <div class="filters-section">
        <div class="filter-group">
          <div class="input-with-icon">
            <Icon icon="mdi:magnify" class="icon" />
            <input class="filter-input" v-model="filterText" placeholder="Rechercher..." />
          </div>
        </div>

        <div class="filter-group">
          <div class="input-with-icon">
            <Icon icon="mdi:filter" class="icon" />
            <select class="filter-select" v-model="filterStatus">
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn-apply">
            <Icon icon="mdi:check" class="icon" />
            Appliquer
          </button>
          <button class="btn-reset">
            <Icon icon="mdi:refresh" class="icon" />
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- ===== TABLE ===== -->
      <div class="table-section" v-if="viewMode === 'table'">
        <div class="table-container">
          <table class="signalements-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Titre</th>
                <th>Localisation</th>
                <th>Statut</th>
                <th>Budget</th>
                <th>Date</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="s in filteredSignalements" :key="s.id">
                <td>{{ s.id }}</td>

                <td>
                  <Icon icon="mdi:alert-circle-outline" class="icon text-primary" />
                  {{ s.titre }}
                </td>

                <td>
                  <Icon icon="mdi:map-marker" class="icon text-muted" />
                  <span>
                    {{ s.localisation }}
                  </span>
                </td>

                <td>
                  <span :class="['status-badge', s.statut]">
                    {{ getStatusText(s.statut) }}
                  </span>
                </td>

                <td class="text-right">
                  <Icon icon="mdi:currency-usd" class="icon text-success" />
                  <span class="budget-badge">
                    {{ s.budget }}
                  </span>
                </td>

                <td class="text-center">
                  <Icon icon="mdi:calendar-month" class="icon text-muted" />
                  <span>
                    {{ formatDate(s.date) }}
                  </span>
                </td>

                <td class="text-center">
                  <Icon icon="mdi:pencil-box" width="28" class="icon-action" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== CARDS ===== -->
      <div class="cards-section" v-if="viewMode === 'cards'">
        <div class="cards-grid">
          <div class="signalement-card" v-for="s in filteredSignalements" :key="s.id">

            <div class="card-header">
              <div class="cell-inline">
                <Icon icon="mdi:identifier" class="icon" />
                ID {{ s.id }}
              </div>

              <span :class="['status-badge', s.statut]">
                {{ getStatusText(s.statut) }}
              </span>
            </div>

            <h4 class="card-title">{{ s.titre }}</h4>

            <p class="cell-inline">
              <Icon icon="mdi:map-marker-outline" class="icon" />
              {{ s.localisation }}
            </p>

            <p class="cell-inline">
              <Icon icon="mdi:cash" class="icon" />
              {{ s.budget }}
            </p>

            <p class="cell-inline">
              <Icon icon="mdi:calendar" class="icon" />
              {{ formatDate(s.date) }}
            </p>

            <div class="card-actions">
              <select v-model="s.newStatus" @change="updateCardStatus(s)">
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const viewMode = ref('table')
const filterText = ref('')
const filterStatus = ref('')
const filterBudget = ref('')
const syncStatus = ref('idle')

const signalements = ref([
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    localisation: "123 Rue Principale, Paris",
    description: "Grand nid de poule causant des problèmes de circulation.",
    statut: "nouveau",
    budget: "1000 Ar",
    date: "2024-01-15",
    newStatus: "nouveau"
  },
  {
    id: 2,
    titre: "Éclairage public défectueux",
    localisation: "Avenue des Champs-Élysées",
    description: "Lampe publique hors service depuis plusieurs jours.",
    statut: "en_cours",
    budget: "1000 Ar",
    date: "2024-01-10",
    newStatus: "en_cours"
  },
  {
    id: 3,
    titre: "Graffiti sur mur public",
    localisation: "Place de la République",
    description: "Graffiti sur façade de bâtiment municipal.",
    statut: "termine",
    budget: "1000 Ar",
    date: "2024-01-05",
    newStatus: "termine"
  }
])

const filteredSignalements = computed(() => {
  return signalements.value.filter(s => {
    const matchesText = !filterText.value ||
      s.titre.toLowerCase().includes(filterText.value.toLowerCase()) ||
      s.localisation.toLowerCase().includes(filterText.value.toLowerCase())

    const matchesStatus = !filterStatus.value || s.statut === filterStatus.value
    const matchesBudget = !filterBudget.value || s.budget === filterBudget.value

    return matchesText && matchesStatus && matchesBudget
  })
})

onMounted(() => {
  if (route.query.status) {
    filterStatus.value = route.query.status
  }
})

const applyFilters = () => {
  // Les filtres sont déjà appliqués via computed
  console.log('Filtres appliqués')
}

const resetFilters = () => {
  filterText.value = ''
  filterStatus.value = ''
  filterBudget.value = ''
}

const viewSignalementDetails = (signalement) => {
  router.push({ name: 'SignalementDetails', params: { id: signalement.id } })
}

const updateCardStatus = (signalement) => {
  signalement.statut = signalement.newStatus
  console.log('Statut mis à jour:', signalement.statut)
}

const getStatusText = (status) => {
  const statusMap = {
    'nouveau': 'Nouveau',
    'en_cours': 'En cours',
    'termine': 'Terminé'
  }
  return statusMap[status] || status
}

const getBudgetText = (budget) => {
  const budgetMap = {
    'faible': '0-1000€',
    'moyen': '1001-5000€',
    'eleve': '5000€+'
  }
  return budgetMap[budget] || budget
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}
</script>

<style scoped lang="scss">
$primary: #3498db;
$success: #2ecc71;
$danger: #e74c3c;
$dark: #2c3e50;
$light: #f8f9fa;
$border: #ddd;
$shadow: 0 2px 10px rgba(0, 0, 0, 0.1);


.iconify {
  display: inline-block;
  // margin-top: -5px;
}

.manager-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.signalements-page {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: $shadow;
}

/* ===== Toggle ===== */
.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  .view-btn {
    padding: 10px 20px;
    background: #ecf0f1;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.active {
      background: $primary;
      color: white;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

/* ===== Filters ===== */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: $light;
  border-radius: 5px;

  .filter-group {
    flex: 1;
    min-width: 200px;
  }

  .filter-input,
  .filter-select {
    width: 100%;
    padding: 10px;
    border: 1px solid $border;
    border-radius: 5px;
  }

  .filter-actions {
    display: flex;
    gap: 10px;
    align-items: flex-end;

    button {
      padding: 10px 20px;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &.btn-apply {
        background: $success;
      }

      &.btn-reset {
        background: $danger;
      }
    }
  }
}

/* ===== Table ===== */
.table-container {
  overflow-x: auto;

  .signalements-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th {
      background: $dark;
      color: white;
      padding: 12px;
      text-align: left;
      vertical-align: middle;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid $border;

      &>svg {
        display: inline;
      }

      .action {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon {
        margin-right: 10px;
      }

    }

    tr:hover {
      background: $light;
    }
  }
}

/* ===== Badges ===== */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;

  &.nouveau {
    background-color: #ffeb3b;
    color: #333;
  }

  &.en_cours {
    background-color: #2196f3;
    color: white;
  }

  &.termine {
    background-color: #4caf50;
    color: white;
  }
}

.budget-badge {
  @extend .status-badge;
  text-transform: none;
}

/* ===== Buttons ===== */
.btn-view-details {
  padding: 8px 16px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

/* ===== Cards ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  .icon {
    margin-right: 10px;
  }

  .signalement-card {
    background: white;
    border: 1px solid $border;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .card-title {
      color: $dark;
      margin-bottom: 10px;
    }

    .card-content {
      p {
        margin-bottom: 8px;
        color: #7f8c8d;
      }
    }

    .card-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;

      select {
        flex: 1;
        padding: 8px;
        border: 1px solid $border;
        border-radius: 5px;
      }
    }
  }
}


.icon {
  font-size: 18px;
  opacity: 0.75;
}

.icon-action {
  cursor: pointer;
  color: #e74c3c;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
}

/* ===== INPUT AVEC ICON ===== */
.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    color: #7f8c8d;
  }
}

/* ===== COULEURS UTILITAIRES ===== */
.text-muted {
  color: #7f8c8d;
}

.text-primary {
  color: #3498db;
}

.text-success {
  color: #2ecc71;
}
</style>
