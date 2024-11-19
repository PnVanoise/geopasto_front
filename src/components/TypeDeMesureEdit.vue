<template>
  <div>
    <h1>Éditer un type de mesure</h1>
    <TypeDeMesureForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import TypeDeMesureForm from "./TypeDeMesureForm.vue";

const form = ref({
  description: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchTypeMesure = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeMesure/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du type de mesure.");
      console.error("TypeMesure fetchTypeMesure error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/typeMesure/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type de mesure modifié!");
    router.push("/TypeMesures");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du type de mesure.");
    console.error("TypeMesure submitForm error: ", error);
  }
};

onMounted(fetchTypeMesure);
</script>

<style scoped></style>
