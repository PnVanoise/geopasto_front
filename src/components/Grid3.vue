<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
  },
  actions: {
    type: Object,
    default: () => ({
      view: true,
      edit: true,
      delete: true,
    }),
  },
  idField: {
    type: String,
    default: "id",
  },
  bgColor: String,
});

const emit = defineEmits(["edit", "delete", "view"]);

// Sorting state (unifié)
const sortField = ref(null);
const sortDirection = ref("asc");

// Computed that applies filter (search) then sorting, used by the template
const displayedData = computed(() => {
  let data = (props.data || []).slice();

  // Tri des données
  if (sortField.value) {
    const field = sortField.value;
    data.sort((a, b) => {
      const valA = nestedValue(a, field);
      const valB = nestedValue(b, field);

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection.value === "asc" ? valA - valB : valB - valA;
      }

      return sortDirection.value === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  return data;
});

function nestedValue(obj, path) {
  return String(path || "").split('.').reduce((o, key) => (o ? o[key] : null), obj);
}

function toggleSort(col) {
  if (!col || !col.sortable) return;

  if (sortField.value === col.field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = col.field;
    sortDirection.value = "asc";
  }
}

// Renvoie la vraie valeur de l'id
const getItemId = (item) => item[props.idField];

const showDeleteModal = ref(false);
const entryToDelete = ref(null);

function confirmDelete(entry) {
  entryToDelete.value = entry;
  showDeleteModal.value = true;
}

function cancelDelete() {
  entryToDelete.value = null;
  showDeleteModal.value = false;
}

function performDelete() {
  if (entryToDelete.value) {
    emit("delete", entryToDelete.value);
    cancelDelete();
  }
}
</script>

<template>
  <div class="liste-container">
    <table
      v-if="displayedData.length"
      :style="{ borderColor: bgColor }"
      class="table-with-fixed-header"
    >
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.field"
            @click="toggleSort(col)"
            @keydown.enter="toggleSort(col)"
            @keydown.space.prevent="toggleSort(col)"
            role="button"
            tabindex="0"
            :aria-sort="sortField === col.field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'"
            :class="{ sortable: col.sortable, active: sortField === col.field }"
            :style="{ backgroundColor: bgColor }"
          >
            {{ col.label }}
            <span class="arrow" :class="sortField === col.field ? (sortDirection === 'asc' ? 'asc' : 'dsc') : ''"></span>
          </th>
          <th :style="{ backgroundColor: bgColor }">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in displayedData" :key="getItemId(entry)">
          <td v-for="col in columns" :key="col.field">
            <template v-if="typeof nestedValue(entry, col.field) === 'boolean'">
              <input type="checkbox" :checked="nestedValue(entry, col.field)" disabled />
            </template>
            <template v-else>
              {{ nestedValue(entry, col.field) ?? '' }}
            </template>
          </td>
          <td>
            <template v-if="actions.view">
              <font-awesome-icon
                icon="eye"
                class="icon-view"
                title="Voir les détails"
                @click="$emit('view', entry)"
              />
            </template>

            <template v-if="actions.edit">
              <font-awesome-icon
                icon="edit"
                class="icon-edit"
                title="Modifier"
                @click="$emit('edit', entry)"
              />
            </template>

            <template v-if="actions.delete">
              <font-awesome-icon
                icon="trash"
                class="icon-delete"
                title="Supprimer"
                @click="confirmDelete(entry)"
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Aucun résultat.</p>
  </div>

  <!-- Modal suppression -->
  <div v-if="showDeleteModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Confirmer la suppression</h3>
      <p>Êtes-vous sûr de vouloir supprimer cet enregistrement ?</p>
      <div class="modal-actions">
        <button type="button" @click="performDelete" class="modal-confirm">Oui, supprimer</button>
        <button type="button" @click="cancelDelete" class="modal-cancel">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-view {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #2ecc71;
}
.icon-view:hover {
  color: #27ae60;
}
.icon-edit {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #3498db;
}
.icon-edit:hover {
  color: #2980b9;
}
.icon-delete {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #e74c3c;
}
.icon-delete:hover {
  color: #c0392b;
}

.liste-container {
  max-height: 550px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.table-with-fixed-header {
  width: 100%;
  border-collapse: collapse;
}

.table-with-fixed-header thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #42b983;
}

.table-with-fixed-header th,
.table-with-fixed-header td {
  min-width: 120px;
  padding: 10px 20px;
  text-align: left;
}

th.active {
  color: #fff;
  background-color: rgba(0,0,0,0.08);
  font-weight: 700;
}

.table-with-fixed-header th:focus {
  outline: 2px solid rgba(66,185,131,0.6);
  outline-offset: 2px;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.modal-confirm {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

.modal-cancel {
  background-color: #bdc3c7;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
