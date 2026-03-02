<template>
  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="abri">Abri d'urgence:</label>
        <select class="w3-input w3-border" v-model="form.abri_urgence" id="abri" :disabled="isView">
          <option v-for="abri in abris" :key="abri.id_abri_urgence" :value="abri.id_abri_urgence">
            {{ abri.description }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="commodite">Commodité:</label>
        <select class="w3-input w3-border" v-model="form.commodite" id="commodite" :disabled="isView">
          <option
            v-for="commodite in commodites"
            :key="commodite.id_commodite"
            :value="commodite.id_commodite"
          >
            {{ commodite.description }}
          </option>
        </select>
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="etat">Etat:</label>
        <input class="w3-input w3-border" type="text" id="etat" v-model="form.etat" :disabled="isView" />
      </div>
      <div class="w3-half form-cell">
        <label for="quantite">Quantité:</label>
        <input
          class="w3-input w3-border"
          type="number"
          id="quantite"
          v-model.number="form.quantite"
          required
          :disabled="isView"
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
          :disabled="isView"
        />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div v-if="isAdding" class="form-cell">(Next ID: {{ nextId }})</div>
      <button v-if="isEditable" type="submit">Enregistrer</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";

import config from "../../config";
import auth from "../../auth";

const props = defineProps({
  initialForm: Object,
  isEdit: Boolean,
  mode: String,
  onSubmit: Function,
  abriId: String,
});

// Prefer explicit `mode` when provided; fall back to `isEdit` for backward compatibility
const isAdding = computed(() => props.mode === "add");
const isEditing = computed(() => props.mode === "change" || props.mode === "edit");
const isView = computed(() => props.mode === "view");
const isEditable = computed(() => isAdding.value || isEditing.value || (props.mode === undefined && props.isEdit === true));

const abris = ref([]);
const commodites = ref([]);

const form = ref({ ...props.initialForm });

// Variable pour stocker le nextId
const nextId = ref(null);

const submitForm = () => {
  console.log("Abri commodité submit:", form.value);

  if (!isEditing.value) {
    // set id if needed by API (server may assign)
    // form.value.id = nextId.value;
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
    if (props.abriId) {
      form.value.abri_urgence = props.abriId;
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (isAdding.value) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/abriDUrgenceCommodite/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id_abri_urgence_commodite = nextId.value;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }

  // Récupère les abris
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/abriDUrgence/`)
    .then((response) => {
      abris.value = response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des abris.", error);
    });

  // Récupère les commodités
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/commodite/`)
    .then((response) => {
      commodites.value = response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des commodites.", error);
    });
});

onBeforeUnmount(() => {
  console.log("AbriDUrgenceCommoditeForm component before unmount");
});
</script>

<style scoped>
.form-ligne { padding: 8px; }
.form-cell { padding: 8px; }
</style>
