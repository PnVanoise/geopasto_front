<template>
  <form @submit.prevent="submitForm">
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
        <label for="berger">Berger:</label>
        <select class="w3-input w3-border" v-model="form.berger" id="berger">
          <option
            v-for="berger in bergers"
            :key="berger.id_berger"
            :value="berger.id_berger"
          >
            {{ berger.prenom_berger }} {{ berger.nom_berger }}
          </option>
        </select>
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
      <div class="form-cell">
        <label for="commentaire">Commentaire:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="commentaire"
          v-model="form.commentaire"
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
const bergers = ref([]);

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
  console.log("GardeTroupeauForm component mounted");

  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/gardeSituation/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id_garde_situation = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
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
    .get(`${config.API_BASE_URL}/api/berger/`)
    .then((response) => {
      bergers.value = response.data;
      console.log("bergers:", bergers.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des bergers.", error);
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
