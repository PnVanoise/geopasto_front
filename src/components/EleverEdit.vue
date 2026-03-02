<template>
  <div>
    <h1>{{ title }}</h1>
    <EleverForm :initialForm="form" :isEdit="true" :is-read-only="isReadOnly"
      :onSubmit="!isReadOnly ? submitForm : undefined" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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

const isReadOnly = computed(() => route.query.readonly === 'true' ? true : false);
// const isReadOnly = computed(() => route.query.readonly === 'true');
const title = computed(() =>
  isReadOnly.value ? "Consulter un cheptel" : "Éditer un cheptel"
);

const fetchElever = () => {
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/elever/${id}/`)
    .then((response) => {
      console.log("response.data:", response.data);
      form.value = response.data;
    })
    .catch((error) => {
      mainStore.setErrorMessage("Erreur de lecture du cheptel.");
      console.error("EleverEdit fetchElever error: ", error);
    });
};

const submitForm = async (formData) => {
  try {
    const normalizedData = {
      ...formData,
      date_debut: formData.date_debut === "" ? null : formData.date_debut,
      date_fin: formData.date_fin === "" ? null : formData.date_fin,
    };

    const response = await auth.axiosInstance.put(
      `${config.API_BASE_URL}/api/elever/${id}/`,
      normalizedData
    );
    console.log("Form successfully submitted, response:", response);
    mainStore.setSuccessMessage("Cheptel modifié!");
    router.push("/Elevers");
  } catch (error) {
    mainStore.setErrorMessage("Erreur d'enregistrement du cheptel.");
    console.error("EleverEdit submitForm error: ", error);
  }
};

onMounted(fetchElever);
</script>

<style scoped></style>
