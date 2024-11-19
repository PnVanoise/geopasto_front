<template>
  <div>
    <h1>Éditer une convention</h1>
    <ConventionForm :initialForm="form" :isEdit="true" :onSubmit="submitForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";

import ConventionForm from "./ConventionForm.vue";

const form = ref({
  id: null,
  properties: {
    surface_location: "",
    surface_exploitable: "",
    date_debut: "",
    date_fin: "",
    effectif_bovin: "",
    effectif_ovin: "",
    effectif_caprin: "",
    effectif_porcin: "",
  },
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mainStore = useMainStore();

const fetchConvention = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/conventionExploitation/${id}/`)
    .then((response) => {
      console.log("response data : ", response.data);
      form.value.id = response.data.id;
      form.value.properties = response.data.properties;
      form.value.geometry = response.data.geometry;
      console.log("form properties : ", form.value);
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture de la convention.");
      console.error("Convention fetchConvention error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/conventionExploitation/${id}/`,
      formData
    );
    mainStore.setSuccessMessage("Convention modifiée!");
    router.push("/Conventions");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement de la convention.");
    console.error("Convention submitForm error: ", error);
  }
};

onMounted(fetchConvention);
</script>

<style scoped></style>
