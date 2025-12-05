import { PeriodicElement } from "./types";

// A subset of elements for demonstration, mapped to correct positions.
// In a full production app, this would be the complete JSON of 118 elements.
export const ELEMENTS: PeriodicElement[] = [
  { number: 1, symbol: "H", name: "氫", atomic_mass: 1.008, category: "雙原子非金屬", xpos: 1, ypos: 1, summary: "最輕的元素。" },
  { number: 2, symbol: "He", name: "氦", atomic_mass: 4.0026, category: "稀有氣體", xpos: 18, ypos: 1, summary: "讓氣球飄起來！" },
  { number: 3, symbol: "Li", name: "鋰", atomic_mass: 6.94, category: "鹼金屬", xpos: 1, ypos: 2, summary: "用於電池。" },
  { number: 4, symbol: "Be", name: "鈹", atomic_mass: 9.0122, category: "鹼土金屬", xpos: 2, ypos: 2, summary: "稀有且堅固。" },
  { number: 5, symbol: "B", name: "硼", atomic_mass: 10.81, category: "類金屬", xpos: 13, ypos: 2, summary: "植物生長必需。" },
  { number: 6, symbol: "C", name: "碳", atomic_mass: 12.011, category: "多原子非金屬", xpos: 14, ypos: 2, summary: "生命依賴它！" },
  { number: 7, symbol: "N", name: "氮", atomic_mass: 14.007, category: "雙原子非金屬", xpos: 15, ypos: 2, summary: "我們呼吸的大部分空氣。" },
  { number: 8, symbol: "O", name: "氧", atomic_mass: 15.999, category: "雙原子非金屬", xpos: 16, ypos: 2, summary: "我們呼吸需要它。" },
  { number: 9, symbol: "F", name: "氟", atomic_mass: 18.998, category: "雙原子非金屬", xpos: 17, ypos: 2, summary: "幫助預防蛀牙。" },
  { number: 10, symbol: "Ne", name: "氖", atomic_mass: 20.180, category: "稀有氣體", xpos: 18, ypos: 2, summary: "製作明亮的招牌。" },
  { number: 11, symbol: "Na", name: "鈉", atomic_mass: 22.990, category: "鹼金屬", xpos: 1, ypos: 3, summary: "鹽的一部分。" },
  { number: 12, symbol: "Mg", name: "鎂", atomic_mass: 24.305, category: "鹼土金屬", xpos: 2, ypos: 3, summary: "燃燒時發出亮白光。" },
  { number: 13, symbol: "Al", name: "鋁", atomic_mass: 26.982, category: "後過渡金屬", xpos: 13, ypos: 3, summary: "用於汽水罐。" },
  { number: 14, symbol: "Si", name: "矽", atomic_mass: 28.085, category: "類金屬", xpos: 14, ypos: 3, summary: "電腦晶片！" },
  { number: 15, symbol: "P", name: "磷", atomic_mass: 30.974, category: "多原子非金屬", xpos: 15, ypos: 3, summary: "在火柴頭裡。" },
  { number: 16, symbol: "S", name: "硫", atomic_mass: 32.06, category: "多原子非金屬", xpos: 16, ypos: 3, summary: "聞起來像臭雞蛋。" },
  { number: 17, symbol: "Cl", name: "氯", atomic_mass: 35.45, category: "雙原子非金屬", xpos: 17, ypos: 3, summary: "保持泳池清潔。" },
  { number: 18, symbol: "Ar", name: "氬", atomic_mass: 39.948, category: "稀有氣體", xpos: 18, ypos: 3, summary: "在燈泡裡。" },
  { number: 19, symbol: "K", name: "鉀", atomic_mass: 39.098, category: "鹼金屬", xpos: 1, ypos: 4, summary: "香蕉裡有它。" },
  { number: 20, symbol: "Ca", name: "鈣", atomic_mass: 40.078, category: "鹼土金屬", xpos: 2, ypos: 4, summary: "對骨骼有益。" },
  { number: 21, symbol: "Sc", name: "鈧", atomic_mass: 44.956, category: "過渡金屬", xpos: 3, ypos: 4, summary: "航空航太零件。" },
  { number: 22, symbol: "Ti", name: "鈦", atomic_mass: 47.867, category: "過渡金屬", xpos: 4, ypos: 4, summary: "堅固且輕盈。" },
  { number: 26, symbol: "Fe", name: "鐵", atomic_mass: 55.845, category: "過渡金屬", xpos: 8, ypos: 4, summary: "製造鋼鐵。" },
  { number: 29, symbol: "Cu", name: "銅", atomic_mass: 63.546, category: "過渡金屬", xpos: 11, ypos: 4, summary: "導電。" },
  { number: 47, symbol: "Ag", name: "銀", atomic_mass: 107.87, category: "過渡金屬", xpos: 11, ypos: 5, summary: "閃亮的珠寶。" },
  { number: 79, symbol: "Au", name: "金", atomic_mass: 196.97, category: "過渡金屬", xpos: 11, ypos: 6, summary: "非常珍貴。" },
  { number: 80, symbol: "Hg", name: "汞", atomic_mass: 200.59, category: "過渡金屬", xpos: 12, ypos: 6, summary: "液態金屬。" },
  { number: 30, symbol: "Zn", name: "鋅", atomic_mass: 65.38, category: "過渡金屬", xpos: 12, ypos: 4, summary: "鍍鋅。" },
  { number: 5, symbol: "Ga", name: "鎵", atomic_mass: 69.723, category: "後過渡金屬", xpos: 13, ypos: 4, summary: "在手中融化。" },
  { number: 32, symbol: "Ge", name: "鍺", atomic_mass: 72.63, category: "類金屬", xpos: 14, ypos: 4, summary: "光學。" },
  { number: 33, symbol: "As", name: "砷", atomic_mass: 74.922, category: "類金屬", xpos: 15, ypos: 4, summary: "有毒。" },
  { number: 34, symbol: "Se", name: "硒", atomic_mass: 78.96, category: "多原子非金屬", xpos: 16, ypos: 4, summary: "光電池。" },
  { number: 35, symbol: "Br", name: "溴", atomic_mass: 79.904, category: "雙原子非金屬", xpos: 17, ypos: 4, summary: "液態非金屬。" },
  { number: 36, symbol: "Kr", name: "氪", atomic_mass: 83.798, category: "稀有氣體", xpos: 18, ypos: 4, summary: "手電筒。" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "雙原子非金屬": "bg-blue-200 border-blue-400 text-blue-900",
  "稀有氣體": "bg-purple-200 border-purple-400 text-purple-900",
  "鹼金屬": "bg-red-200 border-red-400 text-red-900",
  "鹼土金屬": "bg-orange-200 border-orange-400 text-orange-900",
  "類金屬": "bg-teal-200 border-teal-400 text-teal-900",
  "多原子非金屬": "bg-green-200 border-green-400 text-green-900",
  "後過渡金屬": "bg-gray-300 border-gray-500 text-gray-900",
  "過渡金屬": "bg-yellow-200 border-yellow-400 text-yellow-900",
  "鑭系元素": "bg-pink-200 border-pink-400 text-pink-900",
  "錒系元素": "bg-rose-300 border-rose-500 text-rose-900",
};

// Fun animal villager personas for Gemini system instructions (Translated to Chinese)
export const VILLAGER_PERSONAS = [
  "你是一個悠閒、愛吃零食的村民（喜歡蟲子）。你把所有事情都跟食物或睡午覺聯想在一起。口頭禪是「吸溜」。",
  "你是一個充滿活力的偶像型村民。你使用很多「！」並想出名。口頭禪是「閃亮」。",
  "你是一個聲音低沉的暴躁型長輩村民。你脾氣不好但很有智慧。口頭禪是「哼」。",
  "你是一個運動型村民。你把化學跟健身和肌肉聯想在一起。口頭禪是「加油」。",
  "你是一個普通、溫柔的村民，喜歡閱讀和自然。口頭禪是「呢」。",
];