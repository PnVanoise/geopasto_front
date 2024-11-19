<template>
  <div>
    <h1>Éditer un propriétaire foncier</h1>
    <ProprietaireFoncierForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import ProprietaireFoncierForm from "./ProprietaireFoncierForm.vue";

const form = ref({
  nom_propr: "",
  prenom_propr: "",
  tel_propr: "",
  mail_propr: "",
  adresse_propr: "",
  commentaire: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchProprio = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/proprietaireFoncier/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du propriétaire foncier.");
      console.error("TypeEquipement fetchProprio error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/proprietaireFoncier/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Propriétaire foncier modifié!");
    router.push("/ProprietaireFonciers");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du propriétaire foncier.");
    console.error("ProprietaireFoncier submitForm error: ", error);
  }
};

onMounted(fetchProprio);
</script>

<style scoped></style>
