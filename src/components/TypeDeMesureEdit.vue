<template>
  <div>
    <h1>{{ title }}</h1>
    <TypeDeMesureForm
      :initialForm="form"
      :isEdit="true"
      :is-read-only="isReadOnly"
      :onSubmit="!isReadOnly ? submitForm : undefined"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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

const isReadOnly = computed(() => route.query.readonly === 'true');
const title = computed(() =>
  isReadOnly.value ? "Consulter un type de mesure" : "Éditer un type de mesure"
);

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
