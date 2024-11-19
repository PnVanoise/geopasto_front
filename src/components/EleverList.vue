<template>
  <div v-if="isLoading" class="w3-center">
    <img src="/spinner_2.gif" />
  </div>
  <div v-else class="main-container-one">
    <div class="main-item">
      <div class="w3-container">
        <h2 class="w3-center">Liste des troupeaux - éleveurs</h2>
      </div>
      <div v-if="elevers">
        <div class="header-actions">
          <form id="search" class="search-form">
            Rechercher <input name="query" v-model="searchQuery" />
          </form>
          <span class="w3-button add-up" @click="goToAddPage">
            <font-awesome-icon icon="plus" /> Ajouter un troupeau - éleveur
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

const elevers = ref([]);
const features = ref([]); // Données pour la grille (à plat : id et properties)

const isLoading = ref(true);
const router = useRouter();
const mainStore = useMainStore();

const searchQuery = ref("");
const gridColumns = ref([
  "situation_nom",
  "eleveur_prenom",
  "eleveur_nom",
  "type_cheptel_description",
  "nombre_animaux",
]);
const columnLabels = ref({
  situation_nom: "Situation",
  eleveur_prenom: "Prénom Eleveur",
  eleveur_nom: "Nom Eleveur",
  type_cheptel_description: "Type de cheptel",
  nombre_animaux: "Nombre d'animaux",
});

const fetchElevers = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/elever/`)
    .then((response) => {
      elevers.value = response.data;
      console.log("list response data:", response.data);
      console.log("elevers.value:", elevers.value);

      features.value = elevers.value.map((elever) => {
        return {
          ...elever, // Ajoute toutes les propriétés de l'objet elever
        };
      });
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      isLoading.value = false;
      console.log("fetchElevers done");
    });
};

const goToAddPage = () => {
  console.log("Ajouter un troupeau - éleveur.");
  router.push("/Elever/add");
};

// Méthode pour gérer l'édition
function onEdit(entry) {
  console.log("Éditer:", entry);
  router.push(`/Elever/edit/${entry.id_elever}`);
}

// Méthode pour gérer la suppression
function onDelete(entry) {
  console.log("Supprimer:", entry.id_elever);
  deleteElever(entry.id_elever);
}

const deleteElever = (id) => {
  auth.axiosInstance
    .delete(`${config.API_BASE_URL}/api/elever/${id}/`)
    .then((response) => {
      fetchElevers();
      mainStore.setSuccessMessage("Troupeau - Eleveur supprimé!");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};

onMounted(fetchElevers);
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
