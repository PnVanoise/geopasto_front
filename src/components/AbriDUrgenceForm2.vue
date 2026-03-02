<template>
  <h3 class="w3-center w3-margin">{{ formTitle }}</h3>

  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="desc">Description:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="desc"
          v-model="form.description"
          required
          :disabled="props.mode === 'view' || !can('change')"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="etat">Etat:</label>
        <input
          class="w3-input w3-border"
          type="text"
          id="etat"
          v-model="form.etat"
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

    <div class="grid-container" style="margin-top:1rem;">
      <label>Commodités associées :</label>
      <!-- If parent form is in creation mode, prevent adding child commodites until saved -->
      <template v-if="props.mode === 'add'">
        <div class="w3-panel w3-pale-yellow" style="padding:12px; border:1px solid #ddd;">
          Enregistrez l'abri d'urgence pour pouvoir ajouter des commodités.
        </div>
      </template>
      <template v-else>
        <CrudList2
          title="Commodités"
          modelName="abridurgencecommodite"
          apiRouteName="abriDUrgenceCommodite"
          itemLabel="une commodité d'abri"
          idField="id_abri_urgence_commodite"
          :columns="commGridColumns"
          :formComponent="AbriDUrgenceCommoditeForm"
          :bgColor="'#154889'"
          :filters="commFilters"
          :showTitle="false"
          :showHeader="true"
          :showSearch="true"
          :showFilters="false"
          :forceAdd="false"
          :viewOnly="props.mode === 'view'"
          :initialNewItem="{ abri_urgence: form.id_abri_urgence }"
        />
      </template>
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
import CrudList2 from './CrudList2.vue';
import AbriDUrgenceCommoditeForm from './AbriDUrgenceCommoditeForm.vue';
import { useMainStore } from '../store';

const props = defineProps({
  initialForm: { type: Object, default: () => ({}) },
  mode: { type: String, default: "view" }, // add | change | view
  isEdit: { type: Boolean, default: undefined },
  itemLabel: { type: String, required: true },
  onSubmit: Function,
  onClose: Function,
});

const { can } = usePermissions("abridurgence");

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
  etat: "",
});

// abri commodites
const commGridColumns = ref([
  { field: 'abri_urgence_description', label: 'Abri', sortable: true },
  { field: 'commodite_desc', label: 'Commodité', sortable: true },
  { field: 'etat', label: 'État', sortable: true },
  { field: 'quantite', label: 'Quantité', sortable: true },
]);

// Filter for CrudList2 to show only commodites for current abri
const commFilters = ref([
  {
    key: 'abriFilter',
    type: 'hidden',
    default: '',
    apply: (items, _value) => {
      if (!form.id_abri_urgence) return [];
      return (items || []).filter(i => i.abri_urgence === form.id_abri_urgence);
    }
  }
]);

const showCommoditeModal = ref(false);
const isEditCommodite = ref(false);
const selectedCommodite = ref({});
const mainStore = useMainStore();

// props.initialForm is assigned above; no duplicate watcher needed

// Next ID pour l'ajout
const nextId = ref(null);
onMounted(() => {
  if (props.mode === "add") {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/abriDUrgence/getNextId/`)
      .then(res => {
        nextId.value = res.data.next_id;
        form.id_abri_urgence = nextId.value;
      })
      .catch(err => console.error("Erreur Next ID", err));
  };

  // fetch commodites for current abri if present (handled by CrudList2)
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

watch(
  () => props.initialForm,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal);
    }
  },
  { immediate: true }
);

// CRUD of commodites handled by CrudList2; local helpers removed.
</script>
