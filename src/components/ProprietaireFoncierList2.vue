<template>
  <CrudList2
    title="Propriétaires fonciers"
    modelName="proprietairefoncier"
    apiRouteName="proprietaireFoncier"
    itemLabel="un propriétaire foncier"
    idField="id_proprietaire"
    :columns="columns"
    :formComponent="ProprietaireFoncierForm2"
    :bgColor="'#808080'"
    :searchFields="searchFields"
  />
</template>

<script setup>
import ProprietaireFoncierForm2 from './ProprietaireFoncierForm2.vue';
import CrudList2 from './CrudList2.vue';

const columns = [
  { field: "description", label: "Description", sortable: true },
  // { field: "prenom_propr", label: "Prénom", sortable: true },
];

const searchFields = [
  'description',
  // 'prenom_propr',
];

</script>