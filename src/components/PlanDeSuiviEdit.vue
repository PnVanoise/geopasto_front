<template>
  <div>
    <h1>Éditer un plan de suivi</h1>
    <PlanDeSuiviForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import PlanDeSuiviForm from "./PlanDeSuiviForm.vue";

const form = ref({
  description: "",
  date_debut: "",
  date_fin: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchPlanSuivi = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/planSuivi/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du plan de suivi.");
      console.error("PlanSuivi fetchPlanSuivi error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/planSuivi/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Plan de suivi modifié!");
    router.push("/PlanSuivis");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du plan de suivi.");
    console.error("PlanSuivi submitForm error: ", error);
  }
};

onMounted(fetchPlanSuivi);
</script>

<style scoped></style>
