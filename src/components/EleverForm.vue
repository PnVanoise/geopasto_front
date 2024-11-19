<template>
  <form @submit.prevent="submitForm">
    <!-- Ligne 1 : Situation | Eleveur -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="situation">Situation:</label>
        <select
          class="w3-input w3-border"
          v-model="form.situation_exploitation"
          id="situation"
        >
          <option
            v-for="situation in situations"
            :key="situation.id_situation"
            :value="situation.id_situation"
          >
            {{ situation.nom_situation }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="eleveur">Eleveur:</label>
        <select class="w3-input w3-border" v-model="form.eleveur" id="berger">
          <option
            v-for="eleveur in eleveurs"
            :key="eleveur.id_eleveur"
            :value="eleveur.id_eleveur"
          >
            {{ eleveur.prenom_eleveur }} {{ eleveur.nom_eleveur }}
          </option>
        </select>
      </div>
    </div>
    <!-- Ligne 1 : Type cheptel | Nombre -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="typeCheptel">Type de cheptel:</label>
        <select class="w3-input w3-border" v-model="form.type_cheptel" id="type_cheptel">
          <option
            v-for="typeC in typeCs"
            :key="typeC.id_type_cheptel"
            :value="typeC.id_type_cheptel"
          >
            {{ typeC.description }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="eleveur">Nombre d'animaux:</label>
        <input class="w3-input w3-border" type="number" id="nombre"
        v-model="form.nombre_animaux"
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="dateDebut">Date de début:</label>
        <input
          class="w3-input w3-border"
          type="date"
          id="dateDebut"
          v-model="form.date_debut"
          @keydown.prevent
          @paste.prevent
        />
      </div>
      <div class="w3-half form-cell">
        <label for="dateFin">Date de fin:</label>
        <input
          class="w3-input w3-border"
          type="date"
          id="dateFin"
          v-model="form.date_fin"
          @keydown.prevent
          @paste.prevent
        />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <!-- next id pour debug -->
      <div v-if="!isEdit" class="form-cell">
        (Next ID:
        {{ nextId }}
        )
      </div>
      <button type="submit">Enregistrer</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

import config from "../../config";
import auth from "../../auth";

const props = defineProps({
  initialForm: Object,
  isEdit: Boolean,
  onSubmit: Function,
});

const situations = ref([]);
const eleveurs = ref([]);
const typeCs = ref([]);

const form = ref({ ...props.initialForm });

// Variable pour stocker le nextId
const nextId = ref(null);

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

watch(
  () => props.initialForm,
  (newForm) => {
    form.value = { ...newForm };
  },
  { deep: true }
);

// Hooks de cycle de vie pour déboguer
onMounted(() => {
  console.log("EleverForm component mounted");

  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/elever/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id_elever = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }

  // Récupère les situations
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/situationExploitation/`)
    .then((response) => {
      situations.value = response.data;
      console.log("situations:", situations.value);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des situations d'exploitation.",
        error
      );
    });

  // Récupère les bergers
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/eleveur/`)
    .then((response) => {
      eleveurs.value = response.data;
      console.log("eleveur:", eleveurs.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des éleveurs.", error);
    });

  // Récupère les types de cheptel
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeCheptel/`)
    .then((response) => {
      typeCs.value = response.data;
      console.log("typeCs:", typeCs.value);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des types de cheptel.",
        error
      );
    });
});

onBeforeUnmount(() => {
  console.log("GardeTroupeauForm component before unmount");
});
</script>

<style scoped>
.form-ligne {
  padding: 8px;
}

.form-cell {
  padding: 8px;
}
</style>
