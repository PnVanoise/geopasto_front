<template>
  <div>
    <h1>Éditer une garde</h1>
    <GardeTroupeauForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import GardeTroupeauForm from "./GardeTroupeauForm.vue";

const form = ref({
  berger: "",
  situation_exploitation: "",
  date_debut: "",
  date_fin: "",
  commentaire: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchGarde = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/gardeSituation/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture de la garde.");
      console.error("GardeTroupeauEdit fetchGarde error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/gardeSituation/${id}/`,
      formData
    );
    console.log("Form successfully submitted, response:", response);
    mainStore.setSuccessMessage("Garde modifiée!");
    router.push("/GardeTroupeaux");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement de la garde.");
    console.error("GardeEdit submitForm error: ", error);
  }
};

onMounted(fetchGarde);
</script>

<style scoped></style>
