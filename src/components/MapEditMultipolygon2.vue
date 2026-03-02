<template>
  <div>
    <div id="map-container">
      <div id="map"></div>
    </div>

    <button type="button" @click="toggleEditMode">
      {{ editingMode ? "Annuler" : "Éditer" }}
    </button>
    <button type="button" v-if="editingMode" @click="saveGeometry">Valider</button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, toRaw, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

// --- Fonds de carte ---
const ignscan25 = L.tileLayer(
  "https://data.geopf.fr/private/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
    "&FORMAT=image/jpeg&STYLE=normal&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR" +
    "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws",
  {
    attribution: "IGN-F/Geoportail",
    maxZoom: 16,
    minZoom: 5,
  }
);

const osmplan = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
});

const cadastr = L.tileLayer(
  "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
  {
    attribution: "IGN-F",
    maxZoom: 19,
  }
);

const baseMaps = {
  "IGN Scan25": ignscan25,
  "OpenStreetMap": osmplan,
  "Parcelles cadastrales": cadastr,
};

// --- Props & emits ---
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => null,
  },
  geometryType: {
    type: String,
    required: true,
    validator: (value) => ["Point", "LineString", "Polygon", "MultiPolygon"].includes(value),
  },
  referenceGeometry: {
    type: Object,
    required: false,
    default: () => null,
  },
});

const emit = defineEmits(["update:modelValue"]);

// --- Variables globales ---
let map;
let drawControl;
let drawnItems;
let originalData;
const editingMode = ref(false);
const jsonCoordinates = ref("");

let referenceLayer;

// --- Initialisation ---
onMounted(async () => {
  await nextTick();

  // Création de la carte avec un zoom max "global"
  map = L.map("map", {
    zoomControl: false,
    layers: [osmplan],
    minZoom: 5,
    maxZoom: 19, // max général, adapté ensuite dynamiquement
  });

  // Contrôle des fonds de carte
  L.control.layers(baseMaps).addTo(map);

  // --- Synchronisation du zoom max selon le fond sélectionné ---
  map.on("baselayerchange", function (e) {
    if (e.name === "IGN Scan25") {
      map.setMaxZoom(16);
      if (map.getZoom() > 16) map.setZoom(16);
    } else {
      map.setMaxZoom(19);
    }
  });

  // --- Groupes de données ---
  originalData = new L.FeatureGroup().addTo(map);
  drawnItems = new L.FeatureGroup().addTo(map);

  if (props.referenceGeometry) {
    referenceLayer = new L.FeatureGroup();
    displayReferenceGeometry();
    referenceLayer.addTo(map);
  }

  const myIcon = L.icon({
    iconUrl: `/images/marqueur_rouge.png`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [15, -42],
  });

  // --- Contrôle de dessin ---
  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      edit: props.geometryType !== "Point" ? {} : false,
      remove: props.geometryType !== "Point" ? {} : false,
    },
    draw: {
      marker: props.geometryType === "Point" ? { icon: myIcon } : false,
      polygon: props.geometryType === "Polygon" || props.geometryType === "MultiPolygon",
      polyline: props.geometryType === "LineString",
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
  });

  // --- Événements dessin ---
  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer;
    if (props.geometryType === "Point") drawnItems.clearLayers();
    drawnItems.addLayer(layer);
    updateGeometry();
  });

  map.on(L.Draw.Event.EDITED, updateGeometry);
  map.on(L.Draw.Event.DELETED, updateGeometry);

  // --- Chargement des géométries existantes ---
  if (props.modelValue && props.modelValue.coordinates) {
    displayOriginalGeometry();
  }

  if (props.referenceGeometry) {
    displayReferenceGeometry();
  }
});

// --- Watchers ---
watch(
  () => props.modelValue,
  (newGeometry) => {
    
    if (!map || !drawnItems || !originalData) return; // ✅ évite l’erreur avant init

    if (newGeometry && newGeometry.coordinates) {
      displayOriginalGeometry();
    } else if (map) {
      map.setView([45.3405, 6.7533], 10);
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.referenceGeometry,
  () => {
    if (props.referenceGeometry) displayReferenceGeometry();
  },
  { deep: true }
);

// --- Fonctions d'affichage ---
function displayReferenceGeometry() {
  
  // ✅ Sécurisation : si la carte n’est pas prête, on sort
  if (!map || !drawnItems || !originalData) return;

  if (!props.referenceGeometry) return;
  referenceLayer.clearLayers();

  const rawReference = toRaw(props.referenceGeometry);
  if (rawReference.type === "FeatureCollection") {
    rawReference.features.forEach((feature) => {
      if (
        feature.geometry &&
        (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon")
      ) {
        const polygons =
          feature.geometry.type === "MultiPolygon"
            ? feature.geometry.coordinates.map((p) =>
                p.map((ring) => ring.map(([lng, lat]) => [lat, lng]))
              )
            : [
                feature.geometry.coordinates.map((ring) =>
                  ring.map(([lng, lat]) => [lat, lng])
                ),
              ];

        polygons.forEach((polygon) =>
          L.polygon(polygon, {
            color: "blue",
            weight: 1,
            opacity: 0.8,
            fill: false,
            dashArray: "5, 5",
          }).addTo(referenceLayer)
        );
      }
    });

    // const bounds = referenceLayer.getBounds();
    // if (bounds.isValid()) map.fitBounds(bounds);
  }
}

function displayOriginalGeometry() {
  if (!props.modelValue || !props.modelValue.coordinates) return;
  drawnItems.clearLayers();
  originalData.clearLayers();

  const rawModelValue = toRaw(props.modelValue);

  if (props.modelValue.type === "Point") {
    const [lng, lat] = props.modelValue.coordinates;
    const myIcon = L.icon({
      iconUrl: `/images/marqueur_bleu.png`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [15, -42],
    });
    if (typeof lng === "number" && typeof lat === "number")
      L.marker([lat, lng], { icon: myIcon }).addTo(originalData);
  } else if (props.modelValue.type === "LineString") {
    // LineString: coordinates is an array of [lng, lat]
    const latlngs = props.modelValue.coordinates.map(([lng, lat]) => [lat, lng]);
    L.polyline(latlngs, {
      color: "red",
      weight: 2,
      opacity: 1,
    }).addTo(originalData);
    // also add to drawnItems for editing preview
    L.polyline(latlngs, {
      color: "#F16E60",
      weight: 3,
      opacity: 0.6,
    }).addTo(drawnItems);
  } else {
    const polygons =
      props.modelValue.type === "MultiPolygon"
        ? props.modelValue.coordinates.map((p) =>
            p.map((ring) => ring.map(([lng, lat]) => [lat, lng]))
          )
        : [
            props.modelValue.coordinates.map((ring) =>
              ring.map(([lng, lat]) => [lat, lng])
            ),
          ];

    polygons.forEach((polygon) => {
      L.polygon(polygon, {
        color: "red",
        weight: 2,
        opacity: 1,
        fill: false,
        dashArray: "10",
      }).addTo(originalData);

      L.polygon(polygon, {
        fillColor: "#F16E60",
        fillOpacity: 0.4,
        weight: 0,
      }).addTo(drawnItems);
    });
  }

  const bounds = drawnItems.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds);
  else map.setView([45.3405, 6.7533], 10);
  map.invalidateSize();
}

// --- Mise à jour géométrie ---
function updateGeometry() {
  const geojson = { type: props.modelValue.type, coordinates: [] };

  drawnItems.eachLayer((layer) => {
    const targetType = (props.modelValue && props.modelValue.type) || props.geometryType;
    if (targetType === "Point") {
      const ll = layer.getLatLng();
      geojson.coordinates = [ll.lng, ll.lat];
    } else if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lng, latlng.lat]);
      if (targetType === "MultiPolygon") geojson.coordinates.push([latlngs]);
      else geojson.coordinates = [latlngs];
    } else if (layer instanceof L.Polyline) {
      // Polyline covers LineString (and Polygon too but polygon handled above)
      const latlngs = layer.getLatLngs().map((latlng) => [latlng.lng, latlng.lat]);
      geojson.coordinates = latlngs;
    }
  });

  jsonCoordinates.value = JSON.stringify(geojson.coordinates);
}

// --- Sauvegarde ---
function saveGeometry() {
  const targetType = (props.modelValue && props.modelValue.type) || props.geometryType;
  const geojson = { type: targetType, coordinates: [] };
  drawnItems.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      geojson.coordinates = [layer.getLatLng().lng, layer.getLatLng().lat];
    } else if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lng, latlng.lat]);
      if (
        latlngs.length > 2 &&
        (latlngs[0][0] !== latlngs[latlngs.length - 1][0] ||
          latlngs[0][1] !== latlngs[latlngs.length - 1][1])
      )
        latlngs.push(latlngs[0]);

      if (targetType === "MultiPolygon") geojson.coordinates.push([latlngs]);
      else geojson.coordinates = [latlngs];
    } else if (layer instanceof L.Polyline) {
      const latlngs = layer.getLatLngs().map((latlng) => [latlng.lng, latlng.lat]);
      geojson.coordinates = latlngs;
    }
  });

  toggleEditMode();
  jsonCoordinates.value = JSON.stringify(geojson.coordinates);
  emit("update:modelValue", geojson);
}

// --- Mode édition ---
function toggleEditMode() {
  editingMode.value = !editingMode.value;
  if (editingMode.value) map.addControl(drawControl);
  else {
    map.removeControl(drawControl);
    displayOriginalGeometry();
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>
