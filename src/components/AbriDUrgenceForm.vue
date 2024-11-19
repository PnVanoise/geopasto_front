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
        <label for="etat">Etat:</label>
        <input class="w3-input w3-border" type="text" id="etat" v-model="form.etat" />
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

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const props = defineProps({
  initialForm: Object,
  isEdit: Boolean,
  onSubmit: Function,
});

const form = ref({ ...props.initialForm });

// Variable pour stocker le nextId
const nextId = ref(null);

const submitForm = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    if (!props.isEdit) {
      form.value.created_by = user.username;
      form.value.created_on = dayjs().utc().format();
    } else {
      form.value.modified_by = user.username;
      form.value.modified_on = dayjs().utc().format();
    }
  }

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
  console.log("AbriForm component mounted");

  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/abriDUrgence/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id_abri_urgence = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }
});

onBeforeUnmount(() => {
  console.log("AbriForm component before unmount");
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
