<script setup>
import { computed, watch, ref, onMounted } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import Notification from "./components/Notification.vue";
import Login from "./components/Login.vue";
import Logout from "./components/Logout.vue";

import { useMainStore } from "./store";

const mainStore = useMainStore();
const successMessage = computed(() => mainStore.successMessage);
const errorMessage = computed(() => mainStore.errorMessage);

const route = useRoute();
const accAdmi = ref(null);
const accExpl = ref(null);
const accPlan = ref(null);
const accEve = ref(null);
const accEquip = ref(null);

const activeAcc = ref(null);

const accordion = ref(null);
const accordion2 = ref(null);
const dropdown = ref(null);

const clearSuccessMessage = () => {
  mainStore.setSuccessMessage("");
};

const clearErrorMessage = () => {
  mainStore.setErrorMessage("");
};

function accAdmiFunc() {
  console.log(accordion.value);
  var x = accAdmi.value;
  if (activeAcc.value && activeAcc.value !== accAdmi.value) {
    activeAcc.value.className = activeAcc.value.className.replace(" w3-show", "");
  }
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    activeAcc.value = x; // Mettez à jour l'accordéon actif
  } else {
    x.className = x.className.replace(" w3-show", "");
    activeAcc.value = null; // Réinitialiser l'accordéon actif
  }
}

function accExplFunc() {
  console.log(accordion.value);
  var x = accExpl.value;
  if (activeAcc.value && activeAcc.value !== accExpl.value) {
    activeAcc.value.className = activeAcc.value.className.replace(" w3-show", "");
  }
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    activeAcc.value = x; // Mettez à jour l'accordéon actif
  } else {
    x.className = x.className.replace(" w3-show", "");
    activeAcc.value = null; // Réinitialiser l'accordéon actif
  }
}

function accPlanFunc() {
  console.log(accordion.value);
  var x = accPlan.value;
  if (activeAcc.value && activeAcc.value !== accPlan.value) {
    activeAcc.value.className = activeAcc.value.className.replace(" w3-show", "");
  }
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    activeAcc.value = x; // Mettez à jour l'accordéon actif
  } else {
    x.className = x.className.replace(" w3-show", "");
    activeAcc.value = null; // Réinitialiser l'accordéon actif
  }
}

function accEveFunc() {
  console.log(accordion.value);
  var x = accEve.value;
  if (activeAcc.value && activeAcc.value !== accEve.value) {
    activeAcc.value.className = activeAcc.value.className.replace(" w3-show", "");
  }
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    activeAcc.value = x; // Mettez à jour l'accordéon actif
  } else {
    x.className = x.className.replace(" w3-show", "");
    activeAcc.value = null; // Réinitialiser l'accordéon actif
  }
}

function accEquipFunc() {
  console.log(accordion.value);
  var x = accEquip.value;
  if (activeAcc.value && activeAcc.value !== accEquip.value) {
    activeAcc.value.className = activeAcc.value.className.replace(" w3-show", "");
  }
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    activeAcc.value = x; // Mettez à jour l'accordéon actif
  } else {
    x.className = x.className.replace(" w3-show", "");
    activeAcc.value = null; // Réinitialiser l'accordéon actif
  }
}

// Variable réactive pour stocker les données de localStorage
const localStorageData = ref({
  access: "",
  refresh: "",
  username: "",
});

// Variable réactive pour suivre l'état d'authentification
const isAuthenticated = ref(false);

// Fonction pour vérifier si l'utilisateur est connecté (présence du token dans localStorage)
const checkAuthentication = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const token = JSON.parse(userData).access;
    isAuthenticated.value = !!token; // True si le token existe
  } else {
    isAuthenticated.value = false;
  }
};

// Fonction exécutée lors du montage du composant
onMounted(() => {
  const storedData = localStorage.getItem("user");

  // Si des données sont présentes dans localStorage, les assigner
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    localStorageData.value = {
      access: parsedData.access,
      refresh: parsedData.refresh,
      username: parsedData.username,
    };
  } else {
    // Si aucune donnée n'est présente
    localStorageData.value = {
      access: "Aucun token access trouvé",
      refresh: "Aucun token refresh trouvé",
      username: "Utilisateur inconnu",
    };
  }
  checkAuthentication();
});

// Fonction pour mettre à jour l'état après la connexion réussie
const handleAuthenticated = () => {
  checkAuthentication();
};

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  isAuthenticated.value = false; // Met à jour l'état après la déconnexion
};
</script>

<template>
  <div class="w3-center w3-signal-green header-container">
    <div class="title-container">
      <h1>GeoPasto</h1>
      <div class="auth_buttons">
        <div v-if="isAuthenticated">
          <Logout @loggedOut="handleLogout" />
          <!-- Affiche le bouton de déconnexion si l'utilisateur est connecté -->
        </div>
        <div v-else>
          <Login @authenticated="handleAuthenticated" />
          <!-- Affiche le formulaire de connexion si non authentifié -->
        </div>
      </div>
    </div>
    <div class="notification-container">
      <Notification
        v-if="successMessage"
        :message="successMessage"
        type="success"
        @close="clearSuccessMessage"
      />
      <Notification
        v-if="errorMessage"
        :message="errorMessage"
        type="error"
        @close="clearErrorMessage"
      />
    </div>
  </div>

  <div
    v-if="isAuthenticated"
    class="w3-sidebar w3-bar-block w3-light-grey w3-card"
    style="width: 160px"
  >
    <!-- Accordeon 'administratif'-->
    <div class="nav-item w3-signal-yellow" @click="accAdmiFunc">
      Administratif <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accAdmi" class="w3-hide w3-white w3-card">
      <div
        :class="[
          'nav-item w3-signal-yellow transparent',
          { active: route.path === '/ProprietaireFonciers' },
        ]"
      >
        <RouterLink to="/ProprietaireFonciers">Propriétaires</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-yellow transparent',
          { active: route.path === '/UnitePastorales' },
        ]"
      >
        <RouterLink to="/UnitePastorales">Unités pastorales</RouterLink>
      </div>
    </div>

    <!-- Accordeon 'Exploitation'-->
    <div class="nav-item w3-signal-orange" @click="accExplFunc">
      Exploitation <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accExpl" class="w3-hide w3-white w3-card">
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/TypeConventions' },
        ]"
      >
        <RouterLink to="/TypeConventions">Types de convention</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/Conventions' },
        ]"
      >
        <RouterLink to="/Conventions">Conventions d'exploitation</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/GardeTroupeaux' },
        ]"
      >
        <RouterLink to="/SituationExploitations">Situations d'exploitation</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/SituationExploitations' },
        ]"
      >
        <RouterLink to="/Exploitants">Exploitants</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/Eleveurs' },
        ]"
      >
        <RouterLink to="/Eleveurs">Eleveurs</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/Subventions' },
        ]"
      >
        <RouterLink to="/Subventions">Subventions</RouterLink>
      </div>

      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/PretAbris' },
        ]"
      >
        <RouterLink to="/PretAbris">Prêts d'abris</RouterLink>
      </div>

      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/TypeCheptels' },
        ]"
      >
        <RouterLink to="/TypeCheptels">Types de cheptel</RouterLink>
      </div>

      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/Elevers' },
        ]"
      >
        <RouterLink to="/Elevers">Eleveurs / Troupeaux</RouterLink>
      </div>

      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/Bergers' },
        ]"
      >
        <RouterLink to="/Bergers">Bergers</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-orange transparent',
          { active: route.path === '/GardeTroupeaux' },
        ]"
      >
        <RouterLink to="/GardeTroupeaux">Bergers / Situations</RouterLink>
      </div>
    </div>

    <!-- Accordeon 'Plans et Mesures'-->
    <div class="nav-item w3-signal-red" @click="accPlanFunc">
      Plans et Mesures <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accPlan" class="w3-hide w3-white w3-card">
      <div
        :class="[
          'nav-item w3-signal-red transparent',
          { active: route.path === '/TypeSuivis' },
        ]"
      >
        <RouterLink to="/TypeSuivis">Types de plans de suivi</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-red transparent',
          { active: route.path === '/PlanSuivis' },
        ]"
      >
        <RouterLink to="/PlanSuivis">Plans de suivi</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-red transparent',
          { active: route.path === '/TypeMesures' },
        ]"
      >
        <RouterLink to="/TypeMesures">Types de mesures</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-red transparent',
          { active: route.path === '/MesurePlans' },
        ]"
      >
        <RouterLink to="/MesurePlans">Mesures de plan</RouterLink>
      </div>
    </div>

    <!-- Accordeon 'Evénements'-->
    <div class="nav-item w3-signal-violet" @click="accEveFunc">
      Evénements <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accEve" class="w3-hide w3-white w3-card">
      <div
        :class="[
          'nav-item w3-signal-violet transparent',
          { active: route.path === '/TypeEvenements' },
        ]"
      >
        <RouterLink to="/TypeEvenements">Types d'événements</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-violet transparent',
          { active: route.path === '/Evenements' },
        ]"
      >
        <RouterLink to="/Evenements">Evénements</RouterLink>
      </div>
    </div>

    <!-- Accordeon 'Equipements'-->
    <div class="nav-item w3-signal-blue" @click="accEquipFunc">
      Equipements <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accEquip" class="w3-hide w3-white w3-card">
      <div
        :class="[
          'nav-item w3-signal-blue transparent',
          { active: route.path === '/Logements' },
        ]"
      >
        <RouterLink to="/Logements">Logements</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-blue transparent',
          { active: route.path === '/AbriUrgences' },
        ]"
      >
        <RouterLink to="/AbriUrgences">Abris d'urgence</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-blue transparent',
          { active: route.path === '/Commodites' },
        ]"
      >
        <RouterLink to="/Commodites">Commodites</RouterLink>
      </div>
    </div>

    <!-- <div :class="['nav-item w3-signal-yellow', { active: route.path === '/Alpages' }]">
      <RouterLink to="/UnitePastorales">Unités pastorales</RouterLink>
    </div> -->
    <!-- <div
      :class="[
        'nav-item w3-signal-orange',
        { active: route.path === '/TypeEquipementAlpages' },
      ]"
    >
      Types d'équipement d'alpage
      <RouterLink to="/TypeEquipementAlpages">Types d'équipement d'alpage</RouterLink>
    </div>
    <div :class="['nav-item w3-signal-red', { active: route.path === '/Logements' }]">
      <RouterLink to="/Logements">Logements</RouterLink>
    </div>

    Equipements
    <div
      :class="['nav-item w3-signal-violet', { active: route.path === '/Equipements' }]"
    >
      <RouterLink to="/Equipements">Equipements</RouterLink>
    </div> -->

    <!-- Equipements -->

    <!-- <div class="nav-item w3-signal-blue" @click="myAccFunc2">
      Accordion2 <i class="fa fa-caret-down"></i>
    </div>
    <div ref="accordion2" class="w3-hide w3-wh</div>ite w3-card">
      <div
        :class="[
          'nav-item w3-signal-blue transparent',
          { active: route.path === '/about' },
        ]"
      >
        <RouterLink to="/about">Test draw sans données chargées</RouterLink>
      </div>
      <div
        :class="[
          'nav-item w3-signal-blue transparent',
          { active: route.path === '/about2' },
        ]"
      >
        <RouterLink to="/about2">Test draw avec données chargées</RouterLink>
      </div>
    </div> -->
    <!-- <div class="nav-item w3-signal-green" @click="myDropFunc">
      Dropdown <i class="fa fa-caret-down"></i>
    </div>
    <div ref="dropdown" class="w3-dropdown-content w3-bar-block w3-white w3-card">
      <a href="#" class="w3-bar-item w3-button w3-signal-green transparent">Link</a>
      <a href="#" class="w3-bar-item w3-button w3-signal-green transparent">Link</a>
    </div> -->
  </div>

  <div v-if="isAuthenticated" class="w3-container" style="margin-left: 160px">
    <RouterView />
  </div>
  <div v-else>
    <div class="w3-center">
      <h2>Veuillez vous connecter pour accéder à l'application</h2>
    </div>
  </div>
</template>

<style>
.header-container {
  position: relative;
  text-align: center;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container h1 {
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.notification-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px; /* Adjust as needed */
}

.notification-container > div {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 350px; /* Adjust as needed */
}

.error-message {
  color: red;
  font-weight: bold;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  color: green;
  font-weight: bold;
  padding: 10px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  margin-bottom: 20px;
}

.nav-container {
  display: flex; /* flex-wrap: wrap; */
  justify-content: space-between;
  background-color: #2196f3; /* Couleur de fond de la barre de navigation */
  padding: 0; /* Espacement intérieur pour créer une marge uniforme */
}

.nav-item {
  flex: 1 0 auto;
  /* Chaque élément prendra autant d'espace que nécessaire */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  max-height: 80px;
  padding: 0 0 !important;
  /* margin: 5px; Espacement entre les éléments */
}

/* .w3-col.nav-item {
    padding: 0 8 !important;
} */

.nav-item a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  color: white;
  text-decoration: none;
  /* padding: 10px; */
}

.nav-item a:hover {
  background-color: #ddd;
  color: black;
}

.nav-item.active a {
  color: black; /* Couleur du texte en noir */
  font-weight: bold; /* Texte en gras */
  border: 1px solid white; /* Bordure blanche fine */
}

.transparent {
  opacity: 0.7;
}
</style>
