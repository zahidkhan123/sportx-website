import { locationAPI } from './api';

export interface Country {
  code: string;
  name: string;
  flag?: string;
  phonecode?: string;
  currency?: string;
}

export interface State {
  code: string;
  name: string;
}

export interface City {
  name: string;
}

export const locationService = {
  /**
   * Get all countries
   */
  getCountries: async (): Promise<{ success: boolean; data: Country[]; message?: string }> => {
    try {
      console.log('locationService.getCountries: Calling API...');
      const response = await locationAPI.getCountries();
      console.log('locationService.getCountries: API response:', response);
      
      if (response && response.success) {
        const countries = response.data || [];
        console.log(`locationService.getCountries: Success, ${countries.length} countries`);
        return {
          success: true,
          data: countries,
        };
      }
      
      console.error('locationService.getCountries: API returned failure:', response);
      return {
        success: false,
        data: [],
        message: response?.message || 'Failed to fetch countries',
      };
    } catch (error: any) {
      console.error('locationService.getCountries: Error:', error);
      console.error('locationService.getCountries: Error response:', error?.response);
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || error?.message || 'Failed to fetch countries',
      };
    }
  },

  /**
   * Get states by country code
   */
  getStatesByCountry: async (countryCode: string): Promise<{ success: boolean; data: State[]; message?: string }> => {
    try {
      const response = await locationAPI.getStatesByCountry(countryCode);
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
        };
      }
      return {
        success: false,
        data: [],
        message: response.message || 'Failed to fetch states',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || error?.message || 'Failed to fetch states',
      };
    }
  },

  /**
   * Get cities by country and state code
   */
  getCitiesByState: async (countryCode: string, stateCode: string): Promise<{ success: boolean; data: City[]; message?: string }> => {
    try {
      const response = await locationAPI.getCitiesByState(countryCode, stateCode);
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
        };
      }
      return {
        success: false,
        data: [],
        message: response.message || 'Failed to fetch cities',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || error?.message || 'Failed to fetch cities',
      };
    }
  },

  /**
   * Get all cities by country code
   */
  getCitiesByCountry: async (countryCode: string): Promise<{ success: boolean; data: City[]; message?: string }> => {
    try {
      const response = await locationAPI.getCitiesByCountry(countryCode);
      if (response.success) {
        return {
          success: true,
          data: response.data || [],
        };
      }
      return {
        success: false,
        data: [],
        message: response.message || 'Failed to fetch cities',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || error?.message || 'Failed to fetch cities',
      };
    }
  },
};

