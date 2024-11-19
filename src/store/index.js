// store/index.js
import { defineStore } from 'pinia';
import { errorMessages } from 'vue/compiler-sfc';

export const useMainStore = defineStore('main', {
    state: () => ({
        successMessage: '',
        errorMessage: '',
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
    },
});
