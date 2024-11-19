import axios from 'axios';
import config from './config';

const API_URL = `${config.API_BASE_URL}/api/`; // Adresse de votre API Django

// Instanceaxios
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'accès à chaque requête
axiosInstance.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access) {
        config.headers['Authorization'] = `Bearer ${user.access}`;
    }
    return config;
});

// Intercepteur pour gérer les erreurs de réponse (401 Unauthorized)
axiosInstance.interceptors.response.use(
    response => response, // Retourne la réponse si tout va bien
    async error => {
        const originalRequest = error.config;

        // Si l'erreur est une 401 et que ce n'est pas une tentative de rafraîchissement de token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshToken(); // Essaie de rafraîchir le token d'accès

            if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); // Réessaie la requête avec le nouveau token
            } else {
                // Si le rafraîchissement échoue, on déconnecte l'utilisateur
                localStorage.removeItem('user');
                window.location.href = '/';  // Redirige vers la page de connexion
            }
        }

        return Promise.reject(error);
    }
);

// Fonction pour rafraîchir le token d'accès
async function refreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.refresh) {
        try {
            const response = await axios.post(API_URL + 'token/refresh/', {
                refresh: user.refresh,
            });
            // Met à jour le token d'accès dans le localStorage
            user.access = response.data.access;
            localStorage.setItem('user', JSON.stringify(user));

            const tokenExpirationEvent = new CustomEvent('tokenRefreshed');
            window.dispatchEvent(tokenExpirationEvent);
            
            return response.data.access; // Renvoie le nouveau token d'accès
        } catch (error) {
            console.error('Erreur lors du renouvellement du token :', error);
            return null;
        }
    }
    return null;
}



export default {
    login(user) {
        return axios
            .post(API_URL + 'token/', {
                username: user.username,
                password: user.password,
            })
            .then(response => {
                if (response.data.access) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    axiosInstance,
};