export interface TechSpecs {
  lumens: number;
  runtime: string;
  weight: string;
  chargingTime: string;
  waterproof: string;
  beamDistance?: string;
  battery?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  sku: string;
  stockLevel: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  shortDescription: string;
  longDescription: string;
  techSpecs: TechSpecs;
  category: "bicycle" | "headlamp" | "flashlight";
  activity: string[];
  isFeatured: boolean;
  images: string[];
  variants: ProductVariant[];
}

export const categories = [
  { id: "all", name: "All Products", slug: "all" },
  { id: "bicycle", name: "Bicycle Lights", slug: "bicycle" },
  { id: "headlamp", name: "Headlamps", slug: "headlamp" },
  { id: "flashlight", name: "Flashlights", slug: "flashlight" },
];

export const activities = ["MTB", "Road Cycling", "E-Bike", "Camping", "Search & Rescue", "Trail Running"];

export const products: Product[] = [
  {
    id: "1",
    name: "BLIKA X7",
    slug: "blika-x7",
    basePrice: 549.00,
    shortDescription: "The ultimate MTB light. 3600 lumens of pure trail dominance.",
    longDescription: "Engineered for the most demanding trail conditions. The BLIKA X7 delivers an unprecedented 3600 lumens with intelligent beam pattern technology. CNC-machined from aircraft-grade aluminum with IP68 waterproofing.",
    techSpecs: { lumens: 3600, runtime: "2.5h (max) / 12h (eco)", weight: "120g", chargingTime: "3h", waterproof: "IP68", beamDistance: "320m", battery: "7.0 Ah SmartCore" },
    category: "bicycle",
    activity: ["MTB", "E-Bike"],
    isFeatured: true,
    images: ["/placeholder.svg"],
    variants: [
      { id: "1a", name: "Light + Helmet Mount", priceModifier: 0, sku: "BX7-HM", stockLevel: 24 },
      { id: "1b", name: "Light + Handlebar Mount", priceModifier: -20, sku: "BX7-HB", stockLevel: 18 },
      { id: "1c", name: "Complete Set (Both Mounts)", priceModifier: 45, sku: "BX7-CS", stockLevel: 12 },
    ],
  },
  {
    id: "2",
    name: "ALPHA PRO 900",
    slug: "alpha-pro-900",
    basePrice: 329.00,
    shortDescription: "Professional headlamp for search and rescue operations.",
    longDescription: "The ALPHA PRO 900 is trusted by rescue teams worldwide. With 900 lumens focused beam and 48-hour runtime in emergency mode, it's the professional's choice for critical operations.",
    techSpecs: { lumens: 900, runtime: "6h (max) / 48h (emergency)", weight: "95g", chargingTime: "2.5h", waterproof: "IP67", beamDistance: "280m", battery: "3.3 Ah FastCell" },
    category: "headlamp",
    activity: ["Search & Rescue", "Camping", "Trail Running"],
    isFeatured: true,
    images: ["/placeholder.svg"],
    variants: [
      { id: "2a", name: "Standard Kit", priceModifier: 0, sku: "AP9-SK", stockLevel: 30 },
      { id: "2b", name: "Pro Kit (Extended Battery)", priceModifier: 89, sku: "AP9-PK", stockLevel: 15 },
    ],
  },
  {
    id: "3",
    name: "ROTLICHT MAX",
    slug: "rotlicht-max",
    basePrice: 159.00,
    shortDescription: "Maximum visibility rear light with brake detection.",
    longDescription: "The ROTLICHT MAX combines 100 lumens of rear visibility with intelligent brake detection that increases output by 300% during deceleration. Essential for road safety.",
    techSpecs: { lumens: 100, runtime: "8h (flash) / 20h (eco)", weight: "42g", chargingTime: "1.5h", waterproof: "IP67", beamDistance: "2km visibility" },
    category: "bicycle",
    activity: ["Road Cycling", "E-Bike"],
    isFeatured: false,
    images: ["/placeholder.svg"],
    variants: [
      { id: "3a", name: "Seatpost Mount", priceModifier: 0, sku: "RM-SP", stockLevel: 45 },
      { id: "3b", name: "Saddle Rail Mount", priceModifier: 10, sku: "RM-SR", stockLevel: 22 },
    ],
  },
  {
    id: "4",
    name: "WILMA R14",
    slug: "wilma-r14",
    basePrice: 699.00,
    shortDescription: "Race-grade 4500 lumen system for competitive night riding.",
    longDescription: "The WILMA R14 is the pinnacle of cycling illumination. 4500 lumens across a precision-engineered multi-LED array with thermal management that maintains peak output even on the longest descents.",
    techSpecs: { lumens: 4500, runtime: "2h (max) / 10h (eco)", weight: "145g", chargingTime: "4h", waterproof: "IP68", beamDistance: "400m", battery: "13.8 Ah PowerPack" },
    category: "bicycle",
    activity: ["MTB", "Road Cycling", "E-Bike"],
    isFeatured: true,
    images: ["/placeholder.svg"],
    variants: [
      { id: "4a", name: "Handlebar System", priceModifier: 0, sku: "WR14-HB", stockLevel: 8 },
      { id: "4b", name: "Dual Mount System", priceModifier: 75, sku: "WR14-DM", stockLevel: 5 },
    ],
  },
  {
    id: "5",
    name: "PENTA 5700K",
    slug: "penta-5700k",
    basePrice: 219.00,
    shortDescription: "Compact tactical flashlight with daylight-spectrum LED.",
    longDescription: "The PENTA 5700K delivers true daylight color temperature for accurate color rendering in search and inspection scenarios. Compact enough for EDC, powerful enough for professional use.",
    techSpecs: { lumens: 1200, runtime: "3h (max) / 24h (low)", weight: "68g", chargingTime: "2h", waterproof: "IP68", beamDistance: "350m", battery: "Built-in 2600mAh" },
    category: "flashlight",
    activity: ["Search & Rescue", "Camping"],
    isFeatured: false,
    images: ["/placeholder.svg"],
    variants: [
      { id: "5a", name: "Standard", priceModifier: 0, sku: "P57-STD", stockLevel: 50 },
      { id: "5b", name: "Tactical Kit", priceModifier: 45, sku: "P57-TK", stockLevel: 20 },
    ],
  },
  {
    id: "6",
    name: "NEO X4",
    slug: "neo-x4",
    basePrice: 189.00,
    shortDescription: "Ultra-lightweight trail running headlamp. 650 lumens, 62g.",
    longDescription: "Designed with ultra-marathon runners in mind. The NEO X4 weighs just 62g and delivers 650 lumens with zero bounce. The silicone headband wicks moisture and stays locked in position.",
    techSpecs: { lumens: 650, runtime: "4h (max) / 30h (low)", weight: "62g", chargingTime: "2h", waterproof: "IP67", beamDistance: "180m", battery: "2.0 Ah LightCell" },
    category: "headlamp",
    activity: ["Trail Running", "Camping"],
    isFeatured: false,
    images: ["/placeholder.svg"],
    variants: [
      { id: "6a", name: "Standard", priceModifier: 0, sku: "NX4-STD", stockLevel: 35 },
      { id: "6b", name: "Extended Battery Pack", priceModifier: 59, sku: "NX4-EBP", stockLevel: 20 },
    ],
  },
];
