<template>
  <h3 class="w3-center w3-margin">{{ formTitle }}</h3>

  <form @submit.prevent="submitForm">
    <!-- Ligne 1 : Situation | Eleveur -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="situation">Situation:</label>
        <select class="w3-input w3-border" v-model="form.situation_exploitation" id="situation" 
          :disabled="props.mode === 'view' || !can('change')" >
          <option v-for="situation in situations" :key="situation.id_situation" :value="situation.id_situation">
            {{ situation.nom_situation }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="eleveur">Eleveur:</label>
        <select class="w3-input w3-border" v-model="form.eleveur" id="eleveur" 
          :disabled="props.mode === 'view' || !can('change')" >
          <option v-for="eleveur in eleveurs" :key="eleveur.id_eleveur" :value="eleveur.id_eleveur">
            {{ eleveur.prenom_eleveur }} {{ eleveur.nom_eleveur }}
          </option>
        </select>
      </div>
    </div>
    <!-- Ligne 1 : Type cheptel | Nombre -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="typeCheptel">Type de cheptel:</label>
        <select class="w3-input w3-border" v-model="form.type_cheptel" id="type_cheptel" 
          :disabled="props.mode === 'view' || !can('change')" >
          <option v-for="typeC in typeCs" :key="typeC.id_type_cheptel" :value="typeC.id_type_cheptel">
            {{ typeC.description }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="eleveur">Nombre d'animaux:</label>
        <input class="w3-input w3-border" type="number" min="1" id="nombre" v-model="form.nombre_animaux"
          :disabled="props.mode === 'view' || !can('change')" />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="dateDebut">Date de début:</label>
        <input class="w3-input w3-border" type="date" id="dateDebut" v-model="form.date_debut" @keydown.prevent
          @paste.prevent 
          :disabled="props.mode === 'view' || !can('change')" />
      </div>
      <div class="w3-half form-cell">
        <label for="dateFin">Date de fin:</label>
        <input class="w3-input w3-border" type="date" id="dateFin" v-model="form.date_fin" @keydown.prevent
          @paste.prevent 
          :disabled="props.mode === 'view' || !can('change')" />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="pension">En pension:</label>
        <select
          class="w3-input w3-border"
          v-model="form.pension"
          id="pension"
          :disabled="props.mode === 'view' || !can('change')" >
          <option value="Tous">Tous les animaux</option>
          <option value="Aucun">Aucun animal</option>
          <option value="Mix">Mix</option>
        </select>
      </div>
      <div v-if="props.mode === 'add'" class="form-cell">
        (Next ID:
        {{ nextId }}
        )
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="closeModal">Retour</button>
      <button v-if="props.mode !== 'view'" type="submit" class="btn btn-primary">
        {{ btTitle }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, ref, computed, onMounted } from "vue";
import config from "../../config";
import auth from "../../auth";
import { usePermissions } from "../composables/usePermissions";

const props = defineProps({
  initialForm: { type: Object, default: () => ({}) },
  mode: { type: String, default: "view" }, // add | change | view
  itemLabel: { type: String, required: true },
  onSubmit: Function,
  onClose: Function,
});

const { can } = usePermissions("elever");

const formTitle = computed(() => {
  if (props.mode === "add") return `Ajouter ${props.itemLabel}`;
  if (props.mode === "change") return `Modifier ${props.itemLabel}`;
  if (props.mode === "view") return `Voir les détails d'${props.itemLabel}`;
  return "";
});

const btTitle = computed(() => {
  if (props.mode === "add") return "Ajouter";
  if (props.mode === "change") return "Enregistrer";
  return "";
});

const form = reactive({
  eleveur: "",
  situation_exploitation: "",
  type_cheptel: "",
  nombre_animaux: "",
  pension: "",
  date_debut: "",
  date_fin: "",
});

const situations = ref([]);
const eleveurs = ref([]);
const typeCs = ref([]);


watch(
  () => props.initialForm,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal);
    }
  },
  { immediate: true }
);

// Next ID pour l'ajout
const nextId = ref(null);
onMounted(() => {
  if (props.mode === "add") {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/elever/getNextId/`)
      .then(res => {
        nextId.value = res.data.next_id;
        form.id_elever = nextId.value;
      })
      .catch(err => console.error("Erreur Next ID", err));
  };

  // Récupère les situations
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/situationExploitation/`)
    .then((response) => {
      situations.value = response.data;
      console.log("situations:", situations.value);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des situations d'exploitation.",
        error
      );
    });

  // Récupère les éleveurs
  if(props.explId) {
    auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/eleveur/by-exploitant/${props.explId}/`)
    .then((response) => {
      eleveurs.value = response.data;
      console.log("eleveur:", eleveurs.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des éleveurs.", error);
    });
  } else {
    auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/eleveur/`)
    .then((response) => {
      eleveurs.value = response.data;
      console.log("eleveur:", eleveurs.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des éleveurs.", error);
    });
  }
  

  // Récupère les types de cheptel
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeCheptel/`)
    .then((response) => {
      typeCs.value = response.data;
      console.log("typeCs:", typeCs.value);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des types de cheptel.",
        error
      );
    });
});


// Submits
const submitForm = () => {
  if (props.onSubmit) {
    props.onSubmit(form)
      .then(() => console.log("Form submitted OK"))
      .catch(err => console.error(err));
  }
};

// Close
const closeModal = () => {
  props.onClose?.();
};
</script>
