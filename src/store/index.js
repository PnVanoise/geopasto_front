// store/index.js
import { defineStore } from 'pinia';
import { errorMessages } from 'vue/compiler-sfc';
import auth from '../../auth';

export const useMainStore = defineStore('main', {
    state: () => ({
        successMessage: '',
        errorMessage: '',
        userPermissions: {},
        userName: '',
    }),
    actions: {
        setSuccessMessage(message) {
            this.successMessage = message;
            setTimeout(() => {
                this.successMessage = '';
            }, 5000); // Effacer le message après 5 secondes
        },
        setErrorMessage(message) {
            this.errorMessage = message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 5000); // Effacer le message après 5 secondes
        },
        async fetchUserPermissions() {
            try {
                const response = await auth.axiosInstance.get('http://151.80.250.138:8000/api/userpermissions/');
                const data = response.data;
                this.userPermissions = data.permissions_by_model; // Stocker les permissions groupées par modèle
                this.username = data.username;                   // Stocker le nom de l'utilisateur
            } catch (error) {
                // Vérifiez si l'erreur a une réponse
                if (error.response) {
                    // Une réponse a été reçue, mais le serveur a renvoyé un code d'erreur (4xx, 5xx)
                    console.error('Error fetching user permissions:', error.response.data);
                    this.setErrorMessage(`Failed to fetch user permissions: ${error.response.status} - ${error.response.statusText}`);
                } else if (error.request) {
                    // La requête a été envoyée, mais aucune réponse n'a été reçue
                    console.error('Error fetching user permissions: No response received', error.request);
                    this.setErrorMessage('Failed to fetch user permissions: No response from server.');
                } else {
                    // Une autre erreur est survenue lors de la configuration de la requête
                    console.error('Error fetching user permissions:', error.message);
                    this.setErrorMessage(`Failed to fetch user permissions: ${error.message}`);
                }
            }
        },

    },
});
