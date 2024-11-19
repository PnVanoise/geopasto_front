<template>
  <div>
    <h1>Éditer un Type de cheptel</h1>
    <TypeCheptelForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import TypeCheptelForm from "./TypeCheptelForm.vue";

const form = ref({
  description: "",
  espece: "",
  race: "",
  production: "",
  stade_maturite: "",
  pension: "",
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchTypeCheptel = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeCheptel/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du berger.");
      console.error("typeCheptelEdit fetchtypecheptel error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/typeCheptel/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Type de chaptel modifié!");
    router.push("/TypeCheptels");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du type de cheptel.");
    console.error("tcheptel submitForm error: ", error);
  }
};

onMounted(fetchTypeCheptel);
</script>

<style scoped></style>
