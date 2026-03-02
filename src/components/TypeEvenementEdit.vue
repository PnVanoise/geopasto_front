<template>
  <div>
    <h1>{{ title }}</h1>
    <TypeEvenementForm
      :initialForm="form"
      :isEdit="true"
      :is-read-only="isReadOnly"
      :onSubmit="isReadOnly ? submitForm : undefined" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import TypeEvenementForm from "./TypeEvenementForm.vue";

const form = ref({
  description: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const isReadOnly = computed(() => route.query.readonly === 'true');
const title = computed(() =>
  isReadOnly.value ? "Consulter un type d'événement" : "Éditer un type d'événement"
);

const fetchTypeEvt = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeEvenement/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du type d'événement'.");
      console.error("Typevenement fetchTypeEvt error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/typeEvenement/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type d'événement modifié!");
    router.push("/TypeEvenements");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du type d'événement'.");
    console.error("TypeEvenement submitForm error: ", error);
  }
};

onMounted(fetchTypeEvt);
</script>

<style scoped></style>
