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
  // Simple email/password signup (matches mobile flow)
  signup: async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await authAPI.signup(data);
    if (response.success && response.data?.token) {
      // Backend may return token/user under data
      const token = response.data.token || response.data.accessToken;
      const user = response.data.user;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response;
    }
    throw new Error(response.message || "Registration failed");
  },

  register: async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    phone?: string;
    country: string;
    state: string;
    city: string;
    role: string | string[];
    gender: string;
    favoriteSports: string[];
  }) => {
    // Convert role to array if it's a string (backend expects array)
    const roleArray = Array.isArray(data.role)
      ? data.role
      : data.role
      ? [data.role]
      : [];

    const payload = {
      ...data,
      role: roleArray,
      favoriteSports: data.favoriteSports || [],
    };

    const response = await authAPI.register(payload);
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

  verifyOTP: async (
    email: string,
    otp: string,
    options?: { passwordReset?: boolean }
  ) => {
    const response = await authAPI.verifyOTP(email, otp, options);
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

  completeProfile: async (profile: {
    fullName: string;
    username: string;
    gender: string;
    dob: string;
    country: string;
    city: string;
    state: string;
    area?: string;
    phone: string;
    whatsapp?: string;
    favoriteSports: string[];
    profileImage?: string;
  }) => {
    const response = await authAPI.completeProfile(profile);
    if (response.success && response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error(response.message || 'Failed to complete profile');
  },
};

