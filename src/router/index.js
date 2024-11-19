import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import AboutView2 from '../views/AboutView2.vue'
import MapView from '../views/MapView.vue'
import AlpageView from '../views/AlpageView.vue'
import TodoView from '../views/TodoView.vue'

import Login from '../components/Login.vue'
import Logout from '../components/Logout.vue'

import LogementList from '../components/LogementList.vue'
import LogementEdit from '../components/LogementEdit.vue'
import LogementAdd from '../components/LogementAdd.vue'

import AlpageList from '../components/AlpageList.vue'
import AlpageEdit from '../components/AlpageEdit.vue'
import AlpageAdd from '../components/AlpageAdd.vue'

import TypeEquipementAlpageList from '../components/TypeEquipementAlpageList.vue'
import TypeEquipementAlpageEdit from '../components/TypeEquipementAlpageEdit.vue'
import TypeEquipementAlpageAdd from '../components/TypeEquipementAlpageAdd.vue'

import EquipementList from '../components/EquipementList.vue'
import EquipementEdit from '../components/EquipementEdit.vue'
import EquipementAdd from '../components/EquipementAdd.vue'

import QuartieralpageList from '../components/QuartieralpageList.vue'
import QuartieralpageView from '../components/QuartieralpageView.vue'

import TestFiltre from '../components/TestFiltre.vue'
import TestForm from '../components/TestForm.vue'

// import TestMap from '../components/TestMap.vue'

import UnitePastoraleList from '../components/UnitePastoraleList.vue'
import UnitePastoraleAdd from '../components/UnitePastoraleAdd.vue'
import UnitePastoraleEdit from '../components/UnitePastoraleEdit.vue'

import ProprietaireFoncierList from '../components/ProprietaireFoncierList.vue'
import ProprietaireFoncierAdd from '../components/ProprietaireFoncierAdd.vue'
import ProprietaireFoncierEdit from '../components/ProprietaireFoncierEdit.vue'

import UPProprietaireList from '../components/UPProprietaireList.vue'
import UPProprietaireAdd from '../components/UPProprietaireAdd.vue'
import UPProprietaireEdit from '../components/UPProprietaireEdit.vue'

import QuartierPastoList from '../components/QuartierPastoList.vue'
import QuartierPastoAdd from '../components/QuartierPastoAdd.vue'
import QuartierPastoEdit from '../components/QuartierPastoEdit.vue'

import TypeDeSuiviList from '../components/TypeDeSuiviList.vue'
import TypeDeSuiviAdd from '../components/TypeDeSuiviAdd.vue'
import TypeDeSuiviEdit from '../components/TypeDeSuiviEdit.vue'

import PlanDeSuiviList from '../components/PlanDeSuiviList.vue'
import PlanDeSuiviAdd from '../components/PlanDeSuiviAdd.vue'
import PlanDeSuiviEdit from '../components/PlanDeSuiviEdit.vue'

import TypeDeConventionList from '../components/TypeDeConventionList.vue'
import TypeDeConventionAdd from '../components/TypeDeConventionAdd.vue'
import TypeDeConventionEdit from '../components/TypeDeConventionEdit.vue'

import ConventionList from '../components/ConventionList.vue'
import ConventionAdd from '../components/ConventionAdd.vue'
import ConventionEdit from '../components/ConventionEdit.vue'

import SituationExploitationList from '../components/SituationExploitationList.vue'
import SituationExploitationAdd from '../components/SituationExploitationAdd.vue'
import SituationExploitationEdit from '../components/SituationExploitationEdit.vue'

import ExploiterList from '../components/ExploiterList.vue'
import ExploiterAdd from '../components/ExploiterAdd.vue'
import ExploiterEdit from '../components/ExploiterEdit.vue'

import TypeDeMesureList from '../components/TypeDeMesureList.vue'
import TypeDeMesureEdit from '../components/TypeDeMesureEdit.vue'
import TypeDeMesureAdd from '../components/TypeDeMesureAdd.vue'

import MesureDePlanList from '../components/MesureDePlanList.vue'
import MesureDePlanAdd from '../components/MesureDePlanAdd.vue'
import MesureDePlanEdit from '../components/MesureDePlanEdit.vue'

import EleveurList from '../components/EleveurList.vue'
import EleveurAdd from '../components/EleveurAdd.vue'
import EleveurEdit from '../components/EleveurEdit.vue'

import ExploitantList from '../components/ExploitantList.vue'
import ExploitantAdd from '../components/ExploitantAdd.vue'
import ExploitantEdit from '../components/ExploitantEdit.vue'

import SubventionList from '../components/SubventionList.vue'
import SubventionAdd from '../components/SubventionAdd.vue'
import SubventionEdit from '../components/SubventionEdit.vue'

import AbriDUrgenceList from '../components/AbriDUrgenceList.vue'
import AbriDUrgenceAdd from '../components/AbriDUrgenceAdd.vue'
import AbriDUrgenceEdit from '../components/AbriDUrgenceEdit.vue'

import PretAbriList from '../components/PretAbriList.vue'
import PretAbriAdd from '../components/PretAbriAdd.vue'
import PretAbriEdit from '../components/PretAbriEdit.vue'

import BergerList from '../components/BergerList.vue'
import BergerAdd from '../components/BergerAdd.vue'
import BergerEdit from '../components/BergerEdit.vue'

import TypeCheptelList from '../components/TypeCheptelList.vue'
import TypeCheptelAdd from '../components/TypeCheptelAdd.vue'
import TypeCheptelEdit from '../components/TypeCheptelEdit.vue'

import RucheList from '../components/RucheList.vue'
import RucheAdd from '../components/RucheAdd.vue'
import RucheEdit from '../components/RucheEdit.vue'

import TypeEvenementEdit from '../components/TypeEvenementEdit.vue'
import TypeEvenementAdd from '../components/TypeEvenementAdd.vue'
import TypeEvenementList from '../components/TypeEvenementList.vue'

import GardeTroupeauList from '../components/GardeTroupeauList.vue'
import GardeTroupeauAdd from '../components/GardeTroupeauAdd.vue'
import GardeTroupeauEdit from '../components/GardeTroupeauEdit.vue'

import EleverList from '../components/EleverList.vue'
import EleverAdd from '../components/EleverAdd.vue'
import EleverEdit from '../components/EleverEdit.vue'

import CommoditeList from '../components/CommoditeList.vue'
import CommoditeAdd from '../components/CommoditeAdd.vue'
import CommoditeEdit from '../components/CommoditeEdit.vue'

import LogementCommoditeList from '../components/LogementCommoditeList.vue'
import LogementCommoditeAdd from '../components/LogementCommoditeAdd.vue'
import LogementCommoditeEdit from '../components/LogementCommoditeEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/UnitePastorales',
      name: 'unitepastorales',
      component: UnitePastoraleList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/UnitePastorale/add',
      name: 'addUP',
      component: UnitePastoraleAdd
    },
    {
      path: '/UnitePastorale/edit/:id',
      name: 'editUP',
      component: UnitePastoraleEdit
    },
    {
      path: '/ProprietaireFonciers',
      name: 'proprietairefonciers',
      component: ProprietaireFoncierList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/ProprietaireFoncier/add',
      name: 'addPropr',
      component: ProprietaireFoncierAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/ProprietaireFoncier/edit/:id',
      name: 'editPropr',
      component: ProprietaireFoncierEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/UPProprietaires',
      name: 'upproprietaires',
      component: UPProprietaireList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/UPProprietaire/add',
      name: 'addUpproprietaire',
      component: UPProprietaireAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/UPProprietaire/add/:UPId',
      name: 'addUPProprWithUPId',
      component: UPProprietaireAdd,
      props: true
    },
    {
      path: '/UPProprietaire/edit/:id',
      name: 'editUPPropr',
      component: UPProprietaireEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/QuartierPastos',
      name: 'quartiers',
      component: QuartierPastoList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/QuartierPastos/:up_id',
      name: 'quartiersUP',
      component: QuartierPastoList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/QuartierPasto/add',
      name: 'addQuartier',
      component: QuartierPastoAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/QuartierPasto/add/:UPId',
      name: 'addQuartierWithUPId',
      component: QuartierPastoAdd,
      props: true
    },
    {
      path: '/QuartierPasto/edit/:id',
      name: 'editQuartier',
      component: QuartierPastoEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeSuivis',
      name: 'typesuivis',
      component: TypeDeSuiviList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeSuivi/add',
      name: 'addTypeSuivi',
      component: TypeDeSuiviAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeSuivi/edit/:id',
      name: 'editTypeSuivi',
      component: TypeDeSuiviEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PlanSuivis',
      name: 'plansuivis',
      component: PlanDeSuiviList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PlanSuivi/add',
      name: 'addPlanSuivi',
      component: PlanDeSuiviAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PlanSuivi/edit/:id',
      name: 'editPlanSuivi',
      component: PlanDeSuiviEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeMesures',
      name: 'typeMesures',
      component: TypeDeMesureList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeMesure/add',
      name: 'addTypeMesure',
      component: TypeDeMesureAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeMesure/edit/:id',
      name: 'editTypeMesure',
      component: TypeDeMesureEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/MesurePlans',
      name: 'mesurePlans',
      component: MesureDePlanList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/MesurePlan/add',
      name: 'addMesurePlan',
      component: MesureDePlanAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/MesurePlan/edit/:id',
      name: 'editMesurePlan',
      component: MesureDePlanEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeConventions',
      name: 'typeconventions',
      component: TypeDeConventionList,
    },
    {
      path: '/TypeConvention/add',
      name: 'addTypeConvention',
      component: TypeDeConventionAdd,
      meta: { requiresAuth: true },
    },
    {
      path: '/TypeConvention/edit/:id',
      name: 'editTypeConvention',
      component: TypeDeConventionEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Conventions',
      name: 'conventions',
      component: ConventionList,
    },
    {
      path: '/Convention/add',
      name: 'addConvention',
      component: ConventionAdd,
    },
    {
      path: '/Convention/edit/:id',
      name: 'editConvention',
      component: ConventionEdit,
    },
    {
      path: '/SituationExploitations',
      name: 'situations',
      component: SituationExploitationList,
    },
    {
      path: '/SituationExploitation/add',
      name: 'addSituation',
      component: SituationExploitationAdd,
    },
    {
      path: '/SituationExploitation/add/:UPId',
      name: 'addSituationWithUPId',
      component: SituationExploitationAdd,
      props: true
    },
    {
      path: '/SituationExploitation/edit/:id',
      name: 'editSituation',
      component: SituationExploitationEdit,
    },
    {
      path: '/Exploiters',
      name: 'exploiters',
      component: ExploiterList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Exploiter/add',
      name: 'addExploiter',
      component: ExploiterAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Exploiter/edit/:id',
      name: 'editExploiter',
      component: ExploiterEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Eleveurs',
      name: 'eleveurs',
      component: EleveurList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Eleveur/add',
      name: 'addEleveur',
      component: EleveurAdd,
    },
    {
      path: '/Eleveur/edit/:id',
      name: 'editEleveur',
      component: EleveurEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Exploitants',
      name: 'exploitants',
      component: ExploitantList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Exploitant/add',
      name: 'addExploitant',
      component: ExploitantAdd,
    },
    {
      path: '/Exploitant/edit/:id',
      name: 'editExploitant',
      component: ExploitantEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Subventions',
      name: 'subventions',
      component: SubventionList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Subvention/add',
      name: 'addSubvention',
      component: SubventionAdd,
    },
    {
      path: '/Subvention/edit/:id',
      name: 'editSubvention',
      component: SubventionEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/AbriUrgences',
      name: 'abris',
      component: AbriDUrgenceList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/AbriUrgence/add',
      name: 'addAbri',
      component: AbriDUrgenceAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/AbriUrgence/edit/:id',
      name: 'editAbri',
      component: AbriDUrgenceEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PretAbris',
      name: 'prets',
      component: PretAbriList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PretAbri/add',
      name: 'addPret',
      component: PretAbriAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/PretAbri/edit/:id',
      name: 'editPret',
      component: PretAbriEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Bergers',
      name: 'bergers',
      component: BergerList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Berger/add',
      name: 'addBerger',
      component: BergerAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Berger/edit/:id',
      name: 'editBerger',
      component: BergerEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeCheptels',
      name: 'typecheptels',
      component: TypeCheptelList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeCheptel/add',
      name: 'addTypeCheptel',
      component: TypeCheptelAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeCheptel/edit/:id',
      name: 'editTypeCheptel',
      component: TypeCheptelEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/GardeTroupeaux',
      name: 'gardetroupeaux',
      component: GardeTroupeauList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/GardeTroupeau/add',
      name: 'addGardeTroupeau',
      component: GardeTroupeauAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/GardeTroupeau/edit/:id',
      name: 'editGardeTroupeau',
      component: GardeTroupeauEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Elevers',
      name: 'elevers',
      component: EleverList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Elever/add',
      name: 'addElever',
      component: EleverAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Elever/add/:situId',
      name: 'addEleverWithSituId',
      component: EleverAdd,
      meta: { requiresAuth: true },  // Route protégée
      props: true
    },
    {
      path: '/Elever/edit/:id',
      name: 'editElever',
      component: EleverEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Ruches',
      name: 'ruches',
      component: RucheList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Ruche/add',
      name: 'addRuche',
      component: RucheAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Ruche/edit/:id',
      name: 'editRuche',
      component: RucheEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeEvenements',
      name: 'typeevenements',
      component: TypeEvenementList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeEvenement/add',
      name: 'addTypeEvenement',
      component: TypeEvenementAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeEvenement/edit/:id',
      name: 'editTypeEvenement',
      component: TypeEvenementEdit,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Alpages',
      name: 'alpages',
      component: AlpageList
    },
    {
      path: '/Alpage/add',
      name: 'addAlpages',
      component: AlpageAdd
    },
    {
      path: '/Alpage/edit/:id',
      name: 'editAlpage',
      component: AlpageEdit
    },
    {
      path: '/Logements',
      name: 'logements',
      component: LogementList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Logement/add',
      name: 'addLogement',
      component: LogementAdd
    },
    {
      path: '/Logement/edit/:id',
      name: 'editLogement',
      component: LogementEdit
    },
    {
      path: '/Commodites',
      name: 'commodites',
      component: CommoditeList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Commodite/add',
      name: 'addCommodite',
      component: CommoditeAdd
    },
    {
      path: '/Commodite/edit/:id',
      name: 'editCommodite',
      component: CommoditeEdit
    },
    {
      path: '/LogementCommodites',
      name: 'logementCommodites',
      component: LogementCommoditeList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/LogementCommodite/add',
      name: 'addLogementCommodite',
      component: LogementCommoditeAdd,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/LogementCommodite/add/:logementId',
      name: 'addLogementCommoditeWithLogementId',
      component: LogementCommoditeAdd,
      props: true
    },
    {
      path: '/LogementCommodite/edit/:id',
      name: 'editLogementCommodite',
      component: LogementCommoditeEdit
    },
    {
      path: '/TypeEquipementAlpages',
      name: 'typeEquipementAlpages',
      component: TypeEquipementAlpageList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/TypeEquipementAlpage/add',
      name: 'addTypeEquipementAlpage',
      component: TypeEquipementAlpageAdd
    },
    {
      path: '/TypeEquipementAlpage/edit/:id',
      name: 'editTypeEquipementAlpage',
      component: TypeEquipementAlpageEdit
    },
    {
      path: '/Equipements',
      name: 'equipements',
      component: EquipementList,
      meta: { requiresAuth: true },  // Route protégée
    },
    {
      path: '/Equipement/add',
      name: 'addEquipement',
      component: EquipementAdd
    },
    {
      path: '/Equipement/edit/:id',
      name: 'editEquipement',
      component: EquipementEdit
    },
    {
      path: '/TestFiltre',
      name: 'testFiltre',
      component: TestFiltre
    },
    {
      path: '/TestForm',
      name: 'testForm',
      component: TestForm,
      props: true
    },
    // {
    //   path: '/TestMap',
    //   name: 'testMap',
    //   component: TestMap,
    //   props: true
    // },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/about2',
      name: 'about2',
      component: AboutView2
    },
    {
      path: '/mapview',
      name: 'mapview',
      component: MapView
    },
    {
      path: '/QuartieralpageView/:id',
      name: 'quartieralpageview',
      component: QuartieralpageView
    },
    {
      path: '/alpageview/:id',
      name: 'alpageview',
      component: AlpageView
    },
    {
      path: '/todoview',
      name: 'todoview',
      component: TodoView
    },
    {
      path: '/AlpageList',
      name: 'AlpageList',
      component: AlpageList
    },
    {
      path: '/LogementList',
      name: 'LogementList',
      component: LogementList
    },
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user');  // Vérifie si l'utilisateur est connecté

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/');  // Redirige vers la page d'accueil si l'utilisateur n'est pas authentifié
    } else {
      next();  // Laisse passer l'utilisateur si authentifié
    }
  } else {
    next();  // Si la route ne nécessite pas d'authentification, on continue
  }
});


export default router;
