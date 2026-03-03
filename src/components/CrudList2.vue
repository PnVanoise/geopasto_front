<template>
  <div>
    <h2 v-if="props.showTitle" class="w3-center">{{ title }}</h2>

    <div v-if="props.showHeader" class="header-actions">
      <v-text-field
      density="compact"
          v-if="props.showSearch"
          class="search-field"
          v-model="searchQuery"
          label="Recherche"
          dense
          hide-details
          clearable
          append-inner-icon="mdi-magnify"
      />
      <!-- Rendu automatique des filtres -->
      <template v-if="props.showFilters" v-for="filter in props.filters" :key="filter.key">
        <!-- Checkbox -->
        <div v-if="filter.type === 'checkbox'" style="margin: 0 10px;">
          <v-switch
            v-model="activeFilters[filter.key]"
            :label="filter.label"
            dense
            hide-details
            density="compact"
          />
        </div>

        
        <!-- Select -->
        <div v-if="filter.type === 'select'" style="margin: 0 10px; min-width:200px;">
          <v-select
            :items="[{ value: '', label: '-- Tous --' }].concat(unref(filter.options) || [])"
            item-title="label"
            item-value="value"
            v-model="activeFilters[filter.key]"
            :label="filter.label"
            dense
            hide-details
            clearable
            density="compact"
          />
        </div>
      </template>

      
      <v-btn
        v-if="props.showAddButton && !props.viewOnly && (crud.can('add') || props.forceAdd)"
        color="info"
        @click="crud.openAdd"
        prepend-icon="mdi-plus-circle">
        Ajouter</v-btn>
      
      <!-- <button
        type="button"
        class="w3-button add-btn"
        v-if="props.showAddButton && !props.viewOnly && (crud.can('add') || props.forceAdd)"
        @click="crud.openAdd"
      >
          <font-awesome-icon icon="plus" /> Ajouter
      </button> -->
    </div>

    <Grid3
      :data="filteredEntries"
      :columns="columns"
      :actions="computedActions"
      :idField="idField"
      :bgColor="bgColor"
      @view="crud.openView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <Modal :show="crud.showModal.value" @close="crud.closeModal">
      <component
        :is="formComponent"
        :initialForm="crud.selectedItem.value"
        :itemLabel="itemLabel"
        :mode="crud.mode.value"
        :onClose="crud.closeModal"
        :onSubmit="handleSubmit"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, unref, computed, onMounted, watch } from "vue";
import Grid3 from "./Grid3.vue";
import Modal from "./Modal.vue";
import { useCrud } from "../composables/useCrud";

const props = defineProps({
  modelName: String,
  apiRouteName: String,
  title: String,
  itemLabel: { type: String, default: "élément" },
  columns: Array,
  idField: { type: String, default: "id" },
  formComponent: Object,
  bgColor: { type: String, default: "#808080" },
  showYearFilter : { type : Boolean, default: false },
  searchFields: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Array,
    default: () => []
  },
  // UI control when embedded
  showTitle: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  showFilters: { type: Boolean, default: true },
  showAddButton: { type: Boolean, default: true },
  forceAdd: { type: Boolean, default: false },
  initialNewItem: { type: Object, default: null },
  viewOnly: { type: Boolean, default: false },
});
const crud = useCrud(props.modelName, props.apiRouteName, props.idField);
const searchQuery = ref("");
const activeFilters = ref({});

// Initialise les filtres avec leurs valeurs par défaut
props.filters.forEach(f => {
  activeFilters.value[f.key] = f.default ?? "";
});

// Gestion manuelle des changements
function onSelectChange(event, key) {
  activeFilters.value = {
    ...activeFilters.value,
    [key]: event.target.value
  };
}

function onCheckboxChange(event, key) {
  activeFilters.value = {
    ...activeFilters.value,
    [key]: event.target.checked
  };
}

// Computed pour filtrer les données
const filteredEntries = computed(() => {
  let items = crud.items.value;

  // Recherche
  if(searchQuery.value && searchQuery.value.trim() !== "") {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(item => {
      if (props.searchFields.length === 0) {
        return JSON.stringify(item).toLowerCase().includes(q);
      }
      return props.searchFields.some(field => {
        const value = getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(q);
      });
    });
  }

  // Application des filtres
  props.filters.forEach(f => {
    const value = activeFilters.value[f.key];
    items = f.apply(items, value);
  });

  return items;
});

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

onMounted(crud.fetchAll);

// If initialNewItem is provided, prefill selectedItem when entering add mode
watch(() => crud.mode.value, (m) => {
  if (m === 'add' && props.initialNewItem) {
    crud.selectedItem.value = { ...props.initialNewItem };
  }
});

const handleSubmit = async (formData) => {
  if (crud.mode.value === "add") {
    await crud.createItem(formData);
  } else if (crud.mode.value === "edit" || crud.mode.value === "change") {
    await crud.updateItem(formData);
  }
  crud.closeModal();
};

// If viewOnly is set, restrict actions to view-only in the grid
const computedActions = computed(() => {
  if (props.viewOnly) {
    return { add: false, view: true, edit: false, delete: false };
  }
  return crud.actions;
});

function handleEdit(item) {
  if (props.viewOnly) {
    crud.openView(item);
  } else {
    crud.openEdit(item);
  }
}

function handleDelete(item) {
  if (props.viewOnly) {
    // no-op when in viewOnly
    return;
  }
  crud.deleteItem(item);
}
</script>


<style scoped>

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.header-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* Search occupies one third on the left; Add button aligned to the right */
.header-actions .search-field {
  flex: 0 0 33%;
  min-width: 240px;
}

.header-actions .add-btn {
  margin-left: auto !important;
  flex: 0 0 auto;
  min-width: 140px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

/* Make sure Vuetify field height aligns with the button */
.header-actions .search-field .v-field,
.header-actions .search-field .v-text-field {
  height: 40px;
}

/* Responsive: stack on small screens */
@media (max-width: 600px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .header-actions .search-field,
  .header-actions .add-btn {
    flex: 1 1 auto;
    margin-left: 0;
  }
}
</style>