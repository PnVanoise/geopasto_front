<template>
  <div v-if="isLoading" class="w3-center">
    <img src="/spinner_2.gif" />
  </div>
  <div v-else class="main-container-one">
    <div class="main-item">
      <div class="w3-container">
        <h2 class="w3-center">Liste des gardes de troupeau</h2>
      </div>
      <div v-if="gardes">
        <div class="header-actions">
          <form id="search" class="search-form">
            Rechercher <input name="query" v-model="searchQuery" />
          </form>
          <span class="w3-button add-up" @click="goToAddPage">
            <font-awesome-icon icon="plus" /> Ajouter une garde
          </span>
        </div>
        <div class="grid-container">
          <Grid
            :data="features"
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

import config from "../../config";
import { useMainStore } from "../store";

import Grid from "./Grid.vue";

const gardes = ref([]);
const features = ref([]); // Données pour la grille (à plat : id et properties)

const isLoading = ref(true);
const router = useRouter();
const mainStore = useMainStore();

const searchQuery = ref("");
const gridColumns = ref(["situation_nom", "berger_nom", "berger_prenom"]);
const columnLabels = ref({
  situation_nom: "Situation",
  berger_nom: "Nom Berger",
  berger_prenom: "Prénom Berger",
});

const fetchGardes = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/gardeSituation/`)
    .then((response) => {
      gardes.value = response.data;
      console.log("list response data:", response.data);
      console.log("gardesituation.value:", gardes.value);

      features.value = gardes.value.map((garde) => {
        return {
          ...garde, // Ajoute toutes les propriétés de l'objet garde
          id: garde.id, // Assure que l'ID est bien présent
        };
      });
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      isLoading.value = false;
      console.log("fetchGardes done");
    });
};

const goToAddPage = () => {
  console.log("Ajouter une garde");
  router.push("/GardeTroupeau/add");
};

// Méthode pour gérer l'édition
function onEdit(entry) {
  console.log("Éditer:", entry);
  router.push(`/GardeTroupeau/edit/${entry.id_garde_situation}`);
}

// Méthode pour gérer la suppression
function onDelete(entry) {
  console.log("Supprimer:", entry.id_garde_situation);
  deleteGarde(entry.id_garde_situation);
}

const deleteGarde = (id) => {
  auth.axiosInstance
    .delete(`${config.API_BASE_URL}/api/gardeSituation/${id}/`)
    .then((response) => {
      fetchGardes();
      mainStore.setSuccessMessage("Garde supprimée!");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};

onMounted(fetchGardes);
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
  border-radius: 5px;
  /* Arrondi des coins de la grille */
  overflow: hidden;
  /* Assure que le contenu s'adapte à l'arrondi */
}

/* Ajoutez vos styles ici */
</style>
