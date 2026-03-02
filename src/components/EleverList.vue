<template>
  <div v-if="isLoading" class="w3-center">
    <img src="/spinner_2.gif" />
  </div>
  <div v-else class="main-container-one">
    <div class="main-item">
      <div class="w3-container">
        <h2 class="w3-center">Liste des cheptels</h2>
      </div>
      <div v-if="elevers">
        <div class="header-actions">
          <form id="search" class="search-form">
            Rechercher <input name="query" v-model="searchQuery" />
          </form>
          <div class="year-filter">
            <input type="checkbox" id="thisYear" v-model="filterThisYear" />
            <label for="thisYear">Année en cours</label>
          </div>
          <span class="w3-button add-up" @click="goToAddPage">
            <font-awesome-icon icon="plus" /> Ajouter un cheptel
          </span>
        </div>
        <div class="grid-container">
          <Grid :data="eleversWithTypeDesc" :columns="gridColumns" :filter-key="searchQuery" :bgColor="'#f7ba0b'"
            :columnLabels="columnLabels" @edit="onEdit" @view="onView" @delete="onDelete">
          </Grid>
        </div>
      </div>
      <div v-else>Aucune donnée disponible.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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
  "nom_complet_eleveur",
  "nom_up",
  "annee",
  "type_description",
  "nombre_animaux",
]);
const columnLabels = ref({
  nom_complet_eleveur: "Eleveur",
  nom_up: "UP",
  annee: "Année",
  type_description: "Type de cheptel",
  nombre_animaux: "Nombre d'animaux",
});
const filterThisYear = ref(false);

const eleversWithTypeDesc = computed(() => {
  const currentYear = new Date().getFullYear();

  let list = features.value;

  // Filtre année en cours
  if (filterThisYear.value) {
    list = list.filter(exp => {
      if (!exp.date_debut) return false;
      const year = new Date(exp.date_debut).getFullYear();
      return year === currentYear;
    });
  }

  return list.map(exp => {
    const tmpNom = exp.eleveur_detail?.nom_eleveur || "";
    const tmpPre = exp.eleveur_detail?.prenom_eleveur || "";
    let eleFullName = tmpNom && tmpPre ? tmpNom + " " + tmpPre : (tmpNom || tmpPre || "Information non disponible");

    const tmpNomUP = exp.situation_detail?.unite_pastorale_detail?.nom_up || "";
    const tmpAnnee = !exp.date_debut ? "" :
      isNaN(new Date(exp.date_debut)) ? "" :
        new Date(exp.date_debut).getFullYear();

    return {
      ...exp,
      nom_up: tmpNomUP,
      annee: tmpAnnee,
      type_description: exp.type_cheptel_detail?.description || "",
      nom_complet_eleveur: eleFullName,
    };
  });
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

function onView(entry) {
  console.log("View:", entry);
  console.log("Navigating to readonly view for", entry.id_elever);
  router.push({
    path: `/Elever/edit/${entry.id_elever}`,
    query: { readonly: 'true' }
  });
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
.year-filter {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 20px;
}

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
