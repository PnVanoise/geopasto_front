<template>
  <div>
    <h1>Éditer une commodité</h1>
    <CommoditeForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import CommoditeForm from "./CommoditeForm.vue";

const form = ref({
  description: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchCommodite = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/commodite/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du type de mesure.");
      console.error("Commodite fetchCommodite error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/commodite/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type de mesure modifié!");
    router.push("/Commodites");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement de la commodité.");
    console.error("Commodité submitForm error: ", error);
  }
};

onMounted(fetchCommodite);
</script>

<style scoped></style>
