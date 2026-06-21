export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Jewels Antique";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const APP_DESCRIPTION =
  "Discover rare and exquisite antique jewellery — curated pieces from across centuries.";

export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", color: "yellow" },
  { value: "PROCESSING", label: "Processing", color: "blue" },
  { value: "SHIPPED", label: "Shipped", color: "purple" },
  { value: "DELIVERED", label: "Delivered", color: "green" },
  { value: "CANCELLED", label: "Cancelled", color: "red" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_COST = 299;

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collections" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
