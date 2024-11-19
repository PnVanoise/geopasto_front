<template>
  <form @submit.prevent="login">
    <input v-model="userCredentials.username" placeholder="Nom d'utilisateur" required />
    <br />
    <input
      type="password"
      v-model="userCredentials.password"
      placeholder="Mot de passe"
      required
    />
    <br />
    <button type="submit">Connexion</button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

import axios from "../services/axios";

const router = useRouter();

// Définit l'événement que ce composant peut émettre
const emit = defineEmits(["authenticated"]);

// Variable pour stocker les informations de connexion de l'utilisateur
const userCredentials = ref({
  username: "",
  password: "",
});

// Fonction de connexion
const login = async () => {
  try {
    const response = await axios.post("http://151.80.250.138/api/token/", {
      username: userCredentials.value.username,
      password: userCredentials.value.password,
    });

    // Stocke les tokens dans localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        access: response.data.access,
        refresh: response.data.refresh,
        username: userCredentials.value.username,
      })
    );

    // Émettre un événement "authenticated" vers le parent (App.vue)
    emit("authenticated");

    // Rediriger l'utilisateur vers la page d'accueil'
    router.push("/");
    // window.location.reload();
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
};
</script>
