<template>
  <form @submit.prevent="submitForm">
    <div
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: stretch;
      "
    >
      <div style="">
        <div class="w3-half form-cell">
          <label for="exploitant">Exploitant :</label>
          <select
            class="w3-input w3-border"
            v-model="form.properties.exploitant"
            id="proprietaire"
          >
            <option
              v-for="exploitant in exploitants"
              :key="exploitant.id_exploitant"
              :value="exploitant.id_exploitant"
            >
              {{ exploitant.nom_exploitant }}
            </option>
          </select>
        </div>

        <div class="w3-half form-cell">
          <label for="unitepastorale">Unité pastorale:</label>
          <select
            class="w3-input w3-border"
            v-model="form.properties.unite_pastorale"
            id="unitepastorale"
          >
            <option v-for="up in ups.features" :key="up.id" :value="up.id">
              {{ up.properties.nom_up }}
            </option>
          </select>
        </div>

        <div class="w3-half form-cell">
          <label for="dateDebut">Date de début:</label>
          <input
            class="w3-input w3-border"
            type="date"
            id="dateDebut"
            v-model="form.properties.date_debut"
            @keydown.prevent
            @paste.prevent
          />
        </div>
        <div class="w3-half form-cell">
          <label for="dateFin">Date de fin:</label>
          <input
            class="w3-input w3-border"
            type="date"
            id="dateFin"
            v-model="form.properties.date_fin"
            @keydown.prevent
            @paste.prevent
          />
        </div>
        <div class="w3-half form-cell">
          <label for="dateDebutExp">Début période exploitation:</label>
          <input
            class="w3-input w3-border"
            type="date"
            id="dateDebutExp"
            v-model="form.properties.debut_periode_expl"
            @keydown.prevent
            @paste.prevent
          />
        </div>
        <div class="w3-half form-cell">
          <label for="dateFinExp">Fin période exploitation:</label>
          <input
            class="w3-input w3-border"
            type="date"
            id="dateFinExp"
            v-model="form.properties.fin_periode_expl"
            @keydown.prevent
            @paste.prevent
          />
        </div>
        <div class="w3-half form-cell">
          <label for="surfaceloc">Surface location:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="surfaceloc"
            v-model="form.properties.surface_location"
            required
          />
        </div>
        <div class="w3-half form-cell">
          <label for="surfaceexp">Surface exploitable:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="surfaceexp"
            v-model="form.properties.surface_exploitable"
            required
          />
        </div>

        <div class="w3-half form-cell">
          <label for="effBo">Effectif bovin:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="effBo"
            v-model="form.properties.effectif_bovin"
            required
          />
        </div>
        <div class="w3-half form-cell">
          <label for="effOv">Effectif ovin:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="effOv"
            v-model="form.properties.effectif_ovin"
            required
          />
        </div>
        <div class="w3-half form-cell">
          <label for="effCa">Effectif caprin:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="effCa"
            v-model="form.properties.effectif_caprin"
            required
          />
        </div>
        <div class="w3-half form-cell">
          <label for="effPo">Effectif porcin:</label>
          <input
            class="w3-input w3-border"
            type="text"
            id="effPo"
            v-model="form.properties.effectif_porcin"
            required
          />
        </div>

        <!-- next id is readonly -->
        <div v-if="!isEdit" class="form-cell">
          (Next ID:
          {{ nextId }}
          )
        </div>
      </div>
      <div style="">
        <div class="form-cell">
          Géométrie:
          <MapEditMultipolygon2
            :key="form.geometry.coordinates"
            v-model="form.geometry"
            :geometryType="'Polygon'"
          />
        </div>
      </div>
    </div>
    <button type="submit">Enregistrer</button>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

import config from "../../config";
import auth from "../../auth";
import MapEditMultipolygon2 from "./MapEditMultipolygon2.vue";

const props = defineProps({
  initialForm: Object,
  isEdit: Boolean,
  onSubmit: Function,
});

const exploitants = ref([]);
const ups = ref([]);

const form = ref({ ...props.initialForm });

// Variable pour stocker le nextId
const nextId = ref(null);

const submitForm = () => {
  console.log("Form submitted with:", form.value);
  props
    .onSubmit(form.value)
    .then(() => {
      console.log("Form submission then block executed");
    })
    .catch((error) => {
      console.error("There was an error in form submission!", error);
    });
};

watch(
  () => props.initialForm,
  (newForm) => {
    form.value = { ...newForm };
  },
  { deep: true }
);

// Hooks de cycle de vie pour déboguer
onMounted(() => {
  console.log("ConventionForm component mounted");

  if (!props.isEdit) {
    auth.axiosInstance
      .get(`${config.API_BASE_URL}/api/conventionExploitation/getNextId/`)
      .then((response) => {
        nextId.value = response.data.next_id;
        form.value.id = nextId.value; // Optionnel: lier cet ID au formulaire si besoin
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du Next ID", error);
      });
  }

  // Récupère les exploitants
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/exploitant/`)
    .then((response) => {
      exploitants.value = response.data;
      console.log("exploitants:", exploitants.value);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de la liste des exploitants", error);
    });

  // Récupère les unités pastorales
  auth.axiosInstance
    .get(`${config.API_BASE_URL}/api/unitePastorale/`)
    .then((response) => {
      ups.value = response.data;
      console.log("ups:", ups.value);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération de la liste des unités pastorales",
        error
      );
    });
});

onBeforeUnmount(() => {
  console.log("ConventionForm component before unmount");
});
</script>

<style scoped>
.form-ligne {
  padding: 8px;
}

.form-cell {
  padding: 8px;
}
</style>
