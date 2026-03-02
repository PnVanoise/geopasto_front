<template>
  <h3 class="w3-center w3-margin">{{ formTitle }}</h3>

  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="situation">Situation:</label>
        <select
          class="w3-input w3-border"
          v-model="form.situation_exploitation"
          id="situation"
          :disabled="props.mode === 'view' || !can('change')"
        >
          <option
            v-for="situation in situations"
            :key="situation.id_situation"
            :value="situation.id_situation"
          >
            {{ situation.nom_situation }}
          </option>
        </select>
      </div>
      <div class="w3-half form-cell">
        <label for="berger">Berger:</label>
        <select
          class="w3-input w3-border"
          v-model="form.berger"
          id="berger"
          :disabled="props.mode === 'view' || !can('change')"
        >
          <option
            v-for="berger in bergers"
            :key="berger.id_berger"
            :value="berger.id_berger"
          >
            {{ berger.prenom_berger }} {{ berger.nom_berger }}
          </option>
        </select>
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="dateDebut">Date de début:</label>
        <input
          class="w3-input w3-border"
          type="date"
          id="dateDebut"
          v-model="form.date_debut"
          @keydown.prevent
          @paste.prevent
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="dateFin">Date de fin:</label>
        <input
          class="w3-input w3-border"
          type="date"
          id="dateFin"
          v-model="form.date_fin"
          @keydown.prevent
          @paste.prevent
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <div class="form-cell">
        <label for="commentaire">Commentaire:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="commentaire"
          v-model="form.commentaire"
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
    </div>
    <div class="w3-row form-ligne">
      <!-- next id pour debug -->
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

const { can } = usePermissions("gardesituation");

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
  situation_exploitation: "",
  berger: "",
  date_debut: "",
  date_fin: "",
  commentaire: "",
});

const situations = ref([]);
const bergers = ref([]);

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
      .get(`${config.API_BASE_URL}/api/gardeSituation/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.id_garde_situation = nextId.value;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }

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

  // Récupère les bergers
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/berger/`)
    .then((response) => {
      bergers.value = response.data;
      console.log("bergers:", bergers.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des bergers.", error);
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
