<template>
  <div>
    <h1>Ajouter un éleveur</h1>
    <EleveurForm :initialForm="form" :isEdit="false" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

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

const router = useRouter();
const mainStore = useMainStore();

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.post(
      `${config.API_BASE_URL}/api/eleveur/`,
      formData
    );
    console.log("Form successfully submitted, response:", response);

    // Afficher un message de succès
    mainStore.setSuccessMessage("Eleveur ajouté avec succès!");

    // Vérifier si le message est bien défini dans le store
    console.log("Success message set:", mainStore.successMessage);

    // Ajouter un petit délai pour vérifier l'affichage du message avant la redirection
    setTimeout(() => {
      router.push("/Eleveurs");
    }, 500); // Petit délai pour s'assurer que le message est vu
  } catch (error) {
    mainStore.setErrorMessage(
      "Une erreur s'est produite lors de l'ajout de l'éleveur." + error
    );
    console.error("There was an error!", error);
  }
};
</script>

<style scoped></style>
