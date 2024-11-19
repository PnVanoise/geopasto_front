<template>
  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="desc">Description:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="desc"
          v-model="form.description"
          required
        />
      </div>
      <div class="w3-half form-cell">
        <label for="espece">Espèce:</label>
        <input class="w3-input w3-border" type="text" id="espece" v-model="form.espece" />
      </div>
      <div class="w3-half form-cell">
        <label for="race">Race:</label>
        <input class="w3-input w3-border" type="text" id="race" v-model="form.race" />
      </div>
      <div class="w3-half form-cell">
        <label for="production">Production:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="production"
          v-model="form.production"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="stadeM">Stade maturité:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="stadeM"
          v-model="form.stade_maturite"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="pension">En pension:</label>
        <select class="w3-input w3-border" v-model="form.pension" id="pension">
          <option value="En totalité">Tous les animaux</option>
          <option value="Aucun animal">Aucun animal</option>
          <option value="Mix">Mix</option>
        </select>
      </div>
      <!-- next id pour debug -->
      <div v-if="!isEdit" class="form-cell">
        (Next ID:
        {{ nextId }}
        )
      </div>
    </div>
    <button type="submit">Enregistrer</button>
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

const form = ref({ ...props.initialForm });

// Variable pour stocker le nextId
const nextId = ref(null);

const submitForm = () => {
  console.log("Form submitted with:", form.value);
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
  console.log("TCheptelForm component mounted");

  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/typeCheptel/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id_type_cheptel = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }
});

onBeforeUnmount(() => {
  console.log("TCheptelForm component before unmount");
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
