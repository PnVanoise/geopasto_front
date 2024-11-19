<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String,
  bgColor: String,
  columnLabels: Object,
});

const emit = defineEmits(["edit", "delete"]);

const sortKey = ref("");
const sortOrders = ref(props.columns.reduce((o, key) => ((o[key] = 1), o), {}));

const filteredData = computed(() => {
  let { data, filterKey } = props;
  if (filterKey) {
    filterKey = filterKey.toLowerCase();
    data = data.filter((row) => {
      return Object.keys(row).some((key) => {
        return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
      });
    });
  }
  const key = sortKey.value;
  if (key) {
    const order = sortOrders.value[key];
    data = data.slice().sort((a, b) => {
      a = a[key];
      b = b[key];
      return (a === b ? 0 : a > b ? 1 : -1) * order;
    });
  }
  return data;
});

function sortBy(key) {
  sortKey.value = key;
  sortOrders.value[key] *= -1;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function handleEdit(entry) {
  emit("edit", entry);
}

function handleDelete(entry) {
  emit("delete", entry);
}

function handleView(entry) {
  console.log("TODO view entry", entry);
}
</script>

<template>
  <div class="liste-container">
    <table
      v-if="filteredData.length"
      :style="{ borderColor: props.bgColor }"
      class="table-with-fixed-header"
    >
      <thead>
        <tr>
          <th
            v-for="key in columns"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
            :style="{ backgroundColor: props.bgColor }"
          >
            {{ props.columnLabels[key] || capitalize(key) }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"> </span>
          </th>
          <th :style="{ backgroundColor: props.bgColor }">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in filteredData" :key="entry.id">
          <td v-for="key in columns" :key="key">
            <!-- Affiche une checkbox si la colonne est booléenne -->
            <template v-if="typeof entry[key] === 'boolean'">
              <input type="checkbox" :checked="entry[key]" disabled />
            </template>
            <template v-else>
              {{ entry[key] }}
            </template>
          </td>
          <td>
            <font-awesome-icon icon="edit" class="icon-edit" @click="handleEdit(entry)" />
            <font-awesome-icon
              icon="trash"
              class="icon-delete"
              @click="handleDelete(entry)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Aucun résultat.</p>
  </div>
</template>

<style>
/* Styles pour l'icône "Afficher" */
.icon-view {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #2ecc71; /* Vert vif */
}

.icon-view:hover {
  color: #27ae60; /* Vert plus foncé au survol */
}
/* Styles pour l'icône d'édition */
.icon-edit {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #3498db; /* Couleur bleu vif */
}

.icon-edit:hover {
  color: #2980b9; /* Bleu légèrement plus foncé au survol */
}

/* Styles pour l'icône de suppression */
.icon-delete {
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.2em;
  color: #e74c3c; /* Couleur rouge vif */
}

.icon-delete:hover {
  color: #c0392b; /* Rouge plus foncé au survol */
}

.liste-container {
  max-height: 550px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 0;
}

.table-with-fixed-header {
  width: 100%;
  border-collapse: collapse;
}

.table-with-fixed-header thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #42b983; /* Utilisez votre couleur de fond */
}

.table-with-fixed-header th,
.table-with-fixed-header td {
  min-width: 120px;
  padding: 10px 20px;
  text-align: left;
}

.table-with-fixed-header th {
  background-color: #42b983; /* Utilisez votre couleur de fond */
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
}

.table-with-fixed-header tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-with-fixed-header tbody tr:nth-child(odd) {
  background-color: #fff;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
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
</style>
