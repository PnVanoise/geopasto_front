<template>
  <div>
    <h2 v-if="props.showTitle" class="w3-center">{{ title }}</h2>

    <div v-if="props.showHeader" class="header-actions">
      <input
        v-if="props.showSearch"
        type="text"
        v-model="searchQuery"
        placeholder="Recherche..."
      />
      <!-- Rendu automatique des filtres -->
      <template v-if="props.showFilters" v-for="filter in props.filters" :key="filter.key">
        <!-- Checkbox -->
        <label v-if="filter.type === 'checkbox'" style="margin: 0 10px;">
          <input
            type="checkbox"
            :checked="activeFilters[filter.key]"
            @change="onCheckboxChange($event, filter.key)"
          />
          {{ filter.label }}
        </label>

        <!-- Select -->
        <label v-if="filter.type === 'select'" style="margin: 0 10px;">
          {{ filter.label }}
          <select v-model="activeFilters[filter.key]">
            <option value="">-- Tous --</option>
            <option
              v-for="opt in unref(filter.options) || []"
              :key="opt.value ?? opt.label"
              :value="opt.value ?? opt.label"
            >
              {{ opt.label }}
            </option>
          </select>
        </label>
      </template>

      <button
        type="button"
        class="w3-button add-btn"
        v-if="props.showAddButton && !props.viewOnly && (crud.can('add') || props.forceAdd)"
        @click="crud.openAdd"
      >
        <font-awesome-icon icon="plus" /> Ajouter
      </button>
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

</style>