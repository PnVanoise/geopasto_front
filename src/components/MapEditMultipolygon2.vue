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

// Fonds de carte
const ignscan25 = L.tileLayer(
  "https://data.geopf.fr/private/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
    "&FORMAT=image/jpeg&STYLE=normal&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR" +
    "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws",
  {
    attribution: "IGN-F/Geoportail",
  }
);

const osmplan = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
});

const baseMaps = {
  "IGN Scan25": ignscan25,
  OpenStreetMap: osmplan,
};

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => null,
  },
  geometryType: {
    type: String,
    required: true, // Le type de géométrie doit être spécifié
    validator: (value) => ["Point", "Polygon", "MultiPolygon"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue"]);

let map;
let drawControl;
let drawnItems;
let originalData;
const editingMode = ref(false);
const jsonCoordinates = ref("");

onMounted(async () => {
  await nextTick();

  // Initialisation de la carte
  map = L.map("map", {
    zoomControl: false,
    layers: [osmplan],
  });

  // Contrôle fonds de carte
  L.control.layers(baseMaps).addTo(map);

  // Initialisation des groupes des polygones
  originalData = new L.FeatureGroup().addTo(map);
  drawnItems = new L.FeatureGroup().addTo(map);

  const myIcon = L.icon({
    iconUrl: `/images/marqueur_rouge.png`, // Utilisation de l'image du dossier public
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [15, -42],
  });

  // Initialisation du controle de dessin
  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      edit: props.geometryType !== "Point" ? {} : false, // Désactiver le bouton d'édition pour les points
      remove: props.geometryType !== "Point" ? {} : false,
    },
    draw: {
      marker: props.geometryType === "Point" ? { icon: myIcon } : false, // Activer uniquement pour les points
      polygon: props.geometryType === "Polygon" || props.geometryType === "MultiPolygon", // Pour polygone et multipolygone
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
  });

  // Centrer la carte sur les polygones
  const bounds = drawnItems.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds);
  }

  map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    if (props.geometryType === "Point") {
      drawnItems.clearLayers();
    }
    drawnItems.addLayer(layer);
    updateGeometry();
  });

  map.on(L.Draw.Event.EDITED, updateGeometry);
  map.on(L.Draw.Event.DELETED, updateGeometry);

  // Chargement des polygones
  if (props.modelValue && props.modelValue.coordinates) {
    displayOriginalGeometry();
  }
});

watch(
  () => props.modelValue,
  (newGeometry) => {
    if (newGeometry && newGeometry.coordinates && newGeometry.coordinates.length === 2) {
      console.log("Coordonnées valides : ", newGeometry.coordinates);
      displayOriginalGeometry(); // Méthode qui met à jour la carte avec les coordonnées
    } else {
      console.warn("Coordonnées invalides ou non définies");
      if (map) map.setView([45.3405, 6.7533], 10);
    }
  },
  { immediate: true, deep: true }
);
// watch(
//   () => props.modelValue?.geometry,
//   (newGeometry) => {
//     if (
//       !newGeometry ||
//       !newGeometry.coordinates ||
//       newGeometry.coordinates.length !== 2
//     ) {
//       console.log("Coordonnées non prêtes, attente de la mise à jour...");
//       return;
//     }

//     if (newGeometry && newGeometry.coordinates && newGeometry.coordinates.length === 2) {
//       console.log("Coordonnées valides : ", newGeometry.coordinates);
//       displayOriginalGeometry(); // Méthode qui met à jour la carte avec les coordonnées
//     } else {
//       console.warn("Coordonnées invalides ou non définies");
//     }
//   },
//   { immediate: true, deep: true }
// );

function displayOriginalGeometry() {
  if (!props.modelValue || !props.modelValue.coordinates) {
    console.warn("modelValue ou ses coordonnées sont manquantes");
    return;
  }
  if (drawnItems && originalData) {
    drawnItems.clearLayers();
    originalData.clearLayers();

    const rawModelValue = toRaw(props.modelValue);
    console.log("RAW modelValue:", rawModelValue);

    if (props.modelValue.type === "Point" && props.modelValue.coordinates) {
      console.log("Coordonnées du point :", props.modelValue.coordinates);

      const [lng, lat] = props.modelValue.coordinates;

      const myIcon = L.icon({
        iconUrl: `/images/marqueur_bleu.png`, // Utilisation de l'image du dossier public
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [15, -42],
      });

      // Vérifie que lng et lat sont définis et valides
      if (typeof lng === "number" && typeof lat === "number") {
        // Affiche le point sur la carte
        L.marker([lat, lng], { icon: myIcon }).addTo(originalData);
      } else {
        console.error("Coordonnées du point non valides :", props.modelValue.coordinates);
      }
    } else if (
      props.modelValue.type === "Polygon" ||
      props.modelValue.type === "MultiPolygon"
    ) {
      // Logique déjà en place pour afficher les polygones
      let polygons = [];
      if (props.modelValue.type === "MultiPolygon") {
        polygons = props.modelValue.coordinates.map((polygon) =>
          polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng]))
        );
      } else if (props.modelValue.type === "Polygon") {
        polygons = [
          props.modelValue.coordinates.map((ring) =>
            ring.map(([lng, lat]) => [lat, lng])
          ),
        ];
      }

      // Ajout des polygones sur la carte
      polygons.forEach((polygon) => {
        L.polygon(polygon, {
          color: "red",
          weight: "2",
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
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    } else {
      // const latlng = originalData.getLayers()[0].getLatLng();
      // map.setView(latlng, 15);
      map.setView([45.3405, 6.7533], 10);
    }

    // Gestion de Polygon et MultiPolygon

    map.invalidateSize();
  }
}

// Met à jour la géométrie en mémoire en fonction du type de géométrie
// Point, Polygone --> on n'en garde qu'un en mémoire, on peut donc vider drawItems
// MultiXXX --> on cumule
function updateGeometry() {
  const geojson = {
    type: props.modelValue.type, // Récupère le type initial : Polygon ou MultiPolygon
    coordinates: [],
  };

  console.log("props.modelValue.type", props.modelValue.type);

  drawnItems.eachLayer((layer) => {
    // Gérer le type de géométrie
    if (props.modelValue.type === "Point") {
      console.log("each layer point :", layer.getLatLng());
      geojson.coordinates = [layer.getLatLng().lat, layer.getLatLng().lng];
      console.log("geojson.coordinates", geojson.coordinates);
    } else if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lng, latlng.lat]);

      if (props.modelValue.type === "MultiPolygon") {
        console.log("each layer multi :", latlngs);
        geojson.coordinates.push([latlngs]);
      } else if (props.modelValue.type === "Polygon") {
        console.log("each layer poly :", latlngs);
        geojson.coordinates = [latlngs]; // Polygon a une seule entrée de coordonnée
      }
    }
  });

  jsonCoordinates.value = JSON.stringify(geojson.coordinates);
}

// Met à jour la géométrie de l'objet du formulaire avec la géométrie en cours d'édition
function saveGeometry() {
  const geojson = {
    type: props.modelValue.type, // Conserver le type original
    coordinates: [],
  };

  drawnItems.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      geojson.coordinates = [layer.getLatLng().lng, layer.getLatLng().lat];
    } else if (layer instanceof L.Polygon) {
      const latlngs = layer.getLatLngs()[0].map((latlng) => [latlng.lng, latlng.lat]);

      // Fermer l'anneau si nécessaire
      if (
        latlngs.length > 2 &&
        (latlngs[0][0] !== latlngs[latlngs.length - 1][0] ||
          latlngs[0][1] !== latlngs[latlngs.length - 1][1])
      ) {
        latlngs.push(latlngs[0]);
      }

      // Gérer le type de géométrie
      if (props.modelValue.type === "MultiPolygon") {
        geojson.coordinates.push([latlngs]);
      } else if (props.modelValue.type === "Polygon") {
        geojson.coordinates = [latlngs];
      }
    }
  });

  toggleEditMode();
  jsonCoordinates.value = JSON.stringify(geojson.coordinates);
  emit("update:modelValue", geojson);
}

function toggleEditMode() {
  editingMode.value = !editingMode.value;
  if (editingMode.value) {
    map.addControl(drawControl);
  } else {
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
