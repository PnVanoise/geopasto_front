<template>
  <form @submit.prevent="submitForm">
    <!-- Add your form fields here -->
    <div
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: stretch;
      "
    >
      <div style="">
        <div class="form-cell">
          <label for="code_up">Code UP:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="code_up"
            v-model="form.properties.code_up"
            required
          />
        </div>
        <div class="form-cell">
          <label for="nom_up">Nom UP:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="nom_up"
            v-model="form.properties.nom_up"
            required
          />
        </div>
        <div class="form-cell">
          <label for="annee_version">Année version:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="annee_version"
            v-model="form.properties.annee_version"
            required
          />
        </div>
        <div class="form-cell">
          <label for="active">Version active ?</label>
          <input type="checkbox" id="active" v-model="form.properties.version_active" />
        </div>
        <!-- <div class="form-cell">
          <label for="proprietaire">Propriétaire :</label>
          <select
            class="w3-input w3-border"
            v-model="form.properties.proprietaire"
            id="proprietaire"
          >
            <option
              v-for="proprietaire in proprietaires"
              :key="proprietaire.id_proprietaire"
              :value="proprietaire.id_proprietaire"
            >
              {{ proprietaire.nom_propr }} {{ proprietaire.prenom_propr }}
            </option>
          </select>
        </div> -->
        <!-- Test grille 1 -->
        <div class="grid-container">
          <label>Situations :</label>
          <Grid
            :data="situationExploitations"
            :columns="situGridColumns"
            :bgColor="'#f7ba0b'"
            :columnLabels="situColumnLabels"
            @edit="situOnEdit"
            @delete="situOnDelete"
          >
          </Grid>
          <button type="button" @click="goToAddSituation" class="w3-button w3-blue">
            Nouvelle situation d'exploitation
          </button>
        </div>

        <div class="grid-container">
          <label>Quartiers :</label>
          <Grid
            :data="quartiers"
            :columns="quarGridColumns"
            :bgColor="'#f7ba0b'"
            :columnLabels="quarColumnLabels"
            @edit="quarOnEdit"
            @delete="quarOnDelete"
          >
          </Grid>
          <button type="button" @click="goToAddQuartier" class="w3-button w3-blue">
            Nouveau quartier
          </button>
          <button type="button" @click="goToQuartiersList" class="w3-button w3-blue">
            Voir les quartiers de l'UP
          </button>
        </div>

        <!-- <div class="grid-container">
          <label>Propriétaires :</label>
          <Grid
            :data="proprietaires"
            :columns="proprGridColumns"
            :bgColor="'#f7ba0b'"
            :columnLabels="proprColumnLabels"
            @edit="proprOnEdit"
            @delete="proprOnDelete"
          >
          </Grid>
          <button type="button" @click="goToAddProprio" class="w3-button w3-blue">
            Nouveau propriétaire
          </button>
        </div> -->

        <!-- next id is readonly -->
        <div v-if="!isEdit" class="form-cell">
          (Next ID:
          {{ nextId }}
          )
        </div>
        <br />
      </div>
      <div style="">
        <div class="form-cell">
          Géométrie:
          <MapEditMultipolygon2
            :key="form.geometry.coordinates"
            v-model="form.geometry"
            :geometryType="'MultiPolygon'"
          />
        </div>
      </div>
    </div>
    <button type="submit">Enregistrer</button>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

import auth from "../../auth";

import config from "../../config";
import MapEditMultipolygon2 from "./MapEditMultipolygon2.vue";
import Grid from "./Grid.vue";

const props = defineProps({
  initialForm: Object,
  isEdit: Boolean,
  onSubmit: Function,
});

const situGridColumns = ref(["id_situation", "nom_situation", "situation_active"]);
const situColumnLabels = ref({
  id_situation: "ID",
  nom_situation: "Nom",
  situation_active: "Active ?",
});

const quarGridColumns = ref(["id", "code_quartier", "nom_quartier"]);
const quarColumnLabels = ref({
  id: "ID",
  code_quartier: "Code",
  nom_quartier: "Nom",
});

// const proprietaires = ref([]);
const situationExploitations = ref([]);
const quartiers = ref([]);

const goToAddSituation = () => {
  // Utilisation de l'ID de l'UP pour la navigation
  if (form.value.id) {
    console.log("form.value.id : ", form.value.id);
    router.push({
      name: "addSituationWithUPId",
      params: { UPId: form.value.id },
    });
  } else {
    console.warn("L'ID de l'UP n'est pas défini !");
  }
};

const goToAddQuartier = () => {
  // Utilisation de l'ID de l'UP pour la navigation
  if (form.value.id) {
    console.log("form.value.id : ", form.value.id);
    router.push({
      name: "addQuartierWithUPId",
      params: { UPId: form.value.id },
    });
  } else {
    console.warn("L'ID de l'UP n'est pas défini !");
  }
};

const fetchSituations = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/situationExploitation/?id_up=${form.value.id}`)
    .then((response) => {
      situationExploitations.value = response.data;
      console.log("list response data:", response.data);
      console.log("situationExploitation.value:", situationExploitations.value);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      //isLoading.value = false;
      console.log("fetchSituations done");
    });
};

const fetchQuartiers = () => {
  console.log(`${config.API_BASE_URL}/api/quartierPasto/?up_id=${form.value.id}`);
  // transformer en features
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/quartierPasto/?up_id=${form.value.id}`)
    .then((response) => {
      const data = response.data;
      console.log("list response data:", response.data);
      console.log("fetchQuartiers.value:", quartiers.value);

      if (data.type === "FeatureCollection") {
        // Transformer les features en tableau
        quartiers.value = data.features.map((feature) => {
          return {
            ...feature.properties, // Ajoute toutes les propriétés
            id: feature.id, // Ajoute l'id
          };
        });
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      //isLoading.value = false;
      console.log("fetchQuartiers done");
    });
};

const form = ref({ ...props.initialForm });

const router = useRouter();

// Variable pour stocker le nextId
const nextId = ref(null);

const goToQuartiersList = () => {
  // Utilisation de l'ID de l'UP pour la navigation
  if (form.value.id) {
    router.push(`/QuartierPastos/${form.value.id}`);
  } else {
    console.warn("L'ID de l'UP n'est pas défini !");
  }
};

const submitForm = () => {
  console.log("Form submitted with:", form.value);

  if (!props.isEdit) {
    form.value.id = nextId.value;
  }

  props
    .onSubmit(form.value)
    .then(() => {
      console.log("Form submission then block executed");
    })
    .catch((error) => {
      console.error("There was an error in form submission!", error);
    });
};

onMounted(() => {
  console.log("Form mounted with geometry:", form.value.geometry);

  // Récupére le prochain ID si on est en mode création uniquement
  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/unitePastorale/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id = nextId.value;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }
});

watch(
  () => props.initialForm,
  (newForm) => {
    form.value = { ...newForm };
  },
  { deep: true }
);

watch(
  () => form.value.id,
  (newId) => {
    if (newId) {
      fetchSituations();
      fetchQuartiers();
    }
  }
);

// Méthode pour gérer l'édition
function situOnEdit(entry) {
  console.log("Éditer:", entry.id_situation);
  router.push(`/SituationExploitation/edit/${entry.id_situation}`);
}

// Méthode pour gérer la suppression
function situOnDelete(entry) {
  console.log("Supprimer:", entry.id_situation);
  deleteSituation(entry.id_situation);
}

const deleteSituation = (id) => {
  auth.axiosInstance
    .delete(`${config.API_BASE_URL}/api/situationExploitation/${id}/`)
    .then((response) => {
      fetchSituations();
      mainStore.setSuccessMessage("Situation d'exploitation supprimée!");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};

// Méthode pour gérer l'édition
function quarOnEdit(entry) {
  console.log("Éditer:", entry.id_quartier);
  router.push(`/QuartierPasto/edit/${entry.id_quartier}`);
}

// Méthode pour gérer la suppression
function quarOnDelete(entry) {
  console.log("Supprimer:", entry.id_quartier);
  deleteQuartier(entry.id_quartier);
}

const deleteQuartier = (id) => {
  auth.axiosInstance
    .delete(`${config.API_BASE_URL}/api/quar/${id}/`)
    .then((response) => {
      fetchSituations();
      mainStore.setSuccessMessage("Situation d'exploitation supprimée!");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};
</script>

<style scoped>
.form-ligne {
  padding: 8px;
}

.form-cell {
  padding: 8px;
}

.grid-container {
  border-radius: 5px; /* Arrondi des coins de la grille */
  overflow: hidden; /* Assure que le contenu s'adapte à l'arrondi */
}
</style>
