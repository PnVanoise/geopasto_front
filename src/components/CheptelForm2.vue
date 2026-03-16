<template>
  <h3 class="w3-center w3-margin">{{ formTitle }}</h3>

  <form @submit.prevent="submitForm">
    <!-- Ligne 1 : Situation | Eleveur -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <v-select
          id="situation"
          v-model="form.situation_exploitation"
          :items="situations"
          item-title="nom_situation"
          item-value="id_situation"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          label="Situation d'exploitation"
          dense
          hide-details
          clearable
        />
      </div>
      <div class="w3-half form-cell">
        <v-select
          id="eleveur"
          v-model="form.eleveur"
          :items="eleveurs"
          item-title="nom_complet"
          item-value="id_eleveur"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          label="Eleveur"
          dense
          hide-details
          clearable
        />
      </div>
    </div>
    <!-- Ligne 1 : Type cheptel | Nombre -->
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <v-select 
          id="typeCheptel"
          v-model="form.type_cheptel"
          :items="typeCs"
          item-title="description"
          item-value="id_type_cheptel"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          label="Type de cheptel"
          dense
          hide-details
          clearable
        />
      </div>
      <div class="w3-half form-cell">
        <v-text-field
          id="nombre" 
          v-model="form.nombre_animaux"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          label="Nombre d'animaux"
          type="number"
          min="1"
          dense
          hide-details
          clearable
        />
      </div>
    </div>
    
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">        
        <v-text-field
          type="date" 
          label="Date de début"
          v-model="form.date_debut"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          dense
          hide-details
          clearable
        />
      </div>
      <div class="w3-half form-cell">
        <v-text-field
          type="date"
          label="Date de fin"
          v-model="form.date_fin"
          :class="{ 'disable-events': props.mode === 'view' || !can('change') }"
          dense
          hide-details
          clearable
        />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
      </div>
      <div v-if="props.mode === 'add'" class="form-cell">
      </div>
    </div>
    
    <div class="form-actions">
      <v-btn density="comfortable" color="info" @click="closeModal" prepend-icon="mdi-arrow-left-circle">Retour</v-btn>
      <v-btn density="comfortable" v-if="props.mode !== 'view'" color="success" type="submit" prepend-icon="mdi-content-save">{{ btTitle }}</v-btn>
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
    .get(`${config.API_BASE_URL}/api/type_cheptel/`)
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
<style scoped>
.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.disable-events {
  pointer-events: none
}
</style>
