<template>
  <div>
    <h1>Éditer un éleveur</h1>
    <EleveurForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import EleveurForm from "./EleveurForm.vue";

const form = ref({
  nom_eleveur: "",
  prenom_eleveur: "",
  tel_eleveur: "",
  mail_eleveur: "",
  adresse_eleveur: "",
  commentaire: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchEleveur = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/eleveur/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture de l'éleveur.");
      console.error("EleveurEdit fetchEleveur error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/eleveur/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Eleveur modifié!");
    router.push("/Eleveurs");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement de l'éleveur.");
    console.error("eleveur submitForm error: ", error);
  }
};

onMounted(fetchEleveur);
</script>

<style scoped></style>
