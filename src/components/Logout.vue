<template>
  <div class="auth_msg">
    Bonjour <b>{{ mainStore.username }}</b>
    <!-- <p v-for="(perms, model) in mainStore.userPermissions" :key="model">
        <strong>{{ model }}</strong> :
        <span>{{ perms.join(', ') }}</span>
      </p> -->
    <p v-if="mainStore.successMessage" class="success">{{ mainStore.successMessage }}</p>
    <p v-if="mainStore.errorMessage" class="error">{{ mainStore.errorMessage }}</p>
  </div>
  <button @click="logout">Se déconnecter</button>

</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, defineEmits, onMounted, onUnmounted } from "vue";

import { useMainStore } from "../store";

// Utiliser le router pour rediriger après la déconnexion
const router = useRouter();

// Evénement de déconnexion
const emit = defineEmits(["loggedOut"]);

const username = ref("");
const expirationTime = ref("");

// Permissions
const mainStore = useMainStore();

// Fonction pour décoder le token JWT et obtenir l'heure d'expiration
const decodeToken = (token) => {
  const payload = token.split(".")[1]; // Prend la partie du payload
  const decodedPayload = JSON.parse(atob(payload)); // Décode en Base64
  return decodedPayload.exp; // Renvoie l'heure d'expiration (timestamp Unix)
};

const loadUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    username.value = user.username;

    const exp = decodeToken(user.access);
    const expirationDate = new Date(exp * 1000);
    expirationTime.value = expirationDate.toLocaleString();
  }
};

// Écouter l'événement "tokenRefreshed" pour mettre à jour l'heure d'expiration
const handleTokenRefreshed = () => {
  loadUserData();
};

onMounted(() => {
  mainStore.fetchUserPermissions();
  loadUserData();
  window.addEventListener("tokenRefreshed", handleTokenRefreshed);
});

onUnmounted(() => {
  window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
});

// Fonction de déconnexion
const logout = () => {
  // Supprimer le token JWT de localStorage
  localStorage.removeItem("user");

  emit("loggedOut");

  // Rediriger l'utilisateur vers la page d'accueil'
  router.push("/");
  // window.location.reload();
};
</script>

<style scoped>
.auth_msg {
  padding: 10px 10px;
}

button {
  padding: 10px 20px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ff6b81;
}
</style>
