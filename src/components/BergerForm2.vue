<template>
  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="nom">Nom:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="nom"
          v-model="form.nom_berger"
          required
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="prenom">Prénom:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="prenom"
          v-model="form.prenom_berger"
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="tel">Téléphone:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="tel"
          v-model="form.tel_berger"
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="adresse">Adresse:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="adresse"
          v-model="form.adresse_berger"
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="comm">Commentaire:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="comm"
          v-model="form.commentaire"
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
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

const { can } = usePermissions("berger");

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
  nom_berger: "",
  prenom_berger: "",
  tel_berger: "",
  adresse_berger: "",
  commentaire: "",
 });

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
      .get(`${config.API_BASE_URL}/api/berger/getNextId/`)
      .then(res => {
        nextId.value = res.data.next_id;
        form.id_berger = nextId.value;
      })
      .catch(err => console.error("Erreur Next ID", err));
  };
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
