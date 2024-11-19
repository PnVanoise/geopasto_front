<template>
  <div>
    <h1>Éditer un abri d'urgence</h1>
    <AbriDUrgenceForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import AbriDUrgenceForm from "./AbriDUrgenceForm.vue";

const form = ref({
  description: "",
  etat: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchAbri = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/abriDUrgence/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture de l'abri.");
      console.error("AbriEdit fetchAbri error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/abriDUrgence/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Abri modifié!");
    router.push("/AbriUrgences");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement de l'abri.");
    console.error("Abri submitForm error: ", error);
  }
};

onMounted(fetchAbri);
</script>

<style scoped></style>
