<template>
  <div>
    <h1>Éditer un Troupeau - Eleveur</h1>
    <EleverForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import EleverForm from "./EleverForm.vue";

const form = ref({
  eleveur: "",
  situation_exploitation: "",
  type_cheptel: "",
  nombre_animaux: "",
  date_debut: "",
  date_fin: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchElever = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/elever/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du troupeau - éleveur.");
      console.error("EleverEdit fetchElever error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/elever/${id}/`,
      formData
    );
    console.log("Form successfully submitted, response:", response);
    mainStore.setSuccessMessage("Troupeau - Eleveur modifié!");
    router.push("/Elevers");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du troupeau - éleveur.");
    console.error("EleverEdit submitForm error: ", error);
  }
};

onMounted(fetchElever);
</script>

<style scoped></style>
