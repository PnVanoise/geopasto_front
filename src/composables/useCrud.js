import { ref } from "vue";
import auth from "../../auth";
import config from "../../config";
import { useMainStore } from "../store";
import { usePermissions } from "./usePermissions";

export function useCrud(modelName, apiRouteName, idField = "id") {
  const mainStore = useMainStore();
  const { can, actionsFor } = usePermissions(modelName);

  const items = ref([]);
  const isLoading = ref(false);
  const showModal = ref(false);
  const selectedItem = ref(null);
  const mode = ref("view"); // add | change | view

  const fetchAll = async () => {
    isLoading.value = true;
    try {
      const response = await auth.axiosInstance.get(`${config.API_BASE_URL}/api/${apiRouteName}/`);
      const data = response.data;

      // Si l'API renvoie un FeatureCollection (GeoJSON), le convertir en tableau d'items
      if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
        items.value = data.features.map(f => ({ ...(f.properties || {}), id: f.id || f.properties?.id, geometry: f.geometry }));
      } else {
        items.value = data;
      }
    } catch (err) {
      mainStore.setErrorMessage("Erreur lors du chargement.");
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const getNextId = async () => {
    try {
      const response = await auth.axiosInstance.get(`${config.API_BASE_URL}/api/${apiRouteName}/getNextId/`);
      return response.data.next_id;
    } catch (err) {
      console.error("Erreur next ID", err);
      return null;
    }
  };

  const createItem = async (payload) => {
    await auth.axiosInstance.post(`${config.API_BASE_URL}/api/${apiRouteName}/`, payload);
    mainStore.setSuccessMessage("Créé avec succès !");
    await fetchAll();
  };

  const updateItem = async (payload) => {
    console.log("update / payload :", payload);
    console.log("update / idField :", idField);
    const id = payload[idField];
    if (!id) throw new Error(`ID introuvable pour ${idField}`);
    await auth.axiosInstance.put(`${config.API_BASE_URL}/api/${apiRouteName}/${id}/`, payload);
    mainStore.setSuccessMessage("Modifié avec succès !");
    await fetchAll();
  };

  const deleteItem = async (payload) => {
    const id = payload[idField];
    await auth.axiosInstance.delete(`${config.API_BASE_URL}/api/${apiRouteName}/${id}/`);
    mainStore.setSuccessMessage("Supprimé !");
    await fetchAll();
  };

  const openAdd = async () => {
    mode.value = "add";
    selectedItem.value = {};
    showModal.value = true;
  };

  const openEdit = (item) => {
    mode.value = "change";
    const it = { ...item };
    if (!it[idField] && it.id) it[idField] = it.id;
    selectedItem.value = it;
    showModal.value = true;
  };

  const openView = (item) => {
    mode.value = "view";
    const it = { ...item };
    if (!it[idField] && it.id) it[idField] = it.id;
    selectedItem.value = it;
    showModal.value = true;
  };

  const closeModal = () => {
    console.log("Closing modal");
    showModal.value = false;
    selectedItem.value = null;
  };

  return {
    items,
    isLoading,
    showModal,
    selectedItem,
    mode,
    can,
    actions: actionsFor(),

    fetchAll,
    createItem,
    updateItem,
    deleteItem,
    getNextId,

    openAdd,
    openEdit,
    openView,
    closeModal,
  };
}
