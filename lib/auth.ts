import { authAPI } from './api';

export type User = {
  id: string;
  email: string;
  name: string;
  city?: string;
  gender?: string;
  favoriteSports?: string[];
  role?: 'admin' | 'user';
};

export const authService = {
  register: async (data: { name: string; email: string; password: string; city?: string; gender?: string }) => {
    const response = await authAPI.register(data);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  },

  login: async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  forgotPassword: async (email: string) => {
    const response = await authAPI.forgotPassword(email);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to send reset code');
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await authAPI.verifyOTP(email, otp);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Invalid OTP');
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await authAPI.resetPassword(email, otp, newPassword);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to reset password');
  },

  resendOTP: async (email: string) => {
    const response = await authAPI.resendOTP(email);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to resend OTP');
  },

  googleLogin: async (token: string, isAccessToken: boolean = false) => {
    const response = await authAPI.googleLogin(token, isAccessToken);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Google login failed');
  },

  facebookLogin: async (accessToken: string) => {
    const response = await authAPI.facebookLogin(accessToken);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Facebook login failed');
  },

  appleLogin: async (idToken: string, user?: { fullName?: { givenName?: string; familyName?: string }; email?: string }) => {
    const response = await authAPI.appleLogin(idToken, user);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Apple login failed');
  },
};

