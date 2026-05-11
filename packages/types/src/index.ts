export type Role = "SUPER_ADMIN" | "MANAGER" | "WAITER" | "CASHIER" | "DRIVER" | "CUSTOMER";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  restaurantId?: string;
};
