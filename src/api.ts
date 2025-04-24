import axios, { Axios, AxiosInstance } from 'axios';
import { Constants } from './infra/constants/constants';
import LoggedUserStorage from './models/storage/logged_user_storage';

class KanbanAPiRequest {
  static instance: AxiosInstance;
  static getAxios(): AxiosInstance {
    const API_BASE = Constants.API_URL.endsWith('/') ? `${Constants.API_URL}/` : `${Constants.API_URL}/`;
    if (KanbanAPiRequest.instance) return KanbanAPiRequest.instance;

    KanbanAPiRequest.instance = axios.create({
      baseURL: API_BASE,
    });

    KanbanAPiRequest.instance.interceptors.request.use(config => {
      const token = LoggedUserStorage.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    return KanbanAPiRequest.instance;
  }
}

export default KanbanAPiRequest;