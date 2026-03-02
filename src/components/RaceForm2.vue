<template>
  <form @submit.prevent="submitForm">
    <div class="w3-row form-ligne">
      <div class="w3-half form-cell">
        <label for="description">Description:</label>
        <input
          class="w3-input w3-border"
          v-model="form.description"
          id="description"
          :disabled="props.isReadOnly"
        />
      </div>
      <div class="w3-half form-cell">
        <label for="espece">Espèce:</label>
        <select
          class="w3-input w3-border"
          id="espece"
          v-model="form.espece"
          :disabled="props.mode === 'view' || !can('change')"
        >
          <option v-for="espece in especes" :key="espece.id_espece" :value="espece.id_espece">
            {{ espece.description }}
          </option>
        </select>
      </div>
      <!-- next id pour debug -->
      <div v-if="props.mode === 'add'" class="form-ligne">
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

const { can } = usePermissions("race");

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
  espece: "",
 });

const especes = ref([]);

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
      .get(`${config.API_BASE_URL}/api/race/getNextId/`)
      .then(res => {
        nextId.value = res.data.next_id;
        form.id_race = nextId.value;
      })
      .catch(err => console.error("Erreur Next ID", err));
  };

  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/espece/`)
    .then((response) => {
      especes.value = response.data;
      console.log("Espèces:", especes.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des espèces", error);
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
