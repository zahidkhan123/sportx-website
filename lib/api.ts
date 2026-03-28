import axios from "axios";

const getBaseURL = () => {
  // 1. Allow explicit override via env (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Use different defaults for development vs production (similar to mobile getBaseURL)
  if (process.env.NODE_ENV !== "production") {
    // Development / preview – point to your ngrok/dev API
    return "http://localhost:3000";
  }

  // 3. Production default – deployed API URL
  return "https://sportxapi.playlio.co";
};

const API_BASE_URL = getBaseURL();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// Location API
export const locationAPI = {
  getCountries: async () => {
    const response = await api.get("/api/location/countries");
    return response.data;
  },
  getStatesByCountry: async (countryCode: string) => {
    const response = await api.get(
      `/api/location/countries/${countryCode}/states`
    );
    return response.data;
  },
  getCitiesByState: async (countryCode: string, stateCode: string) => {
    const response = await api.get(
      `/api/location/countries/${countryCode}/states/${stateCode}/cities`
    );
    return response.data;
  },
  getCitiesByCountry: async (countryCode: string) => {
    const response = await api.get(
      `/api/location/countries/${countryCode}/cities`
    );
    return response.data;
  },
};

// Auth API
export const authAPI = {
  // Simple email/password signup (mobile-style)
  signup: async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
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
    role: string[]; // Backend expects array
    gender: string;
    favoriteSports: string[];
  }) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },
  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  },
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },
  resendOTP: async (email: string) => {
    const response = await api.post("/api/auth/resend-otp", { email });
    return response.data;
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
    const response = await api.put("/api/auth/profile", profile);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },
  googleLogin: async (token: string, isAccessToken: boolean = false) => {
    const response = await api.post(
      "/api/auth/social/google",
      isAccessToken ? { accessToken: token } : { idToken: token }
    );
    return response.data;
  },
  facebookLogin: async (accessToken: string) => {
    const response = await api.post("/api/auth/social/facebook", {
      accessToken,
    });
    return response.data;
  },
  appleLogin: async (
    idToken: string,
    user?: {
      fullName?: { givenName?: string; familyName?: string };
      email?: string;
    }
  ) => {
    const response = await api.post("/api/auth/social/apple", {
      idToken,
      user,
    });
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sport?: string;
    type?: string;
    city?: string;
  }) => {
    const response = await api.get("/api/listings", { params });
    return response.data;
  },
  getGroupedBySportsType: async (limit: number = 6, city?: string) => {
    const params: any = { limit };
    if (city) params.city = city;
    const response = await api.get("/api/listings/grouped-by-sports", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/listings/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await api.post("/api/listings", data);
    return response.data;
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/api/listings/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/listings/${id}`);
    return response.data;
  },
  getUserListings: async () => {
    const response = await api.get("/api/listings/my-listings");
    return response.data;
  },
  incrementViews: async (id: string) => {
    const response = await api.post(`/api/listings/${id}/views`);
    return response.data;
  },
};

// Marketplace API
export const marketplaceAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: "New" | "Used";
    featured?: boolean;
    sortBy?: "price" | "createdAt" | "views";
    sortOrder?: "asc" | "desc";
  }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.search) queryParams.search = params.search;
    if (params?.location) queryParams.location = params.location;
    if (params?.minPrice) queryParams.minPrice = params.minPrice.toString();
    if (params?.maxPrice) queryParams.maxPrice = params.maxPrice.toString();
    if (params?.condition) queryParams.condition = params.condition;
    if (params?.featured) queryParams.featured = params.featured.toString();
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await api.get("/api/marketplace", { params: queryParams });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/marketplace/${id}`);
    return response.data;
  },
  create: async (data: {
    title: string;
    description: string;
    images: string[];
    price: number;
    category: string;
    condition: "New" | "Used";
    location: string;
    contactNumber: string;
    isFeatured?: boolean;
    featuredUntil?: Date;
  }) => {
    const response = await api.post("/api/marketplace", data);
    return response.data;
  },
  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      images?: string[];
      price?: number;
      category?: string;
      condition?: "New" | "Used";
      location?: string;
      contactNumber?: string;
      status?: "active" | "sold" | "expired";
    }
  ) => {
    const response = await api.put(`/api/marketplace/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/marketplace/${id}`);
    return response.data;
  },
  getUserAds: async (status?: "active" | "sold" | "expired") => {
    const params = status ? { status } : {};
    const response = await api.get("/api/marketplace/user/my-ads", { params });
    return response.data;
  },
  getFeatured: async (location?: string) => {
    const params = location ? { location } : {};
    const response = await api.get("/api/marketplace/featured", { params });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/api/marketplace/categories");
    return response.data;
  },
  toggleWishlist: async (id: string) => {
    const response = await api.post(`/api/marketplace/${id}/wishlist`);
    return response.data;
  },
  markAsSold: async (id: string) => {
    const response = await api.patch(`/api/marketplace/${id}/sold`);
    return response.data;
  },
  reportAd: async (id: string) => {
    const response = await api.post(`/api/marketplace/${id}/report`);
    return response.data;
  },
  getGroupedBySportsType: async (limit?: number, location?: string) => {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (location) params.location = location;
    const response = await api.get("/api/marketplace/grouped-by-sports", {
      params,
    });
    return response.data;
  },
  boostAd: async (id: string) => {
    const response = await api.post(`/api/marketplace/${id}/boost`);
    return response.data;
  },
  featureAd: async (id: string) => {
    const response = await api.post(`/api/marketplace/${id}/feature`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  updateProfile: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  getAll: async () => {
    const response = await api.get("/api/favorites");
    return response.data;
  },
  add: async (listingId: string, type: "listing" | "marketplace") => {
    const response = await api.post("/api/favorites", { listingId, type });
    return response.data;
  },
  remove: async (listingId: string) => {
    const response = await api.delete(`/api/favorites/${listingId}`);
    return response.data;
  },
};

// Form Schema API (for sports and listing types)
export const formSchemaAPI = {
  getSports: async () => {
    const response = await api.get("/api/form-schema/sports");
    return response.data;
  },
  getListingTypes: async (sportType: string) => {
    const response = await api.get(
      `/api/form-schema/listing-types/${sportType}`
    );
    return response.data;
  },
  getSchema: async (sport: string, type: string) => {
    const response = await api.get("/api/form-schema", {
      params: { sport, type },
    });
    return response.data;
  },
};

// Verification API
export const verificationAPI = {
  getStats: async () => {
    const response = await api.get("/api/verification/stats");
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get("/api/verification/status");
    return response.data;
  },
  submitRequest: async (data: {
    fullName: string;
    city: string;
    sportsCategory: string;
    bio: string;
    idDocumentUrl: string;
  }) => {
    const response = await api.post("/api/verification/request", data);
    return response.data;
  },
};

// Featured Ad Request API
export const featuredAdRequestAPI = {
  submitRequest: async (data: {
    adId: string;
    message?: string;
    featuredDuration?: number;
  }) => {
    const response = await api.post("/api/featured-ad-request/request", data);
    return response.data;
  },
  getStatus: async (adId: string) => {
    const response = await api.get("/api/featured-ad-request/status", {
      params: { adId },
    });
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  getPresignedUrl: async (fileName: string, contentType: string) => {
    const response = await api.post("/api/upload/presigned-url", {
      fileName,
      contentType,
    });
    return response.data;
  },
  uploadFile: async (file: File): Promise<{ data: { url: string } }> => {
    // Get presigned URL
    const { data: presignedData } = await uploadAPI.getPresignedUrl(
      file.name,
      file.type
    );

    // Upload file to S3 using presigned URL
    const uploadResponse = await fetch(presignedData.data.presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    return {
      data: {
        url: presignedData.data.url,
      },
    };
  },
};

// Chat API
export const chatAPI = {
  getOrCreateChat: async (contextType: "LISTING" | "PRODUCT", contextId: string) => {
    const response = await api.post(`/api/chats/${contextType}/${contextId}`);
    return response.data;
  },
  getChats: async (params?: { status?: string; contextType?: string }) => {
    const response = await api.get("/api/chats", { params });
    return response.data;
  },
  getChatById: async (chatId: string) => {
    const response = await api.get(`/api/chats/${chatId}`);
    return response.data;
  },
  closeChat: async (chatId: string) => {
    const response = await api.patch(`/api/chats/${chatId}/close`);
    return response.data;
  },
  getMessages: async (
    chatId: string,
    params?: { limit?: number; before?: string }
  ) => {
    const response = await api.get(`/api/chats/${chatId}/messages`, { params });
    return response.data;
  },
  sendMessage: async (
    chatId: string,
    content: string,
    messageType: "text" | "file" | "system" = "text"
  ) => {
    const response = await api.post(`/api/chats/${chatId}/messages`, {
      content,
      messageType,
    });
    return response.data;
  },
  reportChat: async (
    chatId: string,
    reason: string,
    description?: string
  ) => {
    const response = await api.post(`/api/chats/${chatId}/report`, {
      reason,
      description,
    });
    return response.data;
  },
  reportMessage: async (
    messageId: string,
    reason: string,
    description?: string
  ) => {
    const response = await api.post(
      `/api/chats/messages/${messageId}/report`,
      { reason, description }
    );
    return response.data;
  },
};

// Packages API
export const packagesAPI = {
  getAll: async () => {
    const response = await api.get("/api/packages");
    return response.data;
  },
  purchase: async (packageId: string, paymentProof?: string) => {
    const response = await api.post("/api/packages/purchase", {
      packageId,
      paymentProof,
    });
    return response.data;
  },
  getUserPurchases: async () => {
    const response = await api.get("/api/packages/my-purchases");
    return response.data;
  },
  getUserCredits: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },
  useBoost: async (adId: string) => {
    const response = await api.post(`/api/listings/use-boost/${adId}`);
    return response.data;
  },
  useFeature: async (adId: string) => {
    const response = await api.post(`/api/listings/use-feature/${adId}`);
    return response.data;
  },
};

// Feedback API (rating form from app/website)
export const feedbackAPI = {
  submit: async (data: {
    rating: number;
    tags?: string[];
    message?: string;
    featureRequest?: string;
    allowContact: boolean;
    platform: string;
    appVersion?: string;
  }) => {
    const response = await api.post("/api/feedback", data);
    return response.data;
  },
};

// Blog posts (public — published only)
export const blogsAPI = {
  getPublished: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/api/blogs", { params });
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(
      `/api/blogs/slug/${encodeURIComponent(slug)}`
    );
    return response.data;
  },
};

// Support / Help & Feedback API (contact form)
export const supportAPI = {
  submitContact: async (data: {
    type: "help" | "feedback" | "contact";
    subject: string;
    message: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
  }) => {
    const response = await api.post("/api/support/contact", data);
    return response.data;
  },
};

export default api;
