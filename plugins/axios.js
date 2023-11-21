export default function ({ $axios }) {
    $axios.defaults.baseURL = 'http://127.0.0.1:8000/api';


    // Request interceptor
    $axios.interceptors.request.use((config) => {
      config.headers = config.headers || {};

      if (config.url !== '/login' && config.url !== '/register') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.setAuthorization('Bearer ' + token)
        }
      }

      return config;
    });

  }
  