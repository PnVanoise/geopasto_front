<template>
  <div v-if="isLoading" class="w3-center">
    <img src="/spinner_2.gif" />
  </div>
  <div v-else class="main-container-one">
    <div class="main-item">
      <div class="w3-container">
        <h2 class="w3-center">Liste des types d'événement</h2>
      </div>
      <div v-if="typeEvenements">
        <div class="header-actions">
          <form id="search" class="search-form">
            Rechercher <input name="query" v-model="searchQuery" />
          </form>
          <span class="w3-button add-up" @click="goToAddPage">
            <font-awesome-icon icon="plus" /> Ajouter un Type d'événement
          </span>
        </div>
        <div class="grid-container">
          <Grid
            :data="typeEvenements"
            :columns="gridColumns"
            :filter-key="searchQuery"
            :bgColor="'#f7ba0b'"
            :columnLabels="columnLabels"
            @edit="onEdit"
            @delete="onDelete"
          >
          </Grid>
        </div>
      </div>
      <div v-else>Aucune donnée disponible.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import auth from "../../auth";
import Grid from "./Grid.vue";
import config from "../../config";
import { useMainStore } from "../store";

const typeEvenements = ref([]);

const isLoading = ref(true);
const router = useRouter();
const mainStore = useMainStore();

const searchQuery = ref("");
const gridColumns = ref(["id_type_evenement", "description"]);
const columnLabels = ref({
  id_type_evenement: "ID",
  description: "Desc.",
});

const fetchTypeEvts = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeEvenement/`)
    .then((response) => {
      typeEvenements.value = response.data;
      console.log("list response data:", response.data);
      console.log("typeEvenements.value:", typeEvenements.value);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      isLoading.value = false;
      console.log("fetchTypeEvts done");
    });
};

const goToAddPage = () => {
  console.log("Ajouter");
  router.push("/TypeEvenement/add");
};

// Méthode pour gérer l'édition
function onEdit(entry) {
  console.log("Éditer:", entry.id_type_evenement);
  router.push(`/TypeEvenement/edit/${entry.id_type_evenement}`);
}

// Méthode pour gérer la suppression
function onDelete(entry) {
  console.log("Supprimer:", entry.id_type_evenement);
  deleteTypeEvt(entry.id_type_evenement);
}

// const editTypeEqpt = (id) => {
//   router.push(`/TypeEquipementAlpage/edit/${id}`);
// };

const deleteTypeEvt = (id) => {
  auth.axiosInstance
    .delete(`${config.API_BASE_URL}/api/typeEvenement/${id}/`)
    .then((response) => {
      fetchTypeEvts();
      mainStore.setSuccessMessage("Type d'événement' supprimé!");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};

onMounted(fetchTypeEvts);
</script>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
}

.loading-image {
  margin-right: 10px;
}

.main-container-one {
  display: grid;
  grid-template-columns: 100%;
}

.main-container {
  display: grid;
  grid-template-columns: 50% 50%;
}

.main-item {
  padding: 20px;
  margin: 10px;
  text-align: center;
}

/* Style pour aligner le formulaire de recherche et le bouton d'ajout */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  max-height: 30px;
}

/* Style pour le formulaire de recherche */
.search-form {
  display: inline-block;
}

/* Style pour le bouton d'ajout */
.add-up {
  background-color: #bdc3c7;
  color: 2c3e50;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
}

.add-up:hover {
  background-color: #aab2b7;
}

/* Style pour l'input de recherche */
#search input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.grid-container {
  border-radius: 5px; /* Arrondi des coins de la grille */
  overflow: hidden; /* Assure que le contenu s'adapte à l'arrondi */
}
/* Ajoutez vos styles ici */
</style>
