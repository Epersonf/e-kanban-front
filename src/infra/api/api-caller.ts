import axios, { AxiosError, AxiosInstance } from 'axios';
import { Constants } from '../constants/constants';
import { ValueResult } from '../../models/value_result/value_result';
import { error } from 'console';

class ApiCaller {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Constants.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          return new ValueResult({ value: null, error: errorMessage });
        }
        console.error('Unexpected error:', error);
        return new ValueResult({ value: null, error: 'Unknown error' });
      }
    )
  }

  protected async get<T>(url: string, config?: any): Promise<ValueResult<T | null>> {
    const response = await this.axiosInstance.get(url, config);

    if (response instanceof ValueResult) return response;


    return new ValueResult({ value: response.data, error: null });
  }

  protected async post<T>(url: string, data?: any, config?: any): Promise<ValueResult<T | null>> {
    const response = await this.axiosInstance.post(url, data, config);

    if (response instanceof ValueResult) return response;


    return new ValueResult({ value: response.data, error: null });
  }

  protected async put<T>(url: string, data?: any, config?: any): Promise<ValueResult<T | null>> {
    const response = await this.axiosInstance.put(url, data, config);

    if (response instanceof ValueResult) return response;

    return new ValueResult({ value: response.data, error: null });
  }

  protected async delete<T>(url: string, config?: any): Promise<ValueResult<T | null>> {
    const response = await this.axiosInstance.delete(url, config);

    if (response instanceof ValueResult) return response;

    return new ValueResult({ value: response.data, error: null });
  }

  // protected handleError<T>(error: unknown, defaultErrorMessage: string = 'Unknown error'): ValueResult<T | null> {
  //   if (error instanceof AxiosError) {
  //     const errorMessage = error.response?.data?.message || error.message;
  //     return new ValueResult({ value: null, error: errorMessage });
  //   }
  //   // Opcional: logar o erro para depuração
  //   console.error('Unexpected error:', error);
  //   return new ValueResult({ value: null, error: defaultErrorMessage });
  // }
}

export default ApiCaller;
