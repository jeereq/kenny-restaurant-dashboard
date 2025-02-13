export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  restaurantId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  menuId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
}