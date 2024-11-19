<template>
  <div>
    <h1>Éditer un type de convention</h1>
    <TypeDeConventionForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import TypeDeConventionForm from "./TypeDeConventionForm.vue";

const form = ref({
  description: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchTypeConvention = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeConvention/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du type de convention.");
      console.error("TypeConvention fetchTypeConvention error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/typeConvention/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type de convention modifié!");
    router.push("/TypeConventions");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du type de convention.");
    console.error("TypeConvention submitForm error: ", error);
  }
};

onMounted(fetchTypeConvention);
</script>

<style scoped></style>
