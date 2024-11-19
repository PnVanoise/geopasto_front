<template>
  <div>
    <h1>Ajouter un propriétaire foncier</h1>
    <ProprietaireFoncierForm :initialForm="form" :isEdit="false" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

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
  unites_pastorales: [],
});

const router = useRouter();
const mainStore = useMainStore();

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.post(
      `${config.API_BASE_URL}/api/proprietaireFoncier/`,
      formData
    );
    console.log("Form successfully submitted, response:", response);

    // Afficher un message de succès
    mainStore.setSuccessMessage("Propriétaire foncier ajouté avec succès!");

    // Vérifier si le message est bien défini dans le store
    console.log("Success message set:", mainStore.successMessage);

    // Ajouter un petit délai pour vérifier l'affichage du message avant la redirection
    setTimeout(() => {
      router.push("/ProprietaireFonciers");
    }, 500); // Petit délai pour s'assurer que le message est vu
  } catch (error) {
    mainStore.setErrorMessage(
      "Une erreur s'est produite lors de l'ajout du propriétaire foncier." + error
    );
    console.error("There was an error!", error);
  }
};
</script>

<style scoped></style>
