<template>
  <div>
    <h1>Éditer un type de suivi</h1>
    <TypeDeSuiviForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import TypeDeSuiviForm from "./TypeDeSuiviForm.vue";

const form = ref({
  description: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchTypeSuivi = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeSuivi/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du type de suivi.");
      console.error("TypeEquipement fetchTypeSuivi error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/typeSuivi/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type de suivi modifié!");
    router.push("/TypeSuivis");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du type de suivi.");
    console.error("TypeSuivi submitForm error: ", error);
  }
};

onMounted(fetchTypeSuivi);
</script>

<style scoped></style>
