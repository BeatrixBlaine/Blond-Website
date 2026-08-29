export interface Product {
  id: string;
  category: "croissants" | "cookies";
  name: string;
  description: string;
  price: number; // in smallest unit (e.g., 30000 = 30k)
  number?: number; // item number in category
}

export const PRODUCTS: Product[] = [
  // Croissants
  {
    id: "c-01",
    category: "croissants",
    number: 1,
    name: "Classic Butter Croissant",
    description: "",
    price: 30000,
  },
  {
    id: "c-02",
    category: "croissants",
    number: 2,
    name: "Pain Au Chocolat",
    description: "Filled with 52% dark chocolate.",
    price: 40000,
  },
  {
    id: "c-03",
    category: "croissants",
    number: 3,
    name: "Cinnamon Bun",
    description: "Croissant pastry baked in a muffin tin, rolled in cinnamon sugar and filled with cream cheese.",
    price: 48000,
  },
  {
    id: "c-04",
    category: "croissants",
    number: 4,
    name: "Pistachio Almond Croissant",
    description: "Twice-baked with pistachio and almond frangipane.",
    price: 53000,
  },
  {
    id: "c-05",
    category: "croissants",
    number: 5,
    name: "Pistachio Almond Chocolatine",
    description: "Twice-baked dark chocolate, pistachio, and almond frangipane.",
    price: 56000,
  },
  {
    id: "c-06",
    category: "croissants",
    number: 6,
    name: "Almond Chocolatine",
    description: "Twice baked with dark chocolate and almond frangipane, finished with toasted almond flakes.",
    price: 55000,
  },
  {
    id: "c-07",
    category: "croissants",
    number: 7,
    name: "Hazelnut Pain Suisse",
    description: "Our signature pain Suisse, filled with homemade hazelnut chocolate, custard, and hazelnut paste.",
    price: 55000,
  },
  {
    id: "c-08",
    category: "croissants",
    number: 8,
    name: "Banana & Cheddar Pain Suisse",
    description: "Filled with caramelized banana, custard, and cheddar cheese.",
    price: 53000,
  },
  {
    id: "c-09",
    category: "croissants",
    number: 9,
    name: "Apple & Cream Cheese",
    description: "Cross-laminated pastry with slow-cooked apple compote and brown sugar.",
    price: 59000,
  },
  {
    id: "c-10",
    category: "croissants",
    number: 10,
    name: "Mix Berries Flan",
    description: "Filled with berry compote, custard, and crème fromage.",
    price: 58000,
  },
  {
    id: "c-11",
    category: "croissants",
    number: 11,
    name: "Peanut Butter Pain Au Chocolat",
    description: "Twice-baked with housemade salted peanut butter and dark chocolate.",
    price: 58000,
  },
  {
    id: "c-12",
    category: "croissants",
    number: 12,
    name: "Egg Tart",
    description: "Silky baked custard in a flaky croissant pastry.",
    price: 26000,
  },
  {
    id: "c-13",
    category: "croissants",
    number: 13,
    name: "Beef Special",
    description: "Filled with beef bacon, béchamel, and parmesan cheese.",
    price: 55000,
  },
  {
    id: "c-14",
    category: "croissants",
    number: 14,
    name: "Beef Parmesan",
    description: "Twice-baked with smoked beef and parmesan cheese.",
    price: 59000,
  },
  {
    id: "c-15",
    category: "croissants",
    number: 15,
    name: "Mushroom & Cheese Escargot",
    description: "Slow-roasted mushrooms with garlic, parsley, and cheese.",
    price: 59000,
  },
  {
    id: "c-16",
    category: "croissants",
    number: 16,
    name: "Creamy Spinach",
    description: "Filled with spinach, leek, and savoury cream.",
    price: 55000,
  },
  {
    id: "c-17",
    category: "croissants",
    number: 17,
    name: "Cheddar, Parmesan & Rosemary",
    description: "Croissant pastry shaped into a circle, filled with cheddar and parmesan, finished with rosemary.",
    price: 40000,
  },
  {
    id: "c-18",
    category: "croissants",
    number: 17,
    name: "Strawberry Shortcake",
    description: "Croissant pastry shaped into a circle, filled with cheddar and parmesan, finished with rosemary.",
    price: 58000,
  },
  
  // Cookies
  {
    id: "ck-01",
    category: "cookies",
    number: 1,
    name: "Original Chocolate Chips with Maldon Salt",
    description: "Classic chocolate chip cookie finished with Maldon Sea Salt.",
    price: 40000,
  },
  {
    id: "ck-02",
    category: "cookies",
    number: 2,
    name: "Double Chocolate Cookies",
    description: "Rich cocoa cookie with dark chocolate pieces.",
    price: 39000,
  },
  

];

export const CROISSANTS = PRODUCTS.filter((p) => p.category === "croissants");
export const COOKIES = PRODUCTS.filter((p) => p.category === "cookies");
