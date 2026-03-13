<template>
  <h3 class="w3-center w3-margin">{{ formTitle }}</h3>
  <form @submit.prevent="submitForm">
    <!-- <div class="w3-row form-ligne"> -->
    <div class="w3-half form-cell">
      <label for="description">Description:</label>
      <input
        class="w3-input w3-border"
        type="text"
        id="description"
        v-model="form.description"
        required
        :disabled="props.isReadOnly"
      />
    </div>
    <div class="w3-half form-cell">
      <label for="commentaire">Commentaire:</label>
      <input
        class="w3-input w3-border"
        type="text"
        id="commentaire"
        v-model="form.commentaire"
        required
        :disabled="props.isReadOnly"
      />
    </div>
    <div class="w3-half form-cell">
      <label for="debut_periode">Date Début Période:</label>
      <input
        class="w3-input w3-border"
        type="date"
        id="debut_periode"
        v-model="form.debut_periode"
        @keydown.prevent
        @paste.prevent
        required
        :disabled="props.isReadOnly"
      />
    </div>
    <div class="w3-half form-cell">
      <label for="fin_periode">Date Fin Période:</label>
      <input
        class="w3-input w3-border"
        type="date"
        id="fin_periode"
        v-model="form.fin_periode"
        @keydown.prevent
        @paste.prevent
        required
        :disabled="props.isReadOnly"
      />
    </div>
    <div class="w3-half form-cell">
      <label for="typedemesure">Type de mesure:</label>
      <select
        class="w3-input w3-border"
        v-model="form.type_mesure"
        id="typedemesure"
        :disabled="props.isReadOnly"
      >
        <option
          v-for="typemesure in typemesures"
          :key="typemesure.id_type_mesure"
          :value="typemesure.id_type_mesure"
        >
          {{ typemesure.description }}
        </option>
      </select>
    </div>
    <div class="w3-half form-cell">
      <label for="plandesuivi">Plan de suivi:</label>
      <select
        class="w3-input w3-border"
        v-model="form.plan_suivi"
        id="plandesuivi"
        :disabled="props.isReadOnly"
      >
        <option
          v-for="plansuivi in plansuivis"
          :key="plansuivi.id_plan_suivi"
          :value="plansuivi.id_plan_suivi"
        >
          {{ plansuivi.description }}
        </option>
      </select>
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

const { can } = usePermissions("mesuredeplan");

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
  description: "",
  commentaire: "",
  debut_periode: "",
  fin_periode: "",
});

const typemesures = ref([]);
const plansuivis = ref([]);

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
      .get(`${config.API_BASE_URL}/api/mesurePlan/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.id_mesure_plan = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }

  // Récupère les types de mesure
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/typeMesure/`)
    .then((response) => {
      typemesures.value = response.data;
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des types de mesure",
        error
      );
    });

  // Récupère les plans de suivi
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/planSuivi/`)
    .then((response) => {
      plansuivis.value = response.data;
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des plans de suivi",
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
