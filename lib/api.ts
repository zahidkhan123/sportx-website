import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    gender?: string;
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
  getFeatured: async () => {
    const response = await api.get("/api/marketplace/featured");
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
  getGroupedBySportsType: async (limit?: number) => {
    const params = limit ? { limit: limit.toString() } : {};
    const response = await api.get("/api/marketplace/grouped-by-sports", {
      params,
    });
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

export default api;
