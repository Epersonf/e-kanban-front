import axios, { AxiosInstance } from 'axios';
import { Constants } from '../constants/constants';

class ApiCaller {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Constants.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },  
    });
  }

  protected async get(url: string, config?: any): Promise<any> {
    return this.axiosInstance.get(url, config);
  }

  protected async post(url: string, data?: any, config?: any): Promise<any> {
    return this.axiosInstance.post(url, data, config);
  }

  protected async put(url: string, data?: any, config?: any): Promise<any> {
    return this.axiosInstance.put(url, data, config);
  }

  protected async delete(url: string, config?: any): Promise<any> {
    return this.axiosInstance.delete(url, config);
  }
}

export default ApiCaller;
