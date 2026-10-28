// ===== ערכי בחירה =====
export type Role = 'MANAGER' | 'MEMBER';
export type Department = 'PRODUCE' | 'DAIRY' | 'MEAT' | 'PANTRY' | 'SPICES' | 'FROZEN';
export type KosherType = 'MEAT' | 'DAIRY' | 'PAREVE';
export type RecipeCategory = 'MAIN' | 'SIDE' | 'SALAD' | 'SOUP' | 'DESSERT' | 'BAKED' | 'BREAKFAST' | 'SHABBAT_HOLIDAY';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type RecipeStatus = 'ACTIVE' | 'ARCHIVED';
export type Meal = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SHABBAT_NIGHT' | 'SHABBAT_DAY' | 'SEUDA_SHLISHIT' | 'YOM_TOV';
export type ShoppingSource = 'AUTO' | 'MANUAL' | 'REQUEST';
export type ShoppingStatus = 'PENDING' | 'OPEN' | 'BOUGHT' | 'DECLINED';
export type TaskStatus = 'OPEN' | 'DONE';

// ===== משתמש והתחברות =====
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  color: string;
  householdId: string;
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  inviteCode?: string; // רק למנהלת
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
  household: Household;
  unreadNotifications: number;
}

// ===== שגיאה מהשרת =====
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[] | { reopensAt: string | null; reopensAtLocal: string | null };
  };
}

// ===== רשימה עם עמודים =====
export interface Paged<T> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}

// ===== מצרכים ומלאי =====
export interface Ingredient {
  id: string;
  name: string;
  category: Department;
  categoryLabel: string;
  unit: string;
  kosherType: KosherType;
  needsInspection: boolean;
  inStock: boolean;
}

export interface PantryItem {
  ingredientId: string;
  name: string;
  unit: string;
  kosherType: KosherType;
  needsInspection: boolean;
  inStock: boolean;
  updatedAt: string | null;
  updatedBy: { id: string; name: string } | null;
}

export interface PantryResponse {
  inStockCount: number;
  total: number;
  groups: { category: Department; label: string; inStockCount: number; items: PantryItem[] }[];
}

// ===== מתכונים =====
export interface RecipeCard {
  id: string;
  name: string;
  description: string | null;
  category: RecipeCategory;
  categoryLabel: string;
  kosherType: KosherType;
  kosherLabel: string;
  shabbatFriendly: boolean;
  difficulty: Difficulty;
  difficultyLabel: string;
  prepMinutes: number;
  servings: number;
  color: string | null;
  status: RecipeStatus;
  imageUrl: string | null;
  match: { have: number; total: number; percent: number };
  missing: string[];
  canMakeNow: boolean;
  votesThisWeek: number;
  votedByMe: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredientLine {
  ingredientId: string;
  name: string;
  category: Department;
  quantity: number;
  originalQuantity: number;
  unit: string;
  isOptional: boolean;
  toTaste: boolean;
  inStock: boolean;
  needsInspection: boolean;
}

export interface RecipeStep {
  order: number;
  text: string;
  timerMinutes: number | null;
}

export interface RecipeDetail extends RecipeCard {
  scaledServings: number;
  createdBy: { id: string; name: string } | null;
  ingredients: RecipeIngredientLine[];
  steps: RecipeStep[];
}

// מה שולחים בטופס מתכון (הוספה ועריכה)
export interface RecipeInput {
  name: string;
  description?: string | null;
  category: RecipeCategory;
  kosherType: KosherType;
  shabbatFriendly: boolean;
  difficulty: Difficulty;
  prepMinutes: number;
  servings: number;
  color?: string | null;
  status?: RecipeStatus;
  ingredients: { ingredientId: string; quantity: number; unit?: string; isOptional: boolean }[];
  steps: { text: string; timerMinutes?: number | null }[];
}

// ===== תפריט =====
export interface MenuEntry {
  id: string;
  date: string;
  meal: Meal;
  servings: number;
  order: number;
  recipe: {
    id: string;
    name: string;
    kosherType: KosherType;
    color: string | null;
    status: RecipeStatus;
    prepMinutes: number;
    imageUrl: string | null;
  };
  addedBy: { id: string; name: string } | null;
}

export interface MenuDay {
  date: string;
  dayOfWeek: number;
  dayName: string;
  hebrewDate: string;
  holidays: string[];
  isYomTov: boolean;
  isShabbat: boolean;
  isToday: boolean;
  meals: { meal: Meal; label: string; mixed: boolean; entries: MenuEntry[] }[];
}

export interface TimeOfDay {
  at: string;
  local: string;
  date: string;
}

export interface MenuWeek {
  weekStart: string;
  weekEnd: string;
  parasha: string | null;
  candleLighting: TimeOfDay[];
  havdalah: TimeOfDay[];
  mixedMeals: number;
  days: MenuDay[];
}

// ===== רשימת קניות =====
export interface ShoppingItem {
  key: string;
  id: string | null;
  source: ShoppingSource;
  status: ShoppingStatus;
  name: string;
  category: Department;
  quantity: number | null;
  unit: string | null;
  ingredientId: string | null;
  forRecipes: string[];
  requestedBy: { id: string; name: string } | null;
  boughtBy: { id: string; name: string } | null;
  createdAt: string;
}

export interface ShoppingList {
  weekStart: string;
  from: string;
  progress: { bought: number; total: number; percent: number };
  groups: { category: Department; label: string; items: ShoppingItem[] }[];
  requests: ShoppingItem[];
}

// ===== משימות =====
export interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  isOverdue: boolean;
  status: TaskStatus;
  completedAt: string | null;
  isErevShabbat: boolean;
  templateId: string | null;
  assignedTo: { id: string; name: string; color: string };
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  daysBeforeShabbat: number;
  dayLabel: string;
  defaultAssignee: { id: string; name: string } | null;
}

export interface StarsRow {
  id: string;
  name: string;
  color: string;
  stars: number;
}

// ===== התראות =====
export interface Notification {
  id: string;
  type: 'SHOPPING_REQUEST' | 'REQUEST_APPROVED' | 'REQUEST_DECLINED' | 'TASK_ASSIGNED' | 'TASK_DONE';
  text: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}