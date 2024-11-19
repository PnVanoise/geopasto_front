<template>
  <div>
    <h1>Éditer un prêt d'abri</h1>
    <PretAbriForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import PretAbriForm from "./PretAbriForm.vue";

const form = ref({
  properties: {
    exploitant: "",
    abri_urgence: "",
    date_debut: "",
    date_fin: "",
  },
  geometry: {
    type: "Point",
    coordinates: [],
  },
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchPret = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/beneficierDe/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du prêt.");
      console.error("PretEdit fetchPret error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/beneficierDe/${id}/`,
      formData
    );
    console.log("Form successfully submitted, response:", response);
    mainStore.setSuccessMessage("Prêt modifié!");
    router.push("/PretAbris");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du prêt.");
    console.error("Pret submitForm error: ", error);
  }
};

onMounted(fetchPret);
</script>

<style scoped></style>
