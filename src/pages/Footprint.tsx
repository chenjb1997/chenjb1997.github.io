import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import L, { type LayerGroup, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type FootprintPhoto = {
  src: string;
  caption: string;
  zhCaption: string;
};

type FootprintPlace = {
  id: string;
  name: string;
  zhName: string;
  country:
    | "China"
    | "Japan"
    | "Canada"
    | "USA"
    | "Spain"
    | "Egypt"
    | "Russia"
    | "Turkey"
    | "Germany"
    | "Mexico"
    | "Italy"
    | "Vatican City"
    | "France"
    | "Switzerland";
  zhCountry: string;
  lat: number;
  lng: number;
  note: string;
  zhNote: string;
  photos?: FootprintPhoto[];
};

type ContinentKey =
  | "Asia"
  | "NorthAmerica"
  | "Europe"
  | "Africa"
  | "Oceania"
  | "SouthAmerica"
  | "Antarctica";

const countryStyles: Record<
  FootprintPlace["country"],
  { color: string; soft: string; label: string; zhLabel: string }
> = {
  China: { color: "#2563eb", soft: "#dbeafe", label: "China", zhLabel: "中国" },
  Japan: { color: "#dc2626", soft: "#fee2e2", label: "Japan", zhLabel: "日本" },
  Canada: { color: "#16a34a", soft: "#dcfce7", label: "Canada", zhLabel: "加拿大" },
  USA: { color: "#7c3aed", soft: "#ede9fe", label: "United States", zhLabel: "美国" },
  Spain: { color: "#ea580c", soft: "#ffedd5", label: "Spain", zhLabel: "西班牙" },
  Egypt: { color: "#0891b2", soft: "#cffafe", label: "Egypt", zhLabel: "埃及" },
  Russia: { color: "#b91c1c", soft: "#fee2e2", label: "Russia", zhLabel: "俄罗斯" },
  Turkey: { color: "#9333ea", soft: "#f3e8ff", label: "Turkey", zhLabel: "土耳其" },
  Germany: { color: "#0f766e", soft: "#ccfbf1", label: "Germany", zhLabel: "德国" },
  Mexico: { color: "#ca8a04", soft: "#fef9c3", label: "Mexico", zhLabel: "墨西哥" },
  Italy: { color: "#059669", soft: "#d1fae5", label: "Italy", zhLabel: "意大利" },
  "Vatican City": {
    color: "#a16207",
    soft: "#fef3c7",
    label: "Vatican City",
    zhLabel: "梵蒂冈",
  },
  France: { color: "#4f46e5", soft: "#e0e7ff", label: "France", zhLabel: "法国" },
  Switzerland: {
    color: "#e11d48",
    soft: "#ffe4e6",
    label: "Switzerland",
    zhLabel: "瑞士",
  },
};

const continentStyles: Record<
  ContinentKey,
  { label: string; zhLabel: string; accent: string; soft: string }
> = {
  Asia: { label: "Asia", zhLabel: "亚洲", accent: "#2563eb", soft: "#eff6ff" },
  NorthAmerica: {
    label: "North America",
    zhLabel: "北美洲",
    accent: "#16a34a",
    soft: "#f0fdf4",
  },
  Europe: { label: "Europe", zhLabel: "欧洲", accent: "#ea580c", soft: "#fff7ed" },
  Africa: { label: "Africa", zhLabel: "非洲", accent: "#0891b2", soft: "#ecfeff" },
  Oceania: { label: "Oceania", zhLabel: "大洋洲", accent: "#7c3aed", soft: "#f5f3ff" },
  SouthAmerica: {
    label: "South America",
    zhLabel: "南美洲",
    accent: "#db2777",
    soft: "#fdf2f8",
  },
  Antarctica: {
    label: "Antarctica",
    zhLabel: "南极洲",
    accent: "#64748b",
    soft: "#f8fafc",
  },
};

const continentOrder: ContinentKey[] = [
  "Asia",
  "NorthAmerica",
  "Europe",
  "Africa",
  "Oceania",
  "SouthAmerica",
  "Antarctica",
];

const getContinent = (place: FootprintPlace): ContinentKey => {
  if (place.id === "oahu" || place.id === "big-island") {
    return "Oceania";
  }
  if (place.country === "China" || place.country === "Japan") {
    return "Asia";
  }
  if (place.country === "Canada" || place.country === "USA" || place.country === "Mexico") {
    return "NorthAmerica";
  }
  if (
    place.country === "Spain" ||
    place.country === "Russia" ||
    place.country === "Turkey" ||
    place.country === "Germany" ||
    place.country === "Italy" ||
    place.country === "Vatican City" ||
    place.country === "France" ||
    place.country === "Switzerland"
  ) {
    return "Europe";
  }
  return "Africa";
};

type PlaceRegion = {
  label: string;
  zhLabel: string;
};

const countriesWithRegions: FootprintPlace["country"][] = [
  "China",
  "USA",
  "Japan",
  "Canada",
];

const fallbackRegion: PlaceRegion = { label: "Other", zhLabel: "其他" };

const placeRegionLabels: Record<string, PlaceRegion> = {
  shenzhen: { label: "Guangdong", zhLabel: "广东" },
  guangzhou: { label: "Guangdong", zhLabel: "广东" },
  shantou: { label: "Guangdong", zhLabel: "广东" },
  meizhou: { label: "Guangdong", zhLabel: "广东" },
  zhuhai: { label: "Guangdong", zhLabel: "广东" },
  shunde: { label: "Guangdong", zhLabel: "广东" },
  jiangmen: { label: "Guangdong", zhLabel: "广东" },
  yangjiang: { label: "Guangdong", zhLabel: "广东" },
  huazhou: { label: "Guangdong", zhLabel: "广东" },
  dongguan: { label: "Guangdong", zhLabel: "广东" },
  dongshan: { label: "Fujian", zhLabel: "福建" },
  xian: { label: "Shaanxi", zhLabel: "陕西" },
  qingdao: { label: "Shandong", zhLabel: "山东" },
  jiayuguan: { label: "Gansu", zhLabel: "甘肃" },
  dunhuang: { label: "Gansu", zhLabel: "甘肃" },
  shanghai: { label: "Shanghai", zhLabel: "上海" },
  nanjing: { label: "Jiangsu", zhLabel: "江苏" },
  xuzhou: { label: "Jiangsu", zhLabel: "江苏" },
  jinggangshan: { label: "Jiangxi", zhLabel: "江西" },
  wuhan: { label: "Hubei", zhLabel: "湖北" },
  harbin: { label: "Heilongjiang", zhLabel: "黑龙江" },
  jilin: { label: "Jilin", zhLabel: "吉林" },
  shenyang: { label: "Liaoning", zhLabel: "辽宁" },
  taiyuan: { label: "Shanxi", zhLabel: "山西" },
  xinzhou: { label: "Shanxi", zhLabel: "山西" },
  pingding: { label: "Shanxi", zhLabel: "山西" },
  yinchuan: { label: "Ningxia", zhLabel: "宁夏" },
  beijing: { label: "Beijing", zhLabel: "北京" },
  qinhuangdao: { label: "Hebei", zhLabel: "河北" },
  chongqing: { label: "Chongqing", zhLabel: "重庆" },
  chengdu: { label: "Sichuan", zhLabel: "四川" },
  hangzhou: { label: "Zhejiang", zhLabel: "浙江" },
  changsha: { label: "Hunan", zhLabel: "湖南" },
  shaoshan: { label: "Hunan", zhLabel: "湖南" },
  "hong-kong": { label: "Hong Kong", zhLabel: "香港" },

  atlanta: { label: "Georgia", zhLabel: "佐治亚州" },
  macon: { label: "Georgia", zhLabel: "佐治亚州" },
  savannah: { label: "Georgia", zhLabel: "佐治亚州" },
  chattanooga: { label: "Tennessee", zhLabel: "田纳西州" },
  gatlinburg: { label: "Tennessee", zhLabel: "田纳西州" },
  orlando: { label: "Florida", zhLabel: "佛罗里达州" },
  miami: { label: "Florida", zhLabel: "佛罗里达州" },
  boston: { label: "Massachusetts", zhLabel: "马萨诸塞州" },
  cambridge: { label: "Massachusetts", zhLabel: "马萨诸塞州" },
  "salt-lake-city": { label: "Utah", zhLabel: "犹他州" },
  "bryce-canyon-city": { label: "Utah", zhLabel: "犹他州" },
  springdale: { label: "Utah", zhLabel: "犹他州" },
  "rapid-city": { label: "South Dakota", zhLabel: "南达科他州" },
  interior: { label: "South Dakota", zhLabel: "南达科他州" },
  albuquerque: { label: "New Mexico", zhLabel: "新墨西哥州" },
  "los-alamos": { label: "New Mexico", zhLabel: "新墨西哥州" },
  "santa-fe": { label: "New Mexico", zhLabel: "新墨西哥州" },
  mosca: { label: "Colorado", zhLabel: "科罗拉多州" },
  jackson: { label: "Wyoming", zhLabel: "怀俄明州" },
  "west-yellowstone": { label: "Wyoming", zhLabel: "怀俄明州" },
  page: { label: "Arizona", zhLabel: "亚利桑那州" },
  williams: { label: "Arizona", zhLabel: "亚利桑那州" },
  "grand-canyon-village": { label: "Arizona", zhLabel: "亚利桑那州" },
  "boulder-city": { label: "Nevada", zhLabel: "内华达州" },
  "las-vegas": { label: "Nevada", zhLabel: "内华达州" },
  pittsburgh: { label: "Pennsylvania", zhLabel: "宾夕法尼亚州" },
  philadelphia: { label: "Pennsylvania", zhLabel: "宾夕法尼亚州" },
  oahu: { label: "Hawaii", zhLabel: "夏威夷州" },
  "big-island": { label: "Hawaii", zhLabel: "夏威夷州" },
  davis: { label: "California", zhLabel: "加利福尼亚州" },
  sacramento: { label: "California", zhLabel: "加利福尼亚州" },
  "lake-tahoe": { label: "California", zhLabel: "加利福尼亚州" },
  "half-moon-bay": { label: "California", zhLabel: "加利福尼亚州" },
  davenport: { label: "California", zhLabel: "加利福尼亚州" },
  monterey: { label: "California", zhLabel: "加利福尼亚州" },
  "carmel-by-the-sea": { label: "California", zhLabel: "加利福尼亚州" },
  "san-simeon": { label: "California", zhLabel: "加利福尼亚州" },
  oceano: { label: "California", zhLabel: "加利福尼亚州" },
  solvang: { label: "California", zhLabel: "加利福尼亚州" },
  "los-angeles": { label: "California", zhLabel: "加利福尼亚州" },
  "menlo-park": { label: "California", zhLabel: "加利福尼亚州" },
  "palo-alto": { label: "California", zhLabel: "加利福尼亚州" },
  saratoga: { label: "California", zhLabel: "加利福尼亚州" },
  "mountain-view": { label: "California", zhLabel: "加利福尼亚州" },
  "san-jose": { label: "California", zhLabel: "加利福尼亚州" },
  "santa-cruz": { label: "California", zhLabel: "加利福尼亚州" },
  "san-francisco": { label: "California", zhLabel: "加利福尼亚州" },
  seattle: { label: "Washington", zhLabel: "华盛顿州" },
  "washington-dc": { label: "District of Columbia", zhLabel: "华盛顿哥伦比亚特区" },
  "new-york": { label: "New York", zhLabel: "纽约州" },
  "east-rutherford": { label: "New Jersey", zhLabel: "新泽西州" },
  princeton: { label: "New Jersey", zhLabel: "新泽西州" },

  tokyo: { label: "Tokyo", zhLabel: "东京都" },
  sapporo: { label: "Hokkaido", zhLabel: "北海道" },
  otaru: { label: "Hokkaido", zhLabel: "北海道" },
  furano: { label: "Hokkaido", zhLabel: "北海道" },
  yokohama: { label: "Kanagawa", zhLabel: "神奈川县" },
  hida: { label: "Gifu", zhLabel: "岐阜县" },
  gifu: { label: "Gifu", zhLabel: "岐阜县" },
  kasamatsu: { label: "Gifu", zhLabel: "岐阜县" },
  takaoka: { label: "Toyama", zhLabel: "富山县" },
  himi: { label: "Toyama", zhLabel: "富山县" },
  matsumoto: { label: "Nagano", zhLabel: "长野县" },
  kanazawa: { label: "Ishikawa", zhLabel: "石川县" },
  inuyama: { label: "Aichi", zhLabel: "爱知县" },
  fujikawaguchiko: { label: "Yamanashi", zhLabel: "山梨县" },
  "lake-toya": { label: "Hokkaido", zhLabel: "北海道" },
  hakodate: { label: "Hokkaido", zhLabel: "北海道" },
  kyoto: { label: "Kyoto", zhLabel: "京都府" },
  uji: { label: "Kyoto", zhLabel: "京都府" },
  nara: { label: "Nara", zhLabel: "奈良县" },
  "kinosaki-onsen": { label: "Hyogo", zhLabel: "兵库县" },
  "arima-onsen": { label: "Hyogo", zhLabel: "兵库县" },
  kobe: { label: "Hyogo", zhLabel: "兵库县" },
  nagoya: { label: "Aichi", zhLabel: "爱知县" },

  kitchener: { label: "Ontario", zhLabel: "安大略省" },
  waterloo: { label: "Ontario", zhLabel: "安大略省" },
  toronto: { label: "Ontario", zhLabel: "安大略省" },
  milton: { label: "Ontario", zhLabel: "安大略省" },
  grimsby: { label: "Ontario", zhLabel: "安大略省" },
  "niagara-falls": { label: "Ontario", zhLabel: "安大略省" },
  "niagara-on-the-lake": { label: "Ontario", zhLabel: "安大略省" },
  stratford: { label: "Ontario", zhLabel: "安大略省" },
  windsor: { label: "Ontario", zhLabel: "安大略省" },
  leamington: { label: "Ontario", zhLabel: "安大略省" },
  "oro-medonte": { label: "Ontario", zhLabel: "安大略省" },
  "thousand-islands": { label: "Ontario", zhLabel: "安大略省" },
  montreal: { label: "Quebec", zhLabel: "魁北克省" },
  vancouver: { label: "British Columbia", zhLabel: "不列颠哥伦比亚省" },
  edmonton: { label: "Alberta", zhLabel: "阿尔伯塔省" },
  canmore: { label: "Alberta", zhLabel: "阿尔伯塔省" },
  banff: { label: "Alberta", zhLabel: "阿尔伯塔省" },
  jasper: { label: "Alberta", zhLabel: "阿尔伯塔省" },
};

const getPlaceRegion = (place: FootprintPlace): PlaceRegion | null => {
  if (!countriesWithRegions.includes(place.country)) {
    return null;
  }
  return placeRegionLabels[place.id] ?? fallbackRegion;
};

const northAmericaCountryOrder: Partial<Record<FootprintPlace["country"], number>> = {
  USA: 0,
  Canada: 1,
  Mexico: 2,
};

const regionUnitLabels: Partial<
  Record<
    FootprintPlace["country"],
    { label: string; zhLabel: string }
  >
> = {
  China: { label: "provinces", zhLabel: "省份" },
  USA: { label: "states", zhLabel: "州" },
  Japan: { label: "prefectures", zhLabel: "都道府县" },
  Canada: { label: "provinces", zhLabel: "省" },
};

const placeCountLabel = (count: number, isChinese: boolean) =>
  isChinese ? `${count} 城市` : `${count} ${count === 1 ? "place" : "places"}`;

const places: FootprintPlace[] = [
  {
    id: "shenzhen",
    name: "Shenzhen",
    zhName: "深圳",
    country: "China",
    zhCountry: "中国",
    lat: 22.5431,
    lng: 114.0579,
    note: "Current academic home.",
    zhNote: "现在工作和生活的地方。",
  },
  {
    id: "guangzhou",
    name: "Guangzhou",
    zhName: "广州",
    country: "China",
    zhCountry: "中国",
    lat: 23.1291,
    lng: 113.2644,
    note: "A familiar city in southern China.",
    zhNote: "熟悉的华南城市。",
    photos: [
      {
        src: "/footprint/guangzhou-05.jpg",
        caption: "Sun Yat-sen statue at the Memorial Hall.",
        zhCaption: "中山纪念堂前的孙中山像。",
      },
      {
        src: "/footprint/guangzhou-06.jpg",
        caption: "Guangzhou No. 2 High School's Dingtian Lidi facade.",
        zhCaption: "广州二中“顶天立地”楼前。",
      },
      {
        src: "/footprint/guangzhou-01.jpg",
        caption: "Guangzhou skyline by the Pearl River.",
        zhCaption: "珠江边的广州天际线。",
      },
      {
        src: "/footprint/guangzhou-02.jpg",
        caption: "Campus evening in Guangzhou.",
        zhCaption: "广州校园傍晚。",
      },
      {
        src: "/footprint/guangzhou-03.jpg",
        caption: "Campus celebration setup in Guangzhou.",
        zhCaption: "广州校园活动布置。",
      },
      {
        src: "/footprint/guangzhou-04.jpg",
        caption: "Basketball courts at Guangzhou No. 2 High School.",
        zhCaption: "广州市第二中学的篮球场。",
      },
    ],
  },
  {
    id: "shantou",
    name: "Shantou",
    zhName: "汕头",
    country: "China",
    zhCountry: "中国",
    lat: 23.3541,
    lng: 116.6819,
    note: "Qilou streets, Shantou Hostel, and old-town night lights.",
    zhNote: "骑楼街、汕头旅社与老城夜色。",
    photos: [
      {
        src: "/footprint/shantou-01.jpg",
        caption: "Crowded old-town street in Shantou.",
        zhCaption: "汕头老街上热闹的人流。",
      },
      {
        src: "/footprint/shantou-02.jpg",
        caption: "The historic Shantou Hostel facade.",
        zhCaption: "汕头旅社的老建筑立面。",
      },
      {
        src: "/footprint/shantou-03.jpg",
        caption: "Lanterns and shop signs glowing in Shantou.",
        zhCaption: "汕头街巷里亮起的灯笼与招牌。",
      },
    ],
  },
  {
    id: "dongshan",
    name: "Dongshan",
    zhName: "东山",
    country: "China",
    zhCountry: "中国",
    lat: 23.7023,
    lng: 117.4295,
    note: "Dongshan Island coastline, sunsets, and sea-view streets.",
    zhNote: "东山岛的海岸线、日落与海景街巷。",
    photos: [
      {
        src: "/footprint/dongshan-01.jpg",
        caption: "Evening crowds along Dongshan Island beach.",
        zhCaption: "东山岛海滩傍晚的人群。",
      },
      {
        src: "/footprint/dongshan-02.jpg",
        caption: "Coastal road above the water on Dongshan Island.",
        zhCaption: "东山岛临海而行的海岸公路。",
      },
      {
        src: "/footprint/dongshan-03.jpg",
        caption: "Sunset clouds over Dongshan Island beach.",
        zhCaption: "东山岛海滩上方的晚霞。",
      },
      {
        src: "/footprint/dongshan-04.jpg",
        caption: "Golden sunset reflected on the sea.",
        zhCaption: "金色夕阳倒映在东山岛海面上。",
      },
      {
        src: "/footprint/dongshan-05.jpg",
        caption: "Dongshan Island shoreline after dusk.",
        zhCaption: "入夜后的东山岛海岸线。",
      },
      {
        src: "/footprint/dongshan-06.jpg",
        caption: "Quiet bay lights along Dongshan Island.",
        zhCaption: "东山岛海湾边安静亮起的灯火。",
      },
      {
        src: "/footprint/dongshan-07.jpg",
        caption: "Blue sea and rocky coast on Dongshan Island.",
        zhCaption: "东山岛的蓝色海面与礁石海岸。",
      },
    ],
  },
  {
    id: "meizhou",
    name: "Meizhou",
    zhName: "梅州",
    country: "China",
    zhCountry: "中国",
    lat: 24.2884,
    lng: 116.1225,
    note: "Hakka flavors and street snacks.",
    zhNote: "客家风味与街头小吃。",
    photos: [
      {
        src: "/footprint/meizhou-01.jpg",
        caption: "Warm Hakka dessert on a Meizhou street.",
        zhCaption: "梅州街头热气腾腾的客家甜品。",
      },
    ],
  },
  {
    id: "zhuhai",
    name: "Zhuhai",
    zhName: "珠海",
    country: "China",
    zhCountry: "中国",
    lat: 22.2711,
    lng: 113.5767,
    note: "Seaside skyline, opera house, and views across the water.",
    zhNote: "海边天际线、日月贝与隔水远眺。",
    photos: [
      {
        src: "/footprint/zhuhai-01.jpg",
        caption: "Zhuhai skyline across the water.",
        zhCaption: "隔水望见的珠海天际线。",
      },
      {
        src: "/footprint/zhuhai-02.jpg",
        caption: "Zhuhai Grand Theatre on a grey day.",
        zhCaption: "阴天里的珠海大剧院日月贝。",
      },
      {
        src: "/footprint/zhuhai-03.jpg",
        caption: "View toward Macau from Zhuhai.",
        zhCaption: "从珠海远望澳门方向。",
      },
      {
        src: "/footprint/zhuhai-04.jpg",
        caption: "Poster display at the China Airshow in Zhuhai.",
        zhCaption: "珠海中国航展现场的展板。",
      },
      {
        src: "/footprint/zhuhai-05.jpg",
        caption: "Aircraft display at the China Airshow in Zhuhai.",
        zhCaption: "珠海中国航展上的飞机展示。",
      },
    ],
  },
  {
    id: "shunde",
    name: "Shunde",
    zhName: "顺德",
    country: "China",
    zhCountry: "中国",
    lat: 22.805,
    lng: 113.293,
    note: "Lingnan gardens, food streets, and local culture.",
    zhNote: "岭南园林、美食街巷与本地文化。",
    photos: [
      {
        src: "/footprint/shunde-01.jpg",
        caption: "Garden gate in Shunde.",
        zhCaption: "顺德园林里的牌坊。",
      },
      {
        src: "/footprint/shunde-02.jpg",
        caption: "Wooden training posts in a Shunde cultural park.",
        zhCaption: "顺德文化园里的木人桩。",
      },
      {
        src: "/footprint/shunde-03.jpg",
        caption: "Lingnan garden pond in Qinghui Garden.",
        zhCaption: "清晖园里的岭南庭院水景。",
      },
      {
        src: "/footprint/shunde-04.jpg",
        caption: "Shunfeng Mountain Park archway.",
        zhCaption: "顺峰山公园的牌坊。",
      },
    ],
  },
  {
    id: "jiangmen",
    name: "Jiangmen",
    zhName: "江门",
    country: "China",
    zhCountry: "中国",
    lat: 22.5787,
    lng: 113.0819,
    note: "Mei Family Grand Courtyard and Sanshisanxu Street.",
    zhNote: "梅家大院与三十三墟街。",
    photos: [
      {
        src: "/footprint/jiangmen-01.jpg",
        caption: "Mei Family Grand Courtyard facades.",
        zhCaption: "梅家大院的骑楼立面。",
      },
      {
        src: "/footprint/jiangmen-02.jpg",
        caption: "Historic balconies at Mei Family Grand Courtyard.",
        zhCaption: "梅家大院里的老式阳台。",
      },
      {
        src: "/footprint/jiangmen-03.jpg",
        caption: "Busy stalls along Sanshisanxu Street.",
        zhCaption: "三十三墟街热闹的摊档。",
      },
      {
        src: "/footprint/jiangmen-04.jpg",
        caption: "Old shopfronts on Sanshisanxu Street.",
        zhCaption: "三十三墟街上的老店面。",
      },
    ],
  },
  {
    id: "yangjiang",
    name: "Yangjiang",
    zhName: "阳江",
    country: "China",
    zhCountry: "中国",
    lat: 21.8579,
    lng: 111.9826,
    note: "Coastline and sea light.",
    zhNote: "海岸线与海光。",
    photos: [
      {
        src: "/footprint/yangjiang-01.jpg",
        caption: "Beach view in Yangjiang.",
        zhCaption: "阳江海滩风光。",
      },
    ],
  },
  {
    id: "huazhou",
    name: "Huazhou",
    zhName: "化州",
    country: "China",
    zhCountry: "中国",
    lat: 21.664,
    lng: 110.6396,
    note: "Western Guangdong hometown streets and slow local light.",
    zhNote: "粤西家乡街巷与缓慢的本地光线。",
    photos: [],
  },
  {
    id: "xian",
    name: "Xi'an",
    zhName: "西安",
    country: "China",
    zhCountry: "中国",
    lat: 34.3416,
    lng: 108.9398,
    note: "Contest memories in Xi'an.",
    zhNote: "西安的比赛记忆。",
    photos: [
      {
        src: "/footprint/xian-01.jpg",
        caption: "The 2018 ICPC Asia-East Continent Final in Xi'an.",
        zhCaption: "2018 ICPC 亚洲东大陆决赛西安站。",
      },
    ],
  },
  {
    id: "qingdao",
    name: "Qingdao",
    zhName: "青岛",
    country: "China",
    zhCountry: "中国",
    lat: 36.0671,
    lng: 120.3826,
    note: "2017 ICPC Qingdao Regional champion memories.",
    zhNote: "2017 年青岛区域赛冠军的回忆。",
    photos: [
      {
        src: "/footprint/qingdao-icpc-2017-01.jpg",
        caption: "2017 ICPC Qingdao Regional champion ceremony.",
        zhCaption: "2017 年青岛区域赛冠军颁奖现场。",
      },
      {
        src: "/footprint/qingdao-icpc-2017-02.jpg",
        caption: "2017 ICPC Qingdao Regional champion trophy.",
        zhCaption: "2017 年青岛区域赛冠军奖杯。",
      },
    ],
  },
  {
    id: "jiayuguan",
    name: "Jiayuguan",
    zhName: "嘉峪关",
    country: "China",
    zhCountry: "中国",
    lat: 39.772,
    lng: 98.2891,
    note: "Great Wall pass and desert frontier light.",
    zhNote: "长城关隘与戈壁边塞光影。",
    photos: [
      {
        src: "/footprint/jiayuguan-01.jpg",
        caption: "Jiayuguan Pass tower under a clear sky.",
        zhCaption: "晴空下的嘉峪关关城楼阁。",
      },
      {
        src: "/footprint/jiayuguan-02.jpg",
        caption: "Jiayuguan Pass and the old city wall.",
        zhCaption: "嘉峪关关城与古城墙。",
      },
      {
        src: "/footprint/jiayuguan-03.jpg",
        caption: "Jiayuguan Pass from outside the wall.",
        zhCaption: "城墙外望见的嘉峪关关城。",
      },
    ],
  },
  {
    id: "dunhuang",
    name: "Dunhuang",
    zhName: "敦煌",
    country: "China",
    zhCountry: "中国",
    lat: 40.1421,
    lng: 94.6618,
    note: "Crescent Spring, Mingsha Mountain, Yardang landforms, and grottoes in the desert.",
    zhNote: "沙漠中的月牙泉、鸣沙山、雅丹地貌与石窟记忆。",
    photos: [
      {
        src: "/footprint/dunhuang-yardang-01.jpg",
        caption: "Desert ruins near Dunhuang Yardang.",
        zhCaption: "敦煌雅丹一带的戈壁遗迹。",
      },
      {
        src: "/footprint/dunhuang-yardang-02.jpg",
        caption: "Yardang landforms at Dunhuang Devil City.",
        zhCaption: "敦煌魔鬼城的雅丹地貌。",
      },
      {
        src: "/footprint/dunhuang-yardang-03.jpg",
        caption: "Evening light over Dunhuang Yardang.",
        zhCaption: "敦煌雅丹上的暮色。",
      },
      {
        src: "/footprint/dunhuang-01.jpg",
        caption: "Mogao Caves in Dunhuang.",
        zhCaption: "敦煌莫高窟。",
      },
      {
        src: "/footprint/dunhuang-02.jpg",
        caption: "Crescent Spring glowing below the dunes.",
        zhCaption: "沙山下亮起灯光的月牙泉。",
      },
      {
        src: "/footprint/dunhuang-03.jpg",
        caption: "Mingsha Mountain dunes near Dunhuang.",
        zhCaption: "敦煌鸣沙山的沙丘。",
      },
    ],
  },
  {
    id: "shanghai",
    name: "Shanghai",
    zhName: "上海",
    country: "China",
    zhCountry: "中国",
    lat: 31.2304,
    lng: 121.4737,
    note: "Meetings, contests, city walks, and a Huawei Songshan Lake campus stop.",
    zhNote: "会议、比赛、城市漫步，以及华为松山湖基地一站。",
    photos: [
      {
        src: "/footprint/shanghai-01.jpg",
        caption: "Huawei Songshan Lake campus across the water.",
        zhCaption: "水岸对面的华为松山湖基地。",
      },
      {
        src: "/footprint/shanghai-02.jpg",
        caption: "Lakeside facade at Huawei Songshan Lake campus.",
        zhCaption: "华为松山湖基地水岸建筑。",
      },
      {
        src: "/footprint/shanghai-03.jpg",
        caption: "Wide lake view at Huawei Songshan Lake campus.",
        zhCaption: "华为松山湖基地的开阔湖景。",
      },
      {
        src: "/footprint/shanghai-04.jpg",
        caption: "Bridge view at Huawei Songshan Lake campus.",
        zhCaption: "华为松山湖基地的桥与湖面。",
      },
    ],
  },
  {
    id: "nanjing",
    name: "Nanjing",
    zhName: "南京",
    country: "China",
    zhCountry: "中国",
    lat: 32.0603,
    lng: 118.7969,
    note: "Railway station landmarks and old city streets.",
    zhNote: "车站地标与老城街景。",
    photos: [
      {
        src: "/footprint/nanjing-01.jpg",
        caption: "Nanjing South Railway Station.",
        zhCaption: "南京南站。",
      },
      {
        src: "/footprint/nanjing-02.jpg",
        caption: "Fuxing Restaurant in Nanjing.",
        zhCaption: "南京的复兴饭店。",
      },
      {
        src: "/footprint/nanjing-03.jpg",
        caption: "Long stairway at Sun Yat-sen Mausoleum.",
        zhCaption: "中山陵前长长的台阶。",
      },
      {
        src: "/footprint/nanjing-04.jpg",
        caption: "Memorial gate and trees in Nanjing.",
        zhCaption: "南京景区里的牌坊与树影。",
      },
    ],
  },
  {
    id: "jinggangshan",
    name: "Jinggangshan",
    zhName: "井冈山",
    country: "China",
    zhCountry: "中国",
    lat: 26.7482,
    lng: 114.2895,
    note: "Mountain roads, red-history sites, and misty Jiangxi air.",
    zhNote: "山路、红色历史旧址与江西山间雾气。",
    photos: [],
  },
  {
    id: "wuhan",
    name: "Wuhan",
    zhName: "武汉",
    country: "China",
    zhCountry: "中国",
    lat: 30.5928,
    lng: 114.3055,
    note: "Autumn trees and city memories.",
    zhNote: "秋日树影与城市记忆。",
    photos: [
      {
        src: "/footprint/wuhan-01.jpg",
        caption: "Autumn trees in Wuhan.",
        zhCaption: "武汉的秋日树影。",
      },
    ],
  },
  {
    id: "harbin",
    name: "Harbin",
    zhName: "哈尔滨",
    country: "China",
    zhCountry: "中国",
    lat: 45.8038,
    lng: 126.5349,
    note: "Snow fields, winter lights, and northern city memories.",
    zhNote: "雪原、冰灯与北方城市记忆。",
    photos: [
      {
        src: "/footprint/harbin-01.jpg",
        caption: "Snowy winter market in Harbin.",
        zhCaption: "哈尔滨的雪地冬日集市。",
      },
      {
        src: "/footprint/harbin-02.jpg",
        caption: "Ice-and-light night scene in Harbin.",
        zhCaption: "哈尔滨的冰灯夜景。",
      },
      {
        src: "/footprint/harbin-03.jpg",
        caption: "Ice architecture in Harbin.",
        zhCaption: "哈尔滨的冰雪建筑。",
      },
    ],
  },
  {
    id: "jilin",
    name: "Jilin",
    zhName: "吉林",
    country: "China",
    zhCountry: "中国",
    lat: 43.8378,
    lng: 126.5496,
    note: "Contest memories in Jilin City.",
    zhNote: "吉林市的比赛记忆。",
    photos: [
      {
        src: "/footprint/jilin-01.jpg",
        caption: "Programming contest trophy in Jilin.",
        zhCaption: "吉林的程序设计竞赛奖杯。",
      },
    ],
  },
  {
    id: "shenyang",
    name: "Shenyang",
    zhName: "沈阳",
    country: "China",
    zhCountry: "中国",
    lat: 41.8057,
    lng: 123.4315,
    note: "Snowy northern city memories.",
    zhNote: "北方雪景与城市记忆。",
    photos: [
      {
        src: "/footprint/shenyang-01.jpg",
        caption: "Snowy winter in Shenyang.",
        zhCaption: "沈阳冬日雪景。",
      },
    ],
  },
  {
    id: "taiyuan",
    name: "Taiyuan",
    zhName: "太原",
    country: "China",
    zhCountry: "中国",
    lat: 37.8706,
    lng: 112.5489,
    note: "Yan Xishan Residence and Shanxi memories.",
    zhNote: "阎锡山故居与山西记忆。",
    photos: [
      {
        src: "/footprint/taiyuan-01.jpg",
        caption: "Rooftops at Yan Xishan Residence in Taiyuan.",
        zhCaption: "太原阎锡山故居屋顶俯瞰。",
      },
      {
        src: "/footprint/taiyuan-02.jpg",
        caption: "Courtyard view at Yan Xishan Residence in Taiyuan.",
        zhCaption: "太原阎锡山故居院落。",
      },
    ],
  },
  {
    id: "xinzhou",
    name: "Xinzhou",
    zhName: "忻州",
    country: "China",
    zhCountry: "中国",
    lat: 38.4167,
    lng: 112.7333,
    note: "Wutai Mountain temples and valley light.",
    zhNote: "五台山寺院与山谷光影。",
    photos: [
      {
        src: "/footprint/xinzhou-01.jpg",
        caption: "Wutai Mountain temples in Xinzhou.",
        zhCaption: "忻州五台山寺院。",
      },
      {
        src: "/footprint/xinzhou-02.jpg",
        caption: "Wutai Mountain valley view.",
        zhCaption: "五台山山谷远眺。",
      },
    ],
  },
  {
    id: "yinchuan",
    name: "Yinchuan",
    zhName: "银川",
    country: "China",
    zhCountry: "中国",
    lat: 38.4872,
    lng: 106.2309,
    note: "Northwest lake and desert light.",
    zhNote: "西北湖光与沙地天色。",
    photos: [
      {
        src: "/footprint/yinchuan-01.jpg",
        caption: "Waterside view in Yinchuan.",
        zhCaption: "银川水边风光。",
      },
      {
        src: "/footprint/yinchuan-02.jpg",
        caption: "Desert sky near Yinchuan.",
        zhCaption: "银川附近的沙地天色。",
      },
    ],
  },
  {
    id: "beijing",
    name: "Beijing",
    zhName: "北京",
    country: "China",
    zhCountry: "中国",
    lat: 39.9042,
    lng: 116.4074,
    note: "World Finals memories.",
    zhNote: "世界总决赛的记忆。",
    photos: [
      {
        src: "/footprint/beijing-01.jpg",
        caption: "Morning flag-raising ceremony at Tiananmen Square.",
        zhCaption: "清晨天安门广场的升旗仪式。",
      },
    ],
  },
  {
    id: "qinhuangdao",
    name: "Qinhuangdao",
    zhName: "秦皇岛",
    country: "China",
    zhCountry: "中国",
    lat: 39.9354,
    lng: 119.5996,
    note: "Shanhaiguan and old frontier memories.",
    zhNote: "山海关与古城关记忆。",
    photos: [
      {
        src: "/footprint/qinhuangdao-01.jpg",
        caption: "Shanhaiguan gate in Qinhuangdao.",
        zhCaption: "秦皇岛山海关城楼。",
      },
      {
        src: "/footprint/qinhuangdao-02.jpg",
        caption: "Zhendongbian Pass at Shanhaiguan.",
        zhCaption: "山海关镇东边关。",
      },
    ],
  },
  {
    id: "xuzhou",
    name: "Xuzhou",
    zhName: "徐州",
    country: "China",
    zhCountry: "中国",
    lat: 34.2058,
    lng: 117.2841,
    note: "ICPC regional contest memories.",
    zhNote: "ICPC 区域赛记忆。",
    photos: [
      {
        src: "/footprint/xuzhou-01.jpg",
        caption: "The 2018 ICPC Asia Xuzhou Regional Contest.",
        zhCaption: "2018 ICPC 亚洲区域赛徐州站。",
      },
    ],
  },
  {
    id: "chongqing",
    name: "Chongqing",
    zhName: "重庆",
    country: "China",
    zhCountry: "中国",
    lat: 29.563,
    lng: 106.5516,
    note: "Mountain city, river bridges, and light rail.",
    zhNote: "山城、江桥与轻轨。",
    photos: [
      {
        src: "/footprint/chongqing-01.jpg",
        caption: "Chongqing above the Yangtze River.",
        zhCaption: "俯瞰重庆江城。",
      },
      {
        src: "/footprint/chongqing-02.jpg",
        caption: "Liziba monorail in Chongqing.",
        zhCaption: "重庆李子坝轻轨。",
      },
      {
        src: "/footprint/chongqing-03.jpg",
        caption: "Bridge and riverside fog in Chongqing.",
        zhCaption: "重庆江桥与雾气。",
      },
    ],
  },
  {
    id: "chengdu",
    name: "Chengdu",
    zhName: "成都",
    country: "China",
    zhCountry: "中国",
    lat: 30.5728,
    lng: 104.0668,
    note: "Sichuan mountain water and old engineering.",
    zhNote: "四川山水与古老水利。",
    photos: [
      {
        src: "/footprint/chengdu-01.jpg",
        caption: "Dujiangyan waterworks near Chengdu.",
        zhCaption: "成都都江堰水利工程。",
      },
    ],
  },
  {
    id: "hangzhou",
    name: "Hangzhou",
    zhName: "杭州",
    country: "China",
    zhCountry: "中国",
    lat: 30.2741,
    lng: 120.1551,
    note: "Zhejiang years and lake light.",
    zhNote: "浙江岁月与西湖光影。",
    photos: [
      {
        src: "/footprint/qiandao-lake-01.jpg",
        caption: "Qiandao Lake from above.",
        zhCaption: "俯瞰千岛湖。",
      },
      {
        src: "/footprint/hangzhou-01.jpg",
        caption: "Snowy rooftops in Hangzhou.",
        zhCaption: "杭州雪中的屋檐。",
      },
      {
        src: "/footprint/hangzhou-02.jpg",
        caption: "Snowy afternoon in Hangzhou.",
        zhCaption: "杭州雪景。",
      },
      {
        src: "/footprint/hangzhou-03.jpg",
        caption: "Snow-covered branches in Hangzhou.",
        zhCaption: "杭州雪中的枝叶。",
      },
      {
        src: "/footprint/hangzhou-04.jpg",
        caption: "Snowy street in Hangzhou.",
        zhCaption: "杭州雪后的街道。",
      },
      {
        src: "/footprint/hangzhou-05.jpg",
        caption: "Snowy campus scene in Hangzhou.",
        zhCaption: "杭州雪中的校园。",
      },
    ],
  },
  {
    id: "dongguan",
    name: "Dongguan",
    zhName: "东莞",
    country: "China",
    zhCountry: "中国",
    lat: 23.0207,
    lng: 113.7518,
    note: "Songshan Lake and quiet campus-side walks.",
    zhNote: "松山湖与校园旁的安静漫步。",
    photos: [
      {
        src: "/footprint/dongguan-01.jpg",
        caption: "Library hall at Songshan Lake European Town.",
        zhCaption: "松山湖欧洲小镇里的图书馆大厅。",
      },
      {
        src: "/footprint/dongguan-02.jpg",
        caption: "European-style buildings by Songshan Lake.",
        zhCaption: "松山湖畔的欧式建筑。",
      },
    ],
  },
  {
    id: "pingding",
    name: "Pingding",
    zhName: "平定",
    country: "China",
    zhCountry: "中国",
    lat: 22.0265,
    lng: 110.41035,
    note: "Hometown streets, village courtyards, fields, and market life in Huazhou.",
    zhNote: "化州平定的老家街巷、院落、菜地与集市。",
    photos: [
      {
        src: "/footprint/pingding-01.jpg",
        caption: "Village homes in Pingding.",
        zhCaption: "平定的乡村屋舍。",
      },
      {
        src: "/footprint/pingding-02.jpg",
        caption: "Vegetable fields and homes in Pingding.",
        zhCaption: "平定菜地与村屋。",
      },
      {
        src: "/footprint/pingding-03.jpg",
        caption: "Market street decorated for the New Year in Pingding.",
        zhCaption: "平定年味里的集市街道。",
      },
      {
        src: "/footprint/pingding-04.jpg",
        caption: "Old courtyard house in Pingding.",
        zhCaption: "平定的老屋院落。",
      },
      {
        src: "/footprint/pingding-05.jpg",
        caption: "Firecracker red paper after a celebration in Pingding.",
        zhCaption: "平定院落里庆典后的红纸屑。",
      },
    ],
  },
  {
    id: "changsha",
    name: "Changsha",
    zhName: "长沙",
    country: "China",
    zhCountry: "中国",
    lat: 28.2282,
    lng: 112.9388,
    note: "Orange Isle, city lights, and Xiang River memories.",
    zhNote: "橘子洲、城市灯火与湘江记忆。",
    photos: [
      {
        src: "/footprint/changsha-01.jpg",
        caption: "Young Mao Zedong statue at Orange Isle.",
        zhCaption: "橘子洲青年毛泽东艺术雕塑。",
      },
      {
        src: "/footprint/changsha-02.jpg",
        caption: "Young Mao Zedong statue lit at night.",
        zhCaption: "夜色中亮起灯光的青年毛泽东艺术雕塑。",
      },
      {
        src: "/footprint/changsha-03.jpg",
        caption: "Night lights in downtown Changsha.",
        zhCaption: "长沙市中心的夜色灯牌。",
      },
    ],
  },
  {
    id: "shaoshan",
    name: "Shaoshan",
    zhName: "韶山",
    country: "China",
    zhCountry: "中国",
    lat: 27.915,
    lng: 112.526,
    note: "Mao Zedong Former Residence and hometown memorial sites.",
    zhNote: "毛泽东故居与故里纪念地。",
    photos: [
      {
        src: "/footprint/shaoshan-01.jpg",
        caption: "Mao Zedong Former Residence in Shaoshan.",
        zhCaption: "韶山毛泽东故居。",
      },
      {
        src: "/footprint/shaoshan-02.jpg",
        caption: "Entrance at Mao Zedong Former Residence.",
        zhCaption: "毛泽东故居入口。",
      },
      {
        src: "/footprint/shaoshan-03.jpg",
        caption: "Mao Zedong hometown memorial sign in Shaoshan.",
        zhCaption: "韶山毛泽东故里纪念标识。",
      },
    ],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    zhName: "东京",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.6762,
    lng: 139.6503,
    note: "Dense, bright, and full of small details.",
    zhNote: "密集、明亮，处处有细节。",
    photos: [
      {
        src: "/footprint/tokyo-05.jpg",
        caption: "Akihabara billboards under a clear sky.",
        zhCaption: "晴空下的秋叶原招牌街景。",
      },
      {
        src: "/footprint/tokyo-06.jpg",
        caption: "Kaminarimon Gate at Senso-ji.",
        zhCaption: "浅草寺雷门前的人潮。",
      },
      {
        src: "/footprint/tokyo-07.jpg",
        caption: "Tokyo Skytree and the Asahi Flame.",
        zhCaption: "晴空下的东京晴空塔与朝日火焰。",
      },
      {
        src: "/footprint/tokyo-08.jpg",
        caption: "Quiet bridge in a Tokyo garden.",
        zhCaption: "东京庭园里的静静小桥。",
      },
      {
        src: "/footprint/tokyo-09.jpg",
        caption: "Kanda Myojin Otoko-zaka steps.",
        zhCaption: "神田明神男坂的台阶。",
      },
      {
        src: "/footprint/tokyo-01.jpg",
        caption: "Tokyo Tower at night.",
        zhCaption: "夜色中的东京塔。",
      },
      {
        src: "/footprint/tokyo-02.jpg",
        caption: "Tokyo Tower from the street.",
        zhCaption: "街巷间望见东京塔。",
      },
      {
        src: "/footprint/tokyo-03.jpg",
        caption: "Street art in Shimokitazawa, a Bocchi the Rock! location.",
        zhCaption: "下北泽街头，《孤独摇滚！》取景地一带。",
      },
      {
        src: "/footprint/tokyo-04.jpg",
        caption: "Suga Shrine stairs, a Your Name location.",
        zhCaption: "《你的名字。》取景地须贺神社阶梯。",
      },
    ],
  },
  {
    id: "fujikawaguchiko",
    name: "Fujikawaguchiko",
    zhName: "富士河口湖",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.4973,
    lng: 138.7553,
    note: "Lake Kawaguchi and Mount Fuji through the clouds.",
    zhNote: "河口湖边，云雾间的富士山。",
    photos: [
      {
        src: "/footprint/fujikawaguchiko-01.jpg",
        caption: "Mount Fuji behind Lake Kawaguchi rooftops.",
        zhCaption: "河口湖屋顶后若隐若现的富士山。",
      },
      {
        src: "/footprint/fujikawaguchiko-02.jpg",
        caption: "Mount Fuji wrapped in clouds near Lake Kawaguchi.",
        zhCaption: "河口湖附近云雾里的富士山。",
      },
    ],
  },
  {
    id: "sapporo",
    name: "Sapporo",
    zhName: "札幌",
    country: "Japan",
    zhCountry: "日本",
    lat: 43.0618,
    lng: 141.3545,
    note: "Susukino lights and the TV tower beside Odori Park.",
    zhNote: "薄野夜色与大通公园旁的电视塔。",
    photos: [
      {
        src: "/footprint/sapporo-01.jpg",
        caption: "Susukino billboard lights at night.",
        zhCaption: "薄野夜晚的霓虹招牌。",
      },
      {
        src: "/footprint/sapporo-02.jpg",
        caption: "Sapporo TV Tower above Odori Park.",
        zhCaption: "大通公园旁的札幌电视塔。",
      },
    ],
  },
  {
    id: "otaru",
    name: "Otaru",
    zhName: "小樽",
    country: "Japan",
    zhCountry: "日本",
    lat: 43.1907,
    lng: 140.9947,
    note: "Canals, old warehouses, and views from Mount Tengu.",
    zhNote: "运河、旧仓库与天狗山上的港口风景。",
    photos: [
      {
        src: "/footprint/otaru-01.jpg",
        caption: "Otaru Music Box Museum street.",
        zhCaption: "小樽音乐盒堂一带的街道。",
      },
      {
        src: "/footprint/otaru-02.jpg",
        caption: "Otaru Canal beside the old warehouses.",
        zhCaption: "小樽运河与旧仓库。",
      },
      {
        src: "/footprint/otaru-03.jpg",
        caption: "Otaru harbor from Mount Tengu at dusk.",
        zhCaption: "天狗山上俯瞰傍晚的小樽港。",
      },
    ],
  },
  {
    id: "furano",
    name: "Furano",
    zhName: "富良野",
    country: "Japan",
    zhCountry: "日本",
    lat: 43.3421,
    lng: 142.3832,
    note: "Flower fields and wide Hokkaido farmland.",
    zhNote: "花田与北海道辽阔的田野。",
    photos: [
      {
        src: "/footprint/furano-01.jpg",
        caption: "Flower fields and Tokachi mountains in Furano.",
        zhCaption: "富良野花田与十胜岳连峰。",
      },
      {
        src: "/footprint/furano-02.jpg",
        caption: "Patchwork fields around Furano.",
        zhCaption: "富良野一带层层铺开的田野。",
      },
    ],
  },
  {
    id: "inuyama",
    name: "Inuyama",
    zhName: "犬山",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.379,
    lng: 136.9445,
    note: "Inuyama Castle above the Kiso River town.",
    zhNote: "木曾川畔的犬山城。",
    photos: [
      {
        src: "/footprint/inuyama-01.jpg",
        caption: "Inuyama Castle framed by summer green.",
        zhCaption: "夏日绿树间的犬山城。",
      },
    ],
  },
  {
    id: "gifu",
    name: "Gifu",
    zhName: "岐阜",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.4233,
    lng: 136.7607,
    note: "Oda Nobunaga, Gifu Castle, and the Nagara River.",
    zhNote: "织田信长、岐阜城与长良川。",
    photos: [
      {
        src: "/footprint/gifu-01.jpg",
        caption: "Oda Nobunaga statue near Gifu Station.",
        zhCaption: "岐阜站前的织田信长像。",
      },
      {
        src: "/footprint/gifu-02.jpg",
        caption: "Gifu Castle above the stone steps.",
        zhCaption: "石阶尽头的岐阜城。",
      },
      {
        src: "/footprint/gifu-03.jpg",
        caption: "Nagara River and Gifu city from above.",
        zhCaption: "从高处俯瞰长良川与岐阜市区。",
      },
    ],
  },
  {
    id: "takaoka",
    name: "Takaoka",
    zhName: "高冈",
    country: "Japan",
    zhCountry: "日本",
    lat: 36.7541,
    lng: 137.0257,
    note: "Doraemon corners, green fields, Amaharashi Coast, and the Himi Line.",
    zhNote: "哆啦A梦、绿田、雨晴海岸与沿海的冰见线。",
    photos: [
      {
        src: "/footprint/takaoka-03.jpg",
        caption: "Doraemon friends in Takaoka.",
        zhCaption: "高冈市里的哆啦A梦伙伴们。",
      },
      {
        src: "/footprint/takaoka-04.jpg",
        caption: "Green rice fields around Takaoka.",
        zhCaption: "高冈周边的绿油油稻田。",
      },
      {
        src: "/footprint/takaoka-01.jpg",
        caption: "Tracks by Amaharashi Coast.",
        zhCaption: "雨晴海岸旁的铁轨与海。",
      },
      {
        src: "/footprint/takaoka-02.jpg",
        caption: "Amaharashi Coast in soft evening light.",
        zhCaption: "暮色里的雨晴海岸。",
      },
    ],
  },
  {
    id: "himi",
    name: "Himi",
    zhName: "冰见",
    country: "Japan",
    zhCountry: "日本",
    lat: 36.856,
    lng: 136.9885,
    note: "Blue hour along Toyama Bay.",
    zhNote: "富山湾边的蓝调时刻。",
    photos: [
      {
        src: "/footprint/himi-01.jpg",
        caption: "Himi seafront after blue hour rain.",
        zhCaption: "蓝调时分雨后的冰见海边。",
      },
    ],
  },
  {
    id: "matsumoto",
    name: "Matsumoto",
    zhName: "松本",
    country: "Japan",
    zhCountry: "日本",
    lat: 36.238,
    lng: 137.972,
    note: "Matsumoto Castle and Asama Onsen.",
    zhNote: "松本城与浅间温泉。",
    photos: [
      {
        src: "/footprint/matsumoto-01.jpg",
        caption: "Matsumoto Castle across the lawn.",
        zhCaption: "草坪后的松本城。",
      },
      {
        src: "/footprint/matsumoto-02.jpg",
        caption: "Matsumoto city and castle park from above.",
        zhCaption: "从高处望见松本城公园与市区。",
      },
      {
        src: "/footprint/matsumoto-03.jpg",
        caption: "Hot Plaza Asama at night.",
        zhCaption: "夜里的浅间温泉 Hot Plaza。",
      },
    ],
  },
  {
    id: "kanazawa",
    name: "Kanazawa",
    zhName: "金泽",
    country: "Japan",
    zhCountry: "日本",
    lat: 36.5613,
    lng: 136.6562,
    note: "Oyama Shrine and Kenrokuen garden.",
    zhNote: "尾山神社与兼六园。",
    photos: [
      {
        src: "/footprint/kanazawa-01.jpg",
        caption: "Oyama Shrine under late-afternoon light.",
        zhCaption: "午后光线里的尾山神社。",
      },
      {
        src: "/footprint/kanazawa-02.jpg",
        caption: "Kenrokuen garden pond and bridge.",
        zhCaption: "兼六园里的池水与小桥。",
      },
    ],
  },
  {
    id: "kasamatsu",
    name: "Kasamatsu",
    zhName: "笠松",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.367,
    lng: 136.763,
    note: "Racecourse corners and Oguri Cap memories.",
    zhNote: "笠松竞马场与小栗帽记忆。",
    photos: [
      {
        src: "/footprint/kasamatsu-01.jpg",
        caption: "Kasamatsu Racecourse yellow stand.",
        zhCaption: "笠松竞马场的黄色看台。",
      },
      {
        src: "/footprint/kasamatsu-02.jpg",
        caption: "Oguri Cap statue at Kasamatsu Racecourse.",
        zhCaption: "笠松竞马场的小栗帽像。",
      },
    ],
  },
  {
    id: "yokohama",
    name: "Yokohama",
    zhName: "横滨",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.4437,
    lng: 139.638,
    note: "Music by the water.",
    zhNote: "海边的音乐。",
    photos: [
      {
        src: "/footprint/yokohama-01.jpg",
        caption: "A saxophone performance by the bay.",
        zhCaption: "海湾边的萨克斯演奏。",
      },
    ],
  },
  {
    id: "hida",
    name: "Hida",
    zhName: "飞驒",
    country: "Japan",
    zhCountry: "日本",
    lat: 36.2381,
    lng: 137.1863,
    note: "Snow, rivers, and old streets in the Hida region.",
    zhNote: "飞驒的雪、溪流与古街。",
    photos: [
      {
        src: "/footprint/hida-01.jpg",
        caption: "Snow by the river in Hida.",
        zhCaption: "飞驒河畔雪景。",
      },
      {
        src: "/footprint/hida-02.jpg",
        caption: "Snow around an old temple in Hida.",
        zhCaption: "飞驒古寺旁的雪。",
      },
      {
        src: "/footprint/hida-03.jpg",
        caption: "Winter river through Hida.",
        zhCaption: "飞驒冬日溪流。",
      },
    ],
  },
  {
    id: "lake-toya",
    name: "Lake Toya",
    zhName: "洞爷湖",
    country: "Japan",
    zhCountry: "日本",
    lat: 42.565,
    lng: 140.84,
    note: "A caldera lake in Hokkaido, around Toyako and Sobetsu.",
    zhNote: "北海道洞爷湖町、壮瞥町一带的火山口湖。",
    photos: [
      {
        src: "/footprint/lake-toya-01.jpg",
        caption: "Lake Toya from above.",
        zhCaption: "俯瞰洞爷湖。",
      },
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    zhName: "京都",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.0116,
    lng: 135.7681,
    note: "Quiet streets and old temples.",
    zhNote: "安静街巷与古寺。",
    photos: [
      {
        src: "/footprint/kyoto-01.jpg",
        caption: "Kinkaku-ji under a blue sky.",
        zhCaption: "蓝天下的金阁寺。",
      },
      {
        src: "/footprint/kyoto-02.jpg",
        caption: "Torii gate at Fushimi Inari Taisha.",
        zhCaption: "伏见稻荷大社的鸟居。",
      },
      {
        src: "/footprint/kyoto-03.jpg",
        caption: "Torii tunnel at Fushimi Inari Taisha.",
        zhCaption: "伏见稻荷大社的千本鸟居。",
      },
      {
        src: "/footprint/kyoto-04.jpg",
        caption: "Kiyomizu-dera in afternoon light.",
        zhCaption: "午后光线里的清水寺。",
      },
      {
        src: "/footprint/kyoto-05.jpg",
        caption: "Autumn maples under a clear Kyoto sky.",
        zhCaption: "京都晴空下的红叶。",
      },
      {
        src: "/footprint/kyoto-06.jpg",
        caption: "Maple canopy along a quiet Kyoto path.",
        zhCaption: "京都小径旁的红叶树冠。",
      },
      {
        src: "/footprint/kyoto-07.jpg",
        caption: "Kiyomizu-dera stage among autumn maples.",
        zhCaption: "红叶中的清水寺舞台。",
      },
      {
        src: "/footprint/kyoto-08.jpg",
        caption: "Autumn maples below Kiyomizu-dera.",
        zhCaption: "清水寺下方的秋日红叶。",
      },
      {
        src: "/footprint/kyoto-09.jpg",
        caption: "Red maples around Rurikoin.",
        zhCaption: "琉璃光院周围的红叶。",
      },
      {
        src: "/footprint/kyoto-10.jpg",
        caption: "Rurikoin's autumn garden reflected indoors.",
        zhCaption: "琉璃光院室内映出的秋庭。",
      },
    ],
  },
  {
    id: "nara",
    name: "Nara",
    zhName: "奈良",
    country: "Japan",
    zhCountry: "日本",
    lat: 34.6851,
    lng: 135.8048,
    note: "Nara Park, Todaiji, and quiet old temple grounds.",
    zhNote: "奈良公园、东大寺与古寺风景。",
    photos: [
      {
        src: "/footprint/nara-01.jpg",
        caption: "Wakakusayama hillside in Nara Park.",
        zhCaption: "奈良公园若草山的山坡。",
      },
      {
        src: "/footprint/nara-02.jpg",
        caption: "Deer grazing in Nara Park.",
        zhCaption: "奈良公园里散步觅食的小鹿。",
      },
      {
        src: "/footprint/nara-03.jpg",
        caption: "Todaiji Daibutsuden in evening light.",
        zhCaption: "暮色里的东大寺大佛殿。",
      },
      {
        src: "/footprint/nara-04.jpg",
        caption: "Todaiji Nandaimon gate.",
        zhCaption: "东大寺南大门。",
      },
    ],
  },
  {
    id: "uji",
    name: "Uji",
    zhName: "宇治",
    country: "Japan",
    zhCountry: "日本",
    lat: 34.8844,
    lng: 135.7997,
    note: "Byodoin, Uji River, and old shrine paths.",
    zhNote: "平等院、宇治川与古社参道。",
    photos: [
      {
        src: "/footprint/uji-01.jpg",
        caption: "Autumn path near Byodoin in Uji.",
        zhCaption: "宇治平等院附近的秋日小径。",
      },
      {
        src: "/footprint/uji-02.jpg",
        caption: "Uji Bridge over the Uji River.",
        zhCaption: "跨过宇治川的宇治桥。",
      },
      {
        src: "/footprint/uji-03.jpg",
        caption: "Ujigami Shrine torii in autumn.",
        zhCaption: "秋日里的宇治上神社鸟居。",
      },
      {
        src: "/footprint/uji-04.jpg",
        caption: "Uji River from the bridge.",
        zhCaption: "从桥上望向宇治川。",
      },
      {
        src: "/footprint/uji-05.jpg",
        caption: "Overlook above Uji.",
        zhCaption: "俯瞰宇治的山坡观景处。",
      },
    ],
  },
  {
    id: "kinosaki-onsen",
    name: "Kinosaki Onsen",
    zhName: "城崎温泉",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.6257,
    lng: 134.8134,
    note: "Canals, bathhouses, and ryokan streets in the hot spring town.",
    zhNote: "温泉街里的河道、外汤和旅馆街景。",
    photos: [
      {
        src: "/footprint/kinosaki-onsen-01.jpg",
        caption: "Kinosaki Onsen street with ryokan storefronts.",
        zhCaption: "城崎温泉街上的旅馆门面。",
      },
      {
        src: "/footprint/kinosaki-onsen-02.jpg",
        caption: "Willow-lined canal in Kinosaki Onsen.",
        zhCaption: "城崎温泉柳树掩映的河道。",
      },
      {
        src: "/footprint/kinosaki-onsen-03.jpg",
        caption: "Ichinoyu bathhouse in Kinosaki Onsen.",
        zhCaption: "城崎温泉的一之汤。",
      },
      {
        src: "/footprint/kinosaki-onsen-04.jpg",
        caption: "Sunny street in Kinosaki Onsen.",
        zhCaption: "阳光下的城崎温泉街。",
      },
      {
        src: "/footprint/kinosaki-onsen-05.jpg",
        caption: "Canal bridge in Kinosaki Onsen.",
        zhCaption: "城崎温泉河道上的小桥。",
      },
      {
        src: "/footprint/kinosaki-onsen-06.jpg",
        caption: "Goshonoyu bathhouse in Kinosaki Onsen.",
        zhCaption: "城崎温泉的御所之汤。",
      },
    ],
  },
  {
    id: "arima-onsen",
    name: "Arima Onsen",
    zhName: "有马温泉",
    country: "Japan",
    zhCountry: "日本",
    lat: 34.7977,
    lng: 135.2477,
    note: "A mountain hot spring town above Kobe.",
    zhNote: "神户山间的温泉小镇。",
    photos: [
      {
        src: "/footprint/arima-onsen-01.jpg",
        caption: "Arima Onsen town at dusk.",
        zhCaption: "暮色中的有马温泉街。",
      },
      {
        src: "/footprint/arima-onsen-02.jpg",
        caption: "Hillside view over Arima Onsen.",
        zhCaption: "俯瞰有马温泉的山城景色。",
      },
      {
        src: "/footprint/arima-onsen-03.jpg",
        caption: "Kin no Yu bathhouse in Arima Onsen.",
        zhCaption: "有马温泉金之汤。",
      },
    ],
  },
  {
    id: "kobe",
    name: "Kobe",
    zhName: "神户",
    country: "Japan",
    zhCountry: "日本",
    lat: 34.6901,
    lng: 135.1955,
    note: "Harbor light, bridge views, and Chinatown streets.",
    zhNote: "港湾灯光、海峡大桥与南京町街景。",
    photos: [
      {
        src: "/footprint/kobe-01.jpg",
        caption: "BE KOBE sign at Meriken Park.",
        zhCaption: "美利坚公园的 BE KOBE 标识。",
      },
      {
        src: "/footprint/kobe-02.jpg",
        caption: "Akashi Kaikyo Bridge at sunset.",
        zhCaption: "日落时的明石海峡大桥。",
      },
      {
        src: "/footprint/kobe-03.jpg",
        caption: "Akashi Kaikyo Bridge tower at dusk.",
        zhCaption: "暮色中的明石海峡大桥桥塔。",
      },
      {
        src: "/footprint/kobe-04.jpg",
        caption: "Under the Akashi Kaikyo Bridge.",
        zhCaption: "明石海峡大桥桥下结构。",
      },
      {
        src: "/footprint/kobe-05.jpg",
        caption: "Nankinmachi gate in Kobe Chinatown.",
        zhCaption: "神户南京町的牌楼。",
      },
    ],
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    zhName: "香港",
    country: "China",
    zhCountry: "中国",
    lat: 22.3193,
    lng: 114.1694,
    note: "Harbor views, Hong Kong nights, and HKU campus corners.",
    zhNote: "维港夜色与香港大学校园角落。",
    photos: [
      {
        src: "/footprint/hong-kong-01.jpg",
        caption: "Harbor view through the city.",
        zhCaption: "城市缝隙中的维港。",
      },
      {
        src: "/footprint/hong-kong-02.jpg",
        caption: "Hong Kong at night.",
        zhCaption: "夜色中的香港。",
      },
      {
        src: "/footprint/hong-kong-03.jpg",
        caption: "Entrance steps at the University of Hong Kong.",
        zhCaption: "香港大学入口台阶。",
      },
      {
        src: "/footprint/hong-kong-04.jpg",
        caption: "Main Building and anniversary display at HKU.",
        zhCaption: "香港大学本部大楼与校庆装置。",
      },
      {
        src: "/footprint/hong-kong-05.jpg",
        caption: "Clock tower view at the University of Hong Kong.",
        zhCaption: "香港大学校园里的钟楼视角。",
      },
      {
        src: "/footprint/hong-kong-06.jpg",
        caption: "HKU 115th anniversary banners on campus.",
        zhCaption: "香港大学校园里的 115 周年布置。",
      },
      {
        src: "/footprint/hong-kong-07.jpg",
        caption: "University of Hong Kong sign wall.",
        zhCaption: "香港大学校名墙。",
      },
      {
        src: "/footprint/hong-kong-08.jpg",
        caption: "Mist over the hillside buildings above HKU.",
        zhCaption: "香港大学上方山坡建筑间的雾气。",
      },
      {
        src: "/footprint/hong-kong-09.jpg",
        caption: "Hillside walkways and roads around HKU.",
        zhCaption: "香港大学周边的山坡步道与道路。",
      },
    ],
  },
  {
    id: "kitchener",
    name: "Kitchener",
    zhName: "基奇纳",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.4516,
    lng: -80.4925,
    note: "Chicopee Ski & Summer Resort on a winter slope day.",
    zhNote: "Chicopee Ski & Summer Resort 的冬日雪道。",
    photos: [
      {
        src: "/footprint/kitchener-01.jpg",
        caption: "Chicopee ski slope on a grey winter day.",
        zhCaption: "阴天里 Chicopee 的滑雪道。",
      },
    ],
  },
  {
    id: "waterloo",
    name: "Waterloo",
    zhName: "滑铁卢",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.4643,
    lng: -80.5204,
    note: "Ph.D. years.",
    zhNote: "博士阶段的城市。",
    photos: [
      {
        src: "/footprint/waterloo-01.jpg",
        caption: "Autumn in Waterloo.",
        zhCaption: "滑铁卢的秋天。",
      },
      {
        src: "/footprint/waterloo-02.jpg",
        caption: "Snowy neighborhood street in Waterloo.",
        zhCaption: "滑铁卢雪中的社区街道。",
      },
      {
        src: "/footprint/waterloo-03.jpg",
        caption: "Winter road in Waterloo.",
        zhCaption: "滑铁卢的冬日道路。",
      },
      {
        src: "/footprint/waterloo-04.jpg",
        caption: "Night snowfall in Waterloo.",
        zhCaption: "滑铁卢夜里的落雪。",
      },
      {
        src: "/footprint/waterloo-05.jpg",
        caption: "Winter rainbow over a Waterloo neighborhood.",
        zhCaption: "滑铁卢社区上空的冬日彩虹。",
      },
      {
        src: "/footprint/waterloo-06.jpg",
        caption: "Quiet water reflection in Waterloo.",
        zhCaption: "滑铁卢水边安静的倒影。",
      },
      {
        src: "/footprint/waterloo-07.jpg",
        caption: "Neighborhood street dimmed during the solar eclipse.",
        zhCaption: "日食期间暗下来的滑铁卢社区街道。",
      },
      {
        src: "/footprint/waterloo-08.jpg",
        caption: "Clear Waterloo sky on solar eclipse day.",
        zhCaption: "日食当天滑铁卢清澈的天空。",
      },
      {
        src: "/footprint/waterloo-09.jpg",
        caption: "Dusk-like light during the solar eclipse in Waterloo.",
        zhCaption: "日食期间滑铁卢近似暮色的光线。",
      },
      {
        src: "/footprint/waterloo-10.jpg",
        caption: "Basketball hoop and big Waterloo sky.",
        zhCaption: "篮球架与滑铁卢开阔的天空。",
      },
      {
        src: "/footprint/waterloo-11.jpg",
        caption: "Waterloo home on a bright afternoon.",
        zhCaption: "晴天下的滑铁卢的家。",
      },
    ],
  },
  {
    id: "toronto",
    name: "Toronto",
    zhName: "多伦多",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.6532,
    lng: -79.3832,
    note: "Casa Loma, CN Tower, University of Toronto, and downtown skyline views.",
    zhNote: "Casa Loma、CN Tower、多伦多大学与市中心天际线。",
    photos: [
      {
        src: "/footprint/toronto-01.jpg",
        caption: "Casa Loma's stone facade in winter.",
        zhCaption: "冬日里的 Casa Loma 石墙外观。",
      },
      {
        src: "/footprint/toronto-02.jpg",
        caption: "The conservatory inside Casa Loma.",
        zhCaption: "Casa Loma 内的温室大厅。",
      },
      {
        src: "/footprint/toronto-03.jpg",
        caption: "Casa Loma's towers.",
        zhCaption: "Casa Loma 的城堡塔楼。",
      },
      {
        src: "/footprint/toronto-04.jpg",
        caption: "Toronto skyline viewed from Casa Loma.",
        zhCaption: "从 Casa Loma 望向多伦多天际线。",
      },
      {
        src: "/footprint/toronto-05.jpg",
        caption: "Casa Loma and downtown Toronto.",
        zhCaption: "Casa Loma 与多伦多市中心。",
      },
      {
        src: "/footprint/toronto-06.jpg",
        caption: "CN Tower from the street.",
        zhCaption: "街道视角下的 CN Tower。",
      },
      {
        src: "/footprint/toronto-07.jpg",
        caption: "Toronto from the CN Tower.",
        zhCaption: "从 CN Tower 俯瞰多伦多。",
      },
      {
        src: "/footprint/toronto-08.jpg",
        caption: "Lake Ontario and downtown from the CN Tower.",
        zhCaption: "从 CN Tower 俯瞰安大略湖与市中心。",
      },
      {
        src: "/footprint/toronto-09.jpg",
        caption: "Sunset over Toronto from the CN Tower.",
        zhCaption: "从 CN Tower 俯瞰多伦多日落。",
      },
      {
        src: "/footprint/toronto-10.jpg",
        caption: "Downtown Toronto at night from the CN Tower.",
        zhCaption: "从 CN Tower 俯瞰夜色中的多伦多市中心。",
      },
      {
        src: "/footprint/toronto-11.jpg",
        caption: "Night traffic and waterfront from the CN Tower.",
        zhCaption: "从 CN Tower 俯瞰夜间车流与湖岸。",
      },
      {
        src: "/footprint/toronto-12.jpg",
        caption: "CN Tower lit purple at night.",
        zhCaption: "夜里亮起紫色灯光的 CN Tower。",
      },
      {
        src: "/footprint/toronto-13.jpg",
        caption: "Table tennis hall in Toronto.",
        zhCaption: "多伦多的乒乓球馆。",
      },
      {
        src: "/footprint/toronto-14.jpg",
        caption: "Toronto City Hall and the Toronto sign at Nathan Phillips Square.",
        zhCaption: "Nathan Phillips Square 的 Toronto 标识与多伦多市政厅。",
      },
      {
        src: "/footprint/toronto-15.jpg",
        caption: "University College on the University of Toronto campus.",
        zhCaption: "多伦多大学校园里的 University College。",
      },
      {
        src: "/footprint/toronto-16.jpg",
        caption: "University College facade at the University of Toronto.",
        zhCaption: "多伦多大学 University College 的石墙外立面。",
      },
      {
        src: "/footprint/toronto-17.jpg",
        caption: "Hart House and Soldiers' Tower at the University of Toronto.",
        zhCaption: "多伦多大学的 Hart House 与 Soldiers' Tower。",
      },
      {
        src: "/footprint/toronto-19.jpg",
        caption: "Downtown towers in Toronto.",
        zhCaption: "多伦多市中心的高楼。",
      },
      {
        src: "/footprint/toronto-20.jpg",
        caption: "Toronto waterfront skyline with the CN Tower.",
        zhCaption: "带着 CN Tower 的多伦多湖滨天际线。",
      },
      {
        src: "/footprint/toronto-21.jpg",
        caption: "Seafood restaurant storefront in Toronto.",
        zhCaption: "多伦多街头的海鲜餐馆门面。",
      },
      {
        src: "/footprint/toronto-26.jpg",
        caption: "Clay pot rice and hot pot at Fu Lai Kitchen in Toronto.",
        zhCaption: "多伦多富来小厨的煲仔饭与火锅。",
      },
      {
        src: "/footprint/toronto-22.jpg",
        caption: "Toronto skyline across a frozen waterfront.",
        zhCaption: "冰封湖岸对面的多伦多天际线。",
      },
      {
        src: "/footprint/toronto-23.jpg",
        caption: "Toronto City Hall and the Toronto sign on a winter day.",
        zhCaption: "冬日多伦多市政厅与 Toronto 标识。",
      },
      {
        src: "/footprint/toronto-24.jpg",
        caption: "Toronto skyline and CN Tower from a balcony.",
        zhCaption: "从阳台望向多伦多天际线与 CN Tower。",
      },
      {
        src: "/footprint/toronto-25.jpg",
        caption: "Toronto skyline at sunset by the water.",
        zhCaption: "水边夕照里的多伦多天际线。",
      },
    ],
  },
  {
    id: "milton",
    name: "Milton",
    zhName: "米尔顿",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.5183,
    lng: -79.8774,
    note: "Glen Eden snow and winter hill views.",
    zhNote: "Glen Eden 的雪道与冬日山坡。",
    photos: [
      {
        src: "/footprint/milton-01.jpg",
        caption: "Snowy slope at Glen Eden.",
        zhCaption: "Glen Eden 的雪道。",
      },
    ],
  },
  {
    id: "grimsby",
    name: "Grimsby",
    zhName: "格里姆斯比",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.2001,
    lng: -79.5663,
    note: "Advisor's home and the last day of the PhD.",
    zhNote: "导师的家，与 PhD 最后一天。",
    photos: [
      {
        src: "/footprint/grimsby-01.jpg",
        caption: "Sunset clouds above the orchard in Grimsby.",
        zhCaption: "格里姆斯比果园上方的晚霞。",
      },
      {
        src: "/footprint/grimsby-02.jpg",
        caption: "Yard at my advisor's home on the last PhD day.",
        zhCaption: "PhD 最后一天，导师家的院子。",
      },
    ],
  },
  {
    id: "niagara-falls",
    name: "Niagara Falls",
    zhName: "尼亚加拉瀑布",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.0896,
    lng: -79.0849,
    note: "Horseshoe Falls, American Falls, and river mist.",
    zhNote: "马蹄瀑布、美国瀑布与河面水雾。",
    photos: [
      {
        src: "/footprint/niagara-falls-01.jpg",
        caption: "Niagara Falls with the tour boat in the mist.",
        zhCaption: "水雾中驶近瀑布的尼亚加拉游船。",
      },
      {
        src: "/footprint/niagara-falls-02.jpg",
        caption: "Horseshoe Falls and rushing river mist.",
        zhCaption: "马蹄瀑布与奔涌的水雾。",
      },
    ],
  },
  {
    id: "niagara-on-the-lake",
    name: "Niagara-on-the-Lake",
    zhName: "尼亚加拉湖滨小镇",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.254,
    lng: -79.0773,
    note: "Peller Estates and Pillitteri winery stops in Niagara wine country.",
    zhNote: "尼亚加拉葡萄酒乡里的 Peller Estates 与 Pillitteri 酒庄。",
    photos: [
      {
        src: "/footprint/niagara-on-the-lake-01.jpg",
        caption: "Peller Estates winery grounds on a misty day.",
        zhCaption: "雾天里的 Peller Estates 酒庄庭院。",
      },
      {
        src: "/footprint/niagara-on-the-lake-02.jpg",
        caption: "Peller Estates facade and lawn.",
        zhCaption: "Peller Estates 酒庄外立面与草坪。",
      },
      {
        src: "/footprint/niagara-on-the-lake-03.jpg",
        caption: "Pillitteri winery tanks and barrels.",
        zhCaption: "Pillitteri 酒庄里的酒罐与木桶。",
      },
    ],
  },
  {
    id: "stratford",
    name: "Stratford",
    zhName: "斯特拉福德",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 43.3709,
    lng: -80.9822,
    note: "Historic downtown streets and theatre-town brickwork.",
    zhNote: "老城街景与剧院小城的红砖建筑。",
    photos: [
      {
        src: "/footprint/stratford-01.jpg",
        caption: "Stratford City Hall at Wellington and Downie.",
        zhCaption: "Wellington 和 Downie 路口的 Stratford City Hall。",
      },
      {
        src: "/footprint/stratford-02.jpg",
        caption: "Downtown Stratford street on a clear day.",
        zhCaption: "晴天里的斯特拉福德市中心街道。",
      },
    ],
  },
  {
    id: "windsor",
    name: "Windsor",
    zhName: "温莎",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 42.3149,
    lng: -83.0364,
    note: "Detroit River views facing Detroit across the water.",
    zhNote: "隔着底特律河望向对岸的 Detroit。",
    photos: [
      {
        src: "/footprint/windsor-01.jpg",
        caption: "Fishing along the Detroit River in Windsor.",
        zhCaption: "温莎底特律河边的垂钓。",
      },
      {
        src: "/footprint/windsor-02.jpg",
        caption: "Detroit skyline across the river from Windsor.",
        zhCaption: "从温莎隔河望见的 Detroit 天际线。",
      },
      {
        src: "/footprint/windsor-03.jpg",
        caption: "Ambassador Bridge between Windsor and Detroit.",
        zhCaption: "连接温莎与 Detroit 的 Ambassador Bridge。",
      },
    ],
  },
  {
    id: "leamington",
    name: "Leamington",
    zhName: "利明顿",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 42.0547,
    lng: -82.5998,
    note: "Point Pelee National Park beaches and Lake Erie views.",
    zhNote: "比利角国家公园的湖岸与伊利湖风景。",
    photos: [
      {
        src: "/footprint/leamington-01.jpg",
        caption: "Point Pelee beach and Lake Erie horizon.",
        zhCaption: "比利角国家公园的沙滩与伊利湖地平线。",
      },
      {
        src: "/footprint/leamington-02.jpg",
        caption: "Pebble shore at Point Pelee National Park.",
        zhCaption: "比利角国家公园的卵石湖岸。",
      },
      {
        src: "/footprint/leamington-03.jpg",
        caption: "Wooded shoreline inside Point Pelee National Park.",
        zhCaption: "比利角国家公园里的林间湖岸。",
      },
    ],
  },
  {
    id: "oro-medonte",
    name: "Oro-Medonte",
    zhName: "奥罗-梅东特",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 44.6086,
    lng: -79.6666,
    note: "Mount St. Louis Moonstone ski slopes.",
    zhNote: "Mount St. Louis Moonstone 的滑雪场。",
    photos: [
      {
        src: "/footprint/oro-medonte-01.jpg",
        caption: "Open ski run at Mount St. Louis Moonstone.",
        zhCaption: "Mount St. Louis Moonstone 开阔的雪道。",
      },
      {
        src: "/footprint/oro-medonte-02.jpg",
        caption: "Snowy slope looking back toward the base.",
        zhCaption: "回望雪场底部的 Mount St. Louis 雪坡。",
      },
    ],
  },
  {
    id: "montreal",
    name: "Montreal",
    zhName: "蒙特利尔",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 45.5017,
    lng: -73.5673,
    note: "Old Montreal, Notre-Dame Basilica, Place d'Armes, and Mount Royal landmarks.",
    zhNote: "老蒙特利尔、Notre-Dame Basilica、Place d'Armes 与皇家山地标。",
    photos: [
      {
        src: "/footprint/montreal-01.jpg",
        caption: "YUL Condominiums and downtown Montreal towers.",
        zhCaption: "YUL Condominiums 与蒙特利尔市中心高楼。",
      },
      {
        src: "/footprint/montreal-02.jpg",
        caption: "Christ Church Cathedral in downtown Montreal.",
        zhCaption: "蒙特利尔市中心的 Christ Church Cathedral。",
      },
      {
        src: "/footprint/montreal-03.jpg",
        caption: "Montreal Clock Tower, also called Tour de l'Horloge.",
        zhCaption: "蒙特利尔 Clock Tower，也叫 Tour de l'Horloge。",
      },
      {
        src: "/footprint/montreal-04.jpg",
        caption: "Jacques Cartier Bridge over the St. Lawrence River.",
        zhCaption: "圣劳伦斯河上的 Jacques Cartier Bridge。",
      },
      {
        src: "/footprint/montreal-05.jpg",
        caption: "Montreal Clock Tower and Jacques Cartier Bridge from the Old Port.",
        zhCaption: "从 Old Port 看 Montreal Clock Tower 与 Jacques Cartier Bridge。",
      },
      {
        src: "/footprint/montreal-06.jpg",
        caption: "Christ Church Cathedral and downtown Montreal streets.",
        zhCaption: "Christ Church Cathedral 与蒙特利尔市中心街景。",
      },
      {
        src: "/footprint/montreal-07.jpg",
        caption: "Maisonneuve Monument and the Bank of Montreal at Place d'Armes.",
        zhCaption: "Place d'Armes 的 Maisonneuve Monument 与 Bank of Montreal。",
      },
      {
        src: "/footprint/montreal-08.jpg",
        caption: "Notre-Dame Basilica of Montreal.",
        zhCaption: "蒙特利尔 Notre-Dame Basilica。",
      },
      {
        src: "/footprint/montreal-09.jpg",
        caption: "New York Life Building and Maisonneuve Monument at Place d'Armes.",
        zhCaption: "Place d'Armes 的 New York Life Building 与 Maisonneuve Monument。",
      },
      {
        src: "/footprint/montreal-10.jpg",
        caption: "Centaur Theatre in the former Montreal Stock Exchange building.",
        zhCaption: "原 Montreal Stock Exchange 大楼里的 Centaur Theatre。",
      },
      {
        src: "/footprint/montreal-11.jpg",
        caption: "Saint Joseph's Oratory of Mount Royal at night.",
        zhCaption: "夜色中的 Saint Joseph's Oratory of Mount Royal。",
      },
      {
        src: "/footprint/montreal-12.jpg",
        caption: "Schwartz's Deli on Saint-Laurent Boulevard.",
        zhCaption: "Saint-Laurent Boulevard 上的 Schwartz's Deli。",
      },
      {
        src: "/footprint/montreal-13.jpg",
        caption: "Habitat 67 beside the St. Lawrence River.",
        zhCaption: "圣劳伦斯河畔的 Habitat 67。",
      },
      {
        src: "/footprint/montreal-14.jpg",
        caption: "Place Jacques-Cartier in Old Montreal at night.",
        zhCaption: "夜色中的老蒙特利尔 Place Jacques-Cartier。",
      },
      {
        src: "/footprint/montreal-15.jpg",
        caption: "Notre-Dame Basilica and Maisonneuve Monument at night.",
        zhCaption: "夜晚的 Notre-Dame Basilica 与 Maisonneuve Monument。",
      },
    ],
  },
  {
    id: "thousand-islands",
    name: "Thousand Islands",
    zhName: "千岛群岛",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 44.347,
    lng: -75.981,
    note: "1000 Islands Tower views over the St. Lawrence River.",
    zhNote: "从 1000 Islands Tower 眺望圣劳伦斯河与千岛群岛。",
    photos: [
      {
        src: "/footprint/thousand-islands-01.jpg",
        caption: "Thousand Islands view from the 1000 Islands Tower.",
        zhCaption: "从 1000 Islands Tower 俯瞰千岛群岛。",
      },
      {
        src: "/footprint/thousand-islands-02.jpg",
        caption: "St. Lawrence River channels seen from the 1000 Islands Tower.",
        zhCaption: "从 1000 Islands Tower 看圣劳伦斯河水道。",
      },
      {
        src: "/footprint/thousand-islands-03.jpg",
        caption: "1000 Islands Tower observation deck.",
        zhCaption: "1000 Islands Tower 的观景塔入口。",
      },
    ],
  },
  {
    id: "vancouver",
    name: "Vancouver",
    zhName: "温哥华",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 49.2827,
    lng: -123.1207,
    note: "Suspension bridge, cherry blossoms, Stanley Park, and waterfront paths.",
    zhNote: "吊桥、樱花、Stanley Park 与海边步道。",
    photos: [
      {
        src: "/footprint/vancouver-01.jpg",
        caption: "Capilano Suspension Bridge entrance sign.",
        zhCaption: "Capilano Suspension Bridge 的入口标识。",
      },
      {
        src: "/footprint/vancouver-02.jpg",
        caption: "Capilano Suspension Bridge above the forest.",
        zhCaption: "森林上方的 Capilano Suspension Bridge。",
      },
      {
        src: "/footprint/vancouver-03.jpg",
        caption: "Cherry blossoms along a Vancouver street.",
        zhCaption: "温哥华街边盛开的樱花。",
      },
      {
        src: "/footprint/vancouver-04.jpg",
        caption: "Spring blossoms in downtown Vancouver.",
        zhCaption: "温哥华市中心的春日樱花。",
      },
      {
        src: "/footprint/vancouver-05.jpg",
        caption: "Gardens near Stanley Park Pavilion.",
        zhCaption: "Stanley Park Pavilion 附近的花园。",
      },
      {
        src: "/footprint/vancouver-06.jpg",
        caption: "Lions Gate Bridge from Stanley Park.",
        zhCaption: "从 Stanley Park 望向 Lions Gate Bridge。",
      },
      {
        src: "/footprint/vancouver-07.jpg",
        caption: "False Creek waterfront path in Vancouver.",
        zhCaption: "温哥华 False Creek 边的步道。",
      },
    ],
  },
  {
    id: "edmonton",
    name: "Edmonton",
    zhName: "埃德蒙顿",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 53.5461,
    lng: -113.4938,
    note: "University of Alberta campus buildings and lawns.",
    zhNote: "阿尔伯塔大学的校园建筑与草坪。",
    photos: [
      {
        src: "/footprint/edmonton-01.jpg",
        caption: "Historic brick building at the University of Alberta.",
        zhCaption: "阿尔伯塔大学的历史红砖建筑。",
      },
      {
        src: "/footprint/edmonton-02.jpg",
        caption: "University of Alberta campus building under a clear sky.",
        zhCaption: "晴空下的阿尔伯塔大学校园建筑。",
      },
      {
        src: "/footprint/edmonton-03.jpg",
        caption: "Bronze campus statue at the University of Alberta.",
        zhCaption: "阿尔伯塔大学校园里的铜像。",
      },
      {
        src: "/footprint/edmonton-04.jpg",
        caption: "Main Quad at the University of Alberta.",
        zhCaption: "阿尔伯塔大学 Main Quad。",
      },
      {
        src: "/footprint/edmonton-05.jpg",
        caption: "Spring trees on the University of Alberta campus.",
        zhCaption: "阿尔伯塔大学校园里的春日树影。",
      },
    ],
  },
  {
    id: "canmore",
    name: "Canmore",
    zhName: "坎莫尔",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 51.089,
    lng: -115.359,
    note: "Rocky Mountain views just east of Banff National Park.",
    zhNote: "班夫国家公园以东的落基山景。",
    photos: [
      {
        src: "/footprint/canmore-01.jpg",
        caption: "Mountain bridge and forest in Canmore.",
        zhCaption: "坎莫尔的山林与小桥。",
      },
      {
        src: "/footprint/canmore-02.jpg",
        caption: "Canmore sign with the Rockies behind it.",
        zhCaption: "落基山前的 Canmore 标识。",
      },
    ],
  },
  {
    id: "banff",
    name: "Banff",
    zhName: "班夫",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 51.4968,
    lng: -115.9281,
    note: "Mountain lakes and quiet light.",
    zhNote: "山间湖水与安静的光。",
    photos: [
      {
        src: "/footprint/banff-01.jpg",
        caption: "Canoe on a mountain lake.",
        zhCaption: "山间湖上的小舟。",
      },
      {
        src: "/footprint/banff-02.jpg",
        caption: "Bow Lake along the Icefields Parkway.",
        zhCaption: "Icefields Parkway 沿线的 Bow Lake。",
      },
      {
        src: "/footprint/banff-03.jpg",
        caption: "Lake Louise beneath the Victoria Glacier.",
        zhCaption: "Victoria Glacier 下方的 Lake Louise。",
      },
      {
        src: "/footprint/banff-04.jpg",
        caption: "Moraine Lake and the Valley of the Ten Peaks.",
        zhCaption: "Moraine Lake 与十峰谷。",
      },
      {
        src: "/footprint/banff-05.jpg",
        caption: "Moonrise over the Rockies in Banff National Park.",
        zhCaption: "班夫国家公园落基山上的月升。",
      },
    ],
  },
  {
    id: "jasper",
    name: "Jasper",
    zhName: "贾斯珀",
    country: "Canada",
    zhCountry: "加拿大",
    lat: 52.8737,
    lng: -118.0814,
    note: "Columbia Icefield and the Athabasca Glacier.",
    zhNote: "哥伦比亚冰原与 Athabasca Glacier。",
    photos: [
      {
        src: "/footprint/jasper-01.jpg",
        caption: "Athabasca Glacier at the Columbia Icefield.",
        zhCaption: "哥伦比亚冰原上的 Athabasca Glacier。",
      },
    ],
  },
  {
    id: "guadalajara",
    name: "Guadalajara",
    zhName: "瓜达拉哈拉",
    country: "Mexico",
    zhCountry: "墨西哥",
    lat: 20.6597,
    lng: -103.3496,
    note: "ITESO campus, cathedral interiors, plazas, and historic center walks.",
    zhNote: "ITESO 校园、教堂内部、广场与历史中心漫步。",
    photos: [
      {
        src: "/footprint/guadalajara-01.jpg",
        caption: "Tree shade across the ITESO campus.",
        zhCaption: "ITESO 校园里铺开的树荫。",
      },
      {
        src: "/footprint/guadalajara-02.jpg",
        caption: "Pink blossoms on the ITESO campus lawn.",
        zhCaption: "ITESO 校园草坪上的粉色花枝。",
      },
      {
        src: "/footprint/guadalajara-03.jpg",
        caption: "Classroom buildings among the trees at ITESO.",
        zhCaption: "ITESO 树林之间的教学楼。",
      },
      {
        src: "/footprint/guadalajara-04.jpg",
        caption: "Historic plaza and bronze statue in Guadalajara.",
        zhCaption: "瓜达拉哈拉老城广场与铜像。",
      },
      {
        src: "/footprint/guadalajara-05.jpg",
        caption: "Guadalajara Cathedral rising into the blue sky.",
        zhCaption: "蓝天下的瓜达拉哈拉主教座堂。",
      },
      {
        src: "/footprint/guadalajara-06.jpg",
        caption: "Horse carriages and jacaranda shade downtown.",
        zhCaption: "市中心的马车与蓝花楹树影。",
      },
      {
        src: "/footprint/guadalajara-07.jpg",
        caption: "Ornate interior of Guadalajara Cathedral.",
        zhCaption: "瓜达拉哈拉主教座堂华丽的内部。",
      },
      {
        src: "/footprint/guadalajara-08.jpg",
        caption: "Carriages waiting beside the cathedral.",
        zhCaption: "主教座堂旁等待的马车。",
      },
      {
        src: "/footprint/guadalajara-09.jpg",
        caption: "Stained glass inside Guadalajara Cathedral.",
        zhCaption: "瓜达拉哈拉主教座堂里的彩色玻璃。",
      },
      {
        src: "/footprint/guadalajara-10.jpg",
        caption: "Street mural and market stalls in Guadalajara.",
        zhCaption: "瓜达拉哈拉街头的壁画与市集摊位。",
      },
      {
        src: "/footprint/guadalajara-11.jpg",
        caption: "Cathedral towers above the historic center.",
        zhCaption: "历史中心上方的主教座堂双塔。",
      },
    ],
  },
  {
    id: "tequila",
    name: "Tequila",
    zhName: "特基拉",
    country: "Mexico",
    zhCountry: "墨西哥",
    lat: 20.882,
    lng: -103.8357,
    note: "Agave fields, distillery rooms, church squares, and festival streets.",
    zhNote: "龙舌兰田、酒厂空间、教堂广场与节庆街头。",
    photos: [
      {
        src: "/footprint/tequila-01.jpg",
        caption: "Rows of agave outside Tequila.",
        zhCaption: "特基拉城外成排的龙舌兰。",
      },
      {
        src: "/footprint/tequila-02.jpg",
        caption: "Stone courtyard and clear sky in Tequila.",
        zhCaption: "特基拉的石砌院落与晴空。",
      },
      {
        src: "/footprint/tequila-03.jpg",
        caption: "Museum stairway with small sculpted faces.",
        zhCaption: "博物馆楼梯旁陈列的小型面具雕塑。",
      },
      {
        src: "/footprint/tequila-04.jpg",
        caption: "Statue in a sunlit Tequila courtyard.",
        zhCaption: "特基拉阳光庭院里的雕像。",
      },
      {
        src: "/footprint/tequila-05.jpg",
        caption: "Copper stills inside a tequila distillery.",
        zhCaption: "特基拉酒厂里的铜制蒸馏设备。",
      },
      {
        src: "/footprint/tequila-06.jpg",
        caption: "Barrel room stacked high in a tequila distillery.",
        zhCaption: "特基拉酒厂里层层堆叠的橡木桶。",
      },
      {
        src: "/footprint/tequila-07.jpg",
        caption: "Garden path and white chapel in Tequila.",
        zhCaption: "特基拉花园小径旁的白色小堂。",
      },
      {
        src: "/footprint/tequila-08.jpg",
        caption: "Bronze figures near the parish church.",
        zhCaption: "教堂旁的铜像人物。",
      },
      {
        src: "/footprint/tequila-09.jpg",
        caption: "Voladores performance above the plaza.",
        zhCaption: "广场上方的飞人表演。",
      },
      {
        src: "/footprint/tequila-10.jpg",
        caption: "Parish tower and lively plaza in Tequila.",
        zhCaption: "特基拉热闹广场旁的教堂钟楼。",
      },
    ],
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    zhName: "墨西哥城",
    country: "Mexico",
    zhCountry: "墨西哥",
    lat: 19.4326,
    lng: -99.1332,
    note: "Teotihuacan pyramids on a day trip from Mexico City.",
    zhNote: "从墨西哥城出发前往特奥蒂瓦坎金字塔。",
    photos: [
      {
        src: "/footprint/mexico-city-01.jpg",
        caption: "Stepped pyramid at Teotihuacan.",
        zhCaption: "特奥蒂瓦坎的阶梯金字塔。",
      },
      {
        src: "/footprint/mexico-city-02.jpg",
        caption: "Stone platforms and distant mountains at Teotihuacan.",
        zhCaption: "特奥蒂瓦坎的石台与远处群山。",
      },
      {
        src: "/footprint/mexico-city-03.jpg",
        caption: "The Pyramid of the Sun beneath moving clouds.",
        zhCaption: "云层下的太阳金字塔。",
      },
      {
        src: "/footprint/mexico-city-04.jpg",
        caption: "Wide view across the Teotihuacan ruins.",
        zhCaption: "远望特奥蒂瓦坎遗址群。",
      },
      {
        src: "/footprint/mexico-city-05.jpg",
        caption: "Teotihuacan steps under a bright clouded sky.",
        zhCaption: "晴云下的特奥蒂瓦坎石阶。",
      },
    ],
  },
  {
    id: "cancun",
    name: "Cancun",
    zhName: "坎昆",
    country: "Mexico",
    zhCountry: "墨西哥",
    lat: 21.1619,
    lng: -86.8515,
    note: "Caribbean beaches, Chichen Itza, cenote light, and conference memories.",
    zhNote: "加勒比海滩、奇琴伊察、天然井光影与会议记忆。",
    photos: [
      {
        src: "/footprint/cancun-01.jpg",
        caption: "Evening waves along Cancun's hotel-zone beach.",
        zhCaption: "坎昆酒店区海滩上的傍晚海浪。",
      },
      {
        src: "/footprint/cancun-02.jpg",
        caption: "Beachfront view along the Cancun hotel zone.",
        zhCaption: "坎昆酒店区的海滩视野。",
      },
      {
        src: "/footprint/cancun-03.jpg",
        caption: "Clouds and surf at dusk in Cancun.",
        zhCaption: "坎昆黄昏时的云与浪。",
      },
      {
        src: "/footprint/cancun-04.jpg",
        caption: "El Castillo at Chichen Itza.",
        zhCaption: "奇琴伊察的库库尔坎金字塔。",
      },
      {
        src: "/footprint/cancun-05.jpg",
        caption: "Cenote Ik Kil near Chichen Itza.",
        zhCaption: "奇琴伊察附近的 Ik Kil 天然井。",
      },
      {
        src: "/footprint/cancun-06.jpg",
        caption: "Clear Caribbean water on a bright Cancun day.",
        zhCaption: "晴天里清澈的坎昆加勒比海水。",
      },
      {
        src: "/footprint/cancun-07.jpg",
        caption: "Pastel sunset over Cancun beach.",
        zhCaption: "坎昆海滩上方的粉色晚霞。",
      },
      {
        src: "/footprint/cancun-08.jpg",
        caption: "Group photo in front of El Castillo at Chichen Itza.",
        zhCaption: "奇琴伊察库库尔坎金字塔前的合影。",
      },
      {
        src: "/footprint/cancun-09.jpg",
        caption: "Colorful Cancun 2024 sign by the beach.",
        zhCaption: "海滩边彩色的 Cancun 2024 标志。",
      },
      {
        src: "/footprint/cancun-10.jpg",
        caption: "Turquoise water and white sand in Cancun.",
        zhCaption: "坎昆的蓝绿色海水与白沙。",
      },
      {
        src: "/footprint/cancun-11.jpg",
        caption: "Cancun 2024 conference courtyard.",
        zhCaption: "Cancun 2024 会议庭院。",
      },
    ],
  },
  {
    id: "atlanta",
    name: "Atlanta",
    zhName: "亚特兰大",
    country: "USA",
    zhCountry: "美国",
    lat: 33.749,
    lng: -84.388,
    note: "Home bases, Coca-Cola, Georgia Tech, and Stone Mountain.",
    zhNote: "住过的家、可口可乐世界、佐治亚理工和 Stone Mountain。",
    photos: [
      {
        src: "/footprint/atlanta-01.jpg",
        caption: "My first place in Atlanta.",
        zhCaption: "我在亚特兰大住的第一个地方。",
      },
      {
        src: "/footprint/atlanta-home-last-night-01.jpg",
        caption: "Last night in my first Atlanta home.",
        zhCaption: "我在亚特兰大住的第一个家最后一晚。",
      },
      {
        src: "/footprint/atlanta-second-home-first-night-01.jpg",
        caption: "First night in my second Atlanta home.",
        zhCaption: "我在亚特兰大住的第二个家第一晚。",
      },
      {
        src: "/footprint/world-of-coca-cola-01.jpg",
        caption: "World of Coca-Cola in downtown Atlanta.",
        zhCaption: "亚特兰大市中心的可口可乐世界。",
      },
      {
        src: "/footprint/georgia-tech-03.jpg",
        caption: "Clouds over the Georgia Tech campus.",
        zhCaption: "佐治亚理工校园上空的云。",
      },
      {
        src: "/footprint/georgia-tech-01.jpg",
        caption: "Georgia Tech campus lawn and student event.",
        zhCaption: "佐治亚理工校园草坪与学生活动。",
      },
      {
        src: "/footprint/stone-mountain-atlanta-01.jpg",
        caption: "Stone Mountain under a wide blue sky.",
        zhCaption: "亚特兰大附近 Stone Mountain 上的蓝天。",
      },
      {
        src: "/footprint/stone-mountain-atlanta-02.jpg",
        caption: "Cable car view at Stone Mountain.",
        zhCaption: "Stone Mountain 的缆车视野。",
      },
      {
        src: "/footprint/stone-mountain-atlanta-03.jpg",
        caption: "Looking out from Stone Mountain.",
        zhCaption: "从 Stone Mountain 望向远方。",
      },
      {
        src: "/footprint/georgia-tech-02.jpg",
        caption: "Table tennis at Georgia Tech.",
        zhCaption: "佐治亚理工里的乒乓球活动。",
      },
      {
        src: "/footprint/georgia-tech-04.jpg",
        caption: "Georgia Tech campus buildings beneath an open sky.",
        zhCaption: "开阔天空下的佐治亚理工校园建筑。",
      },
      {
        src: "/footprint/georgia-tech-05.jpg",
        caption: "Georgia Tech campus framing the Atlanta skyline.",
        zhCaption: "佐治亚理工校园里望向亚特兰大天际线。",
      },
      {
        src: "/footprint/atlanta-hawks-arena-01.jpg",
        caption: "Atlanta Hawks game at State Farm Arena.",
        zhCaption: "亚特兰大老鹰队在 State Farm Arena 的比赛。",
      },
      {
        src: "/footprint/atlanta-world-cup-final-2022-01.jpg",
        caption: "Watching the 2022 World Cup final at an Atlanta bar.",
        zhCaption: "在亚特兰大酒吧看 2022 年世界杯决赛。",
      },
      {
        src: "/footprint/atlanta-sunset-01.jpg",
        caption: "Sunset clouds over Atlanta.",
        zhCaption: "亚特兰大的落日晚霞。",
      },
    ],
  },
  {
    id: "macon",
    name: "Macon",
    zhName: "梅肯",
    country: "USA",
    zhCountry: "美国",
    lat: 32.8407,
    lng: -83.6324,
    note: "Contest memories in central Georgia.",
    zhNote: "佐治亚州中部的比赛记忆。",
    photos: [
      {
        src: "/footprint/macon-01.jpg",
        caption: "Georgia Tech Team 2022 regional contest group photo.",
        zhCaption: "Georgia Tech Team 2022 区域赛合影。",
      },
      {
        src: "/footprint/macon-02.jpg",
        caption: "Downtown Macon street scene.",
        zhCaption: "梅肯市中心街景。",
      },
    ],
  },
  {
    id: "savannah",
    name: "Savannah",
    zhName: "萨凡纳",
    country: "USA",
    zhCountry: "美国",
    lat: 32.0809,
    lng: -81.0912,
    note: "Georgia coast, river light, and marshland.",
    zhNote: "佐治亚海岸、河面光影和湿地。",
    photos: [
      {
        src: "/footprint/savannah-01.jpg",
        caption: "Beach day near Savannah.",
        zhCaption: "萨凡纳附近的海滩。",
      },
      {
        src: "/footprint/savannah-02.jpg",
        caption: "Sunset on the water near Savannah.",
        zhCaption: "萨凡纳水边的日落。",
      },
    ],
  },
  {
    id: "chattanooga",
    name: "Chattanooga",
    zhName: "查塔努加",
    country: "USA",
    zhCountry: "美国",
    lat: 35.0456,
    lng: -85.3097,
    note: "Rock City on Lookout Mountain, treated as the Chattanooga stop.",
    zhNote: "Lookout Mountain 上的 Rock City，按查塔努加这一站记录。",
    photos: [
      {
        src: "/footprint/chattanooga-rock-city-01.jpg",
        caption: "Clouds over the valley from Rock City.",
        zhCaption: "从 Rock City 望向云海和山谷。",
      },
      {
        src: "/footprint/chattanooga-rock-city-02.jpg",
        caption: "Rock City cliffs and valley views.",
        zhCaption: "Rock City 的峭壁与山谷视野。",
      },
      {
        src: "/footprint/chattanooga-rock-city-03.jpg",
        caption: "Lover's Leap waterfall at Rock City.",
        zhCaption: "Rock City 的 Lover's Leap 瀑布。",
      },
    ],
  },
  {
    id: "gatlinburg",
    name: "Gatlinburg",
    zhName: "盖特林堡",
    country: "USA",
    zhCountry: "美国",
    lat: 35.7143,
    lng: -83.5102,
    note: "Gateway to the Great Smoky Mountains.",
    zhNote: "通往大烟山的门户小城。",
    photos: [
      {
        src: "/footprint/smoky-mountains-01.jpg",
        caption: "Clouds rolling across the Smoky Mountains.",
        zhCaption: "大烟山间翻涌的云。",
      },
      {
        src: "/footprint/smoky-mountains-02.jpg",
        caption: "Sunset above the Smoky Mountains.",
        zhCaption: "大烟山上的日落。",
      },
      {
        src: "/footprint/smoky-mountains-03.jpg",
        caption: "Evening sky over the Smoky Mountains.",
        zhCaption: "大烟山的傍晚天空。",
      },
    ],
  },
  {
    id: "orlando",
    name: "Orlando",
    zhName: "奥兰多",
    country: "USA",
    zhCountry: "美国",
    lat: 28.5383,
    lng: -81.3792,
    note: "University of Central Florida, Kennedy Space Center, Walt Disney World, and Universal Epic Universe.",
    zhNote: "中佛罗里达大学、肯尼迪航天中心、迪士尼世界与 Universal Epic Universe。",
    photos: [
      {
        src: "/footprint/orlando-ucf-01.jpg",
        caption: "University of Central Florida campus buildings.",
        zhCaption: "中佛罗里达大学校园建筑。",
      },
      {
        src: "/footprint/orlando-ucf-02.jpg",
        caption: "Lakeside sky near UCF.",
        zhCaption: "UCF 附近湖边的阴云。",
      },
      {
        src: "/footprint/orlando-ksc-01.jpg",
        caption: "Rocket Garden at Kennedy Space Center Visitor Complex.",
        zhCaption: "肯尼迪航天中心游客中心的火箭花园。",
      },
      {
        src: "/footprint/orlando-ksc-02.jpg",
        caption: "Saturn V rocket inside the Apollo/Saturn V Center at Kennedy Space Center.",
        zhCaption: "肯尼迪航天中心 Apollo/Saturn V Center 内的土星五号火箭。",
      },
      {
        src: "/footprint/orlando-ksc-atlantis-01.jpg",
        caption: "Space Shuttle Atlantis at Kennedy Space Center Visitor Complex.",
        zhCaption: "肯尼迪航天中心游客中心的亚特兰蒂斯号航天飞机。",
      },
      {
        src: "/footprint/orlando-01.jpg",
        caption: "Cinderella Castle at Walt Disney World.",
        zhCaption: "奥兰多迪士尼世界的灰姑娘城堡。",
      },
      {
        src: "/footprint/orlando-02.jpg",
        caption: "Partners statue and Cinderella Castle at Magic Kingdom.",
        zhCaption: "Magic Kingdom 的 Partners 雕像与灰姑娘城堡。",
      },
      {
        src: "/footprint/orlando-03.jpg",
        caption: "Chronos portal at Universal Epic Universe.",
        zhCaption: "Universal Epic Universe 的 Chronos 入口。",
      },
    ],
  },
  {
    id: "boston",
    name: "Boston",
    zhName: "波士顿",
    country: "USA",
    zhCountry: "美国",
    lat: 42.3601,
    lng: -71.0589,
    note: "Harbor skyline, city hall, and historic downtown landmarks.",
    zhNote: "海港天际线、市政厅与历史城区地标。",
    photos: [
      {
        src: "/footprint/boston-01.jpg",
        caption: "Boston harbor skyline under gray clouds.",
        zhCaption: "阴天里的波士顿海港天际线。",
      },
      {
        src: "/footprint/boston-02.jpg",
        caption: "Old City Hall facade and spring branches.",
        zhCaption: "春枝掩映下的波士顿旧市政厅立面。",
      },
      {
        src: "/footprint/boston-03.jpg",
        caption: "Old South Meeting House clock tower.",
        zhCaption: "波士顿 Old South Meeting House 的钟楼。",
      },
      {
        src: "/footprint/boston-04.jpg",
        caption: "Samuel Adams statue and Faneuil Hall.",
        zhCaption: "Samuel Adams 雕像与 Faneuil Hall。",
      },
      {
        src: "/footprint/boston-05.jpg",
        caption: "Old State House among downtown towers.",
        zhCaption: "高楼之间的 Old State House。",
      },
      {
        src: "/footprint/boston-06.jpg",
        caption: "Boston City Hall and downtown towers.",
        zhCaption: "波士顿市政厅与市中心高楼。",
      },
    ],
  },
  {
    id: "cambridge",
    name: "Cambridge",
    zhName: "剑桥",
    country: "USA",
    zhCountry: "美国",
    lat: 42.3736,
    lng: -71.1097,
    note: "MIT campus and Charles River skyline walks.",
    zhNote: "MIT 校园与查尔斯河畔天际线漫步。",
    photos: [
      {
        src: "/footprint/cambridge-01.jpg",
        caption: "MIT Great Dome framed by spring trees.",
        zhCaption: "春树框住的 MIT Great Dome。",
      },
      {
        src: "/footprint/cambridge-02.jpg",
        caption: "MIT Building 10 and Killian Court in afternoon light.",
        zhCaption: "下午光线里的 MIT Building 10 与 Killian Court。",
      },
      {
        src: "/footprint/cambridge-03.jpg",
        caption: "Stata Center's angular facade.",
        zhCaption: "Stata Center 错落的几何立面。",
      },
      {
        src: "/footprint/cambridge-04.jpg",
        caption: "Ray and Maria Stata Center sign and campus bikes.",
        zhCaption: "Ray and Maria Stata Center 标识与校园自行车。",
      },
      {
        src: "/footprint/cambridge-05.jpg",
        caption: "Boston skyline across the Charles River.",
        zhCaption: "查尔斯河对岸的波士顿天际线。",
      },
      {
        src: "/footprint/cambridge-06.jpg",
        caption: "Boats and Boston skyline across the Charles River.",
        zhCaption: "船坞与查尔斯河对岸的波士顿天际线。",
      },
    ],
  },
  {
    id: "salt-lake-city",
    name: "Salt Lake City",
    zhName: "盐湖城",
    country: "USA",
    zhCountry: "美国",
    lat: 40.7608,
    lng: -111.891,
    note: "Airport mountains, city stops, and Wasatch light.",
    zhNote: "机场远山、城市停靠与瓦萨奇山光影。",
    photos: [
      {
        src: "/footprint/salt-lake-city-01.jpg",
        caption: "KFC storefront in Salt Lake City evening light.",
        zhCaption: "盐湖城傍晚灯光里的 KFC 店面。",
      },
      {
        src: "/footprint/salt-lake-city-02.jpg",
        caption: "Salt Lake City airport curbside with snowy mountains.",
        zhCaption: "盐湖城机场路边与远处雪山。",
      },
      {
        src: "/footprint/salt-lake-city-03.jpg",
        caption: "Sunset rays over the Wasatch Front from the road.",
        zhCaption: "路上望见瓦萨奇山前的落日光束。",
      },
    ],
  },
  {
    id: "rapid-city",
    name: "Rapid City",
    zhName: "拉皮德城",
    country: "USA",
    zhCountry: "美国",
    lat: 44.0805,
    lng: -103.231,
    note: "Mount Rushmore, Black Hills roads, and downtown lights.",
    zhNote: "拉什莫尔山、黑山路途与市区夜灯。",
    photos: [
      {
        src: "/footprint/rapid-city-01.jpg",
        caption: "Mount Rushmore at dusk.",
        zhCaption: "暮色中的 Mount Rushmore。",
      },
      {
        src: "/footprint/rapid-city-02.jpg",
        caption: "Mount Rushmore from the amphitheater.",
        zhCaption: "从露天剧场望向 Mount Rushmore。",
      },
      {
        src: "/footprint/rapid-city-03.jpg",
        caption: "Rapid City downtown lights at night.",
        zhCaption: "Rapid City 夜晚的市区灯光。",
      },
    ],
  },
  {
    id: "interior",
    name: "Interior",
    zhName: "因蒂里厄",
    country: "USA",
    zhCountry: "美国",
    lat: 43.725,
    lng: -101.9849,
    note: "Badlands National Park ridges, canyons, and wide plains.",
    zhNote: "Badlands National Park 的山脊、峡谷与开阔荒原。",
    photos: [
      {
        src: "/footprint/interior-01.jpg",
        caption: "Badlands formations under blue sky.",
        zhCaption: "蓝天下的 Badlands 地貌。",
      },
      {
        src: "/footprint/interior-02.jpg",
        caption: "Layered Badlands ridges and open sky.",
        zhCaption: "Badlands 层叠山脊与开阔天空。",
      },
      {
        src: "/footprint/interior-03.jpg",
        caption: "Close view of Badlands eroded cliffs.",
        zhCaption: "Badlands 被风蚀的崖壁近景。",
      },
      {
        src: "/footprint/interior-04.jpg",
        caption: "Sunlit Badlands slopes and white clouds.",
        zhCaption: "阳光下的 Badlands 坡面与白云。",
      },
    ],
  },
  {
    id: "albuquerque",
    name: "Albuquerque",
    zhName: "阿尔伯克基",
    country: "USA",
    zhCountry: "美国",
    lat: 35.0844,
    lng: -106.6504,
    note: "Old Town plazas, Sandia Peak, and high-desert evenings.",
    zhNote: "Old Town 广场、Sandia Peak 与高沙漠傍晚。",
    photos: [
      {
        src: "/footprint/albuquerque-01.jpg",
        caption: "Old Town Albuquerque at night.",
        zhCaption: "夜晚的 Old Town Albuquerque。",
      },
      {
        src: "/footprint/albuquerque-02.jpg",
        caption: "San Felipe de Neri Church in Old Town.",
        zhCaption: "Old Town 的 San Felipe de Neri Church。",
      },
      {
        src: "/footprint/albuquerque-03.jpg",
        caption: "Snowy overlook from Sandia Peak.",
        zhCaption: "Sandia Peak 上的雪地远眺。",
      },
      {
        src: "/footprint/albuquerque-04.jpg",
        caption: "Sandia Peak Tramway at sunset.",
        zhCaption: "日落时的 Sandia Peak Tramway。",
      },
    ],
  },
  {
    id: "los-alamos",
    name: "Los Alamos",
    zhName: "洛斯阿拉莫斯",
    country: "USA",
    zhCountry: "美国",
    lat: 35.88,
    lng: -106.3031,
    note: "Manhattan Project history and quiet mesa buildings.",
    zhNote: "曼哈顿计划历史与高原小镇建筑。",
    photos: [
      {
        src: "/footprint/los-alamos-01.jpg",
        caption: "Los Alamos Project Main Gate sign.",
        zhCaption: "Los Alamos Project Main Gate 标志。",
      },
      {
        src: "/footprint/los-alamos-02.jpg",
        caption: "Historic statues in Los Alamos.",
        zhCaption: "Los Alamos 的历史人物雕像。",
      },
      {
        src: "/footprint/los-alamos-03.jpg",
        caption: "Historic lodge building in Los Alamos.",
        zhCaption: "Los Alamos 的历史木屋建筑。",
      },
      {
        src: "/footprint/los-alamos-04.jpg",
        caption: "Shaded historic house in Los Alamos.",
        zhCaption: "树影下的 Los Alamos 历史建筑。",
      },
      {
        src: "/footprint/los-alamos-05.jpg",
        caption: "Manhattan Project history building in Los Alamos.",
        zhCaption: "Los Alamos 的曼哈顿计划历史建筑。",
      },
    ],
  },
  {
    id: "santa-fe",
    name: "Santa Fe",
    zhName: "圣菲",
    country: "USA",
    zhCountry: "美国",
    lat: 35.687,
    lng: -105.9378,
    note: "Adobe streets, cathedral lights, and winter evenings.",
    zhNote: "土坯街巷、教堂灯光与冬日夜色。",
    photos: [
      {
        src: "/footprint/santa-fe-01.jpg",
        caption: "Cathedral Basilica of St. Francis of Assisi at night.",
        zhCaption: "夜色里的 Cathedral Basilica of St. Francis of Assisi。",
      },
      {
        src: "/footprint/santa-fe-02.jpg",
        caption: "New Year's Eve lights in downtown Santa Fe.",
        zhCaption: "Santa Fe 市中心的跨年灯光。",
      },
    ],
  },
  {
    id: "mosca",
    name: "Mosca",
    zhName: "莫斯卡",
    country: "USA",
    zhCountry: "美国",
    lat: 37.6494,
    lng: -105.8739,
    note: "Great Sand Dunes and the Sangre de Cristo mountains.",
    zhNote: "大沙丘国家公园与 Sangre de Cristo 山脉。",
    photos: [
      {
        src: "/footprint/mosca-01.jpg",
        caption: "Great Sand Dunes under clear sky.",
        zhCaption: "晴空下的大沙丘。",
      },
      {
        src: "/footprint/mosca-02.jpg",
        caption: "Great Sand Dunes with snowy mountains behind.",
        zhCaption: "雪山映衬下的大沙丘。",
      },
    ],
  },
  {
    id: "jackson",
    name: "Jackson",
    zhName: "杰克逊",
    country: "USA",
    zhCountry: "美国",
    lat: 43.4799,
    lng: -110.7624,
    note: "Alpine, Jackson, and Grand Teton road-trip views.",
    zhNote: "阿尔派、杰克逊与大蒂顿一线的自驾风景。",
    photos: [
      {
        src: "/footprint/jackson-01.jpg",
        caption: "Mountain light near Alpine.",
        zhCaption: "阿尔派附近的山间云光。",
      },
      {
        src: "/footprint/jackson-02.jpg",
        caption: "Wooden storefronts in Jackson.",
        zhCaption: "杰克逊街头的木质店铺。",
      },
      {
        src: "/footprint/jackson-03.jpg",
        caption: "Elk antler arch in Jackson town square.",
        zhCaption: "杰克逊镇广场的鹿角拱门。",
      },
      {
        src: "/footprint/jackson-04.jpg",
        caption: "Spring trees and a Grand Teton memorial.",
        zhCaption: "春树下的大蒂顿纪念碑。",
      },
      {
        src: "/footprint/jackson-05.jpg",
        caption: "Grand Teton peaks above the lake.",
        zhCaption: "湖面上方的大蒂顿群峰。",
      },
      {
        src: "/footprint/jackson-06.jpg",
        caption: "Lakeshore light near Grand Teton.",
        zhCaption: "大蒂顿湖岸边的开阔天光。",
      },
    ],
  },
  {
    id: "west-yellowstone",
    name: "Yellowstone",
    zhName: "黄石",
    country: "USA",
    zhCountry: "美国",
    lat: 44.6621,
    lng: -111.1041,
    note: "Yellowstone geysers, hot springs, canyon, lakes, and wildlife.",
    zhNote: "黄石的间歇泉、温泉、峡谷、湖水与野生动物。",
    photos: [
      {
        src: "/footprint/west-yellowstone-01.jpg",
        caption: "Blue sky over Yellowstone forest.",
        zhCaption: "黄石森林上方的蓝天白云。",
      },
      {
        src: "/footprint/west-yellowstone-02.jpg",
        caption: "Mist rising from a Yellowstone hot spring.",
        zhCaption: "黄石热泉升起的蒸汽。",
      },
      {
        src: "/footprint/west-yellowstone-03.jpg",
        caption: "Steam plume across a Yellowstone basin.",
        zhCaption: "黄石热泉盆地中的蒸汽柱。",
      },
      {
        src: "/footprint/west-yellowstone-04.jpg",
        caption: "Blue Star Spring and the geyser basin.",
        zhCaption: "Blue Star Spring 与间歇泉盆地。",
      },
      {
        src: "/footprint/west-yellowstone-05.jpg",
        caption: "Colorful hot spring pool in Yellowstone.",
        zhCaption: "黄石色彩浓烈的热泉池。",
      },
      {
        src: "/footprint/west-yellowstone-06.jpg",
        caption: "Steam and river bends in Yellowstone.",
        zhCaption: "黄石河湾与升腾的水汽。",
      },
      {
        src: "/footprint/west-yellowstone-07.jpg",
        caption: "Open Yellowstone basin under layered clouds.",
        zhCaption: "层云下开阔的黄石热泉盆地。",
      },
      {
        src: "/footprint/west-yellowstone-08.jpg",
        caption: "Yellowstone Canyon and the river below.",
        zhCaption: "黄石峡谷与谷底河流。",
      },
      {
        src: "/footprint/west-yellowstone-09.jpg",
        caption: "Pale canyon walls at Yellowstone.",
        zhCaption: "黄石峡谷浅色岩壁。",
      },
      {
        src: "/footprint/west-yellowstone-10.jpg",
        caption: "Calm Yellowstone lake under cloud banks.",
        zhCaption: "云层下平静的黄石湖。",
      },
      {
        src: "/footprint/west-yellowstone-11.jpg",
        caption: "Sunset over Yellowstone lake and distant ridges.",
        zhCaption: "黄石湖与远山上的夕阳。",
      },
      {
        src: "/footprint/west-yellowstone-12.jpg",
        caption: "Cistern Spring steaming through the trees.",
        zhCaption: "林间蒸汽缭绕的 Cistern Spring。",
      },
      {
        src: "/footprint/west-yellowstone-13.jpg",
        caption: "Thermal pool and forest reflections in Yellowstone.",
        zhCaption: "黄石热泉池与森林倒影。",
      },
      {
        src: "/footprint/west-yellowstone-14.jpg",
        caption: "Steam drifting across a Yellowstone basin.",
        zhCaption: "蒸汽掠过黄石热泉盆地。",
      },
      {
        src: "/footprint/west-yellowstone-15.jpg",
        caption: "Wide valley view on the Yellowstone road.",
        zhCaption: "黄石路上的宽阔山谷视野。",
      },
      {
        src: "/footprint/west-yellowstone-16.jpg",
        caption: "Bison grazing near Yellowstone.",
        zhCaption: "黄石附近草地上的野牛。",
      },
      {
        src: "/footprint/west-yellowstone-17.jpg",
        caption: "Roosevelt Arch at Yellowstone's north entrance.",
        zhCaption: "黄石北入口的 Roosevelt Arch。",
      },
    ],
  },
  {
    id: "bryce-canyon-city",
    name: "Bryce Canyon City",
    zhName: "布莱斯峡谷城",
    country: "USA",
    zhCountry: "美国",
    lat: 37.6736,
    lng: -112.1569,
    note: "Bryce Canyon hoodoos and orange amphitheater light.",
    zhNote: "布莱斯峡谷的石林与橙色圆形剧场光影。",
    photos: [
      {
        src: "/footprint/bryce-canyon-city-01.jpg",
        caption: "Bryce Canyon hoodoos glowing under evening clouds.",
        zhCaption: "傍晚云层下发亮的布莱斯峡谷石林。",
      },
      {
        src: "/footprint/bryce-canyon-city-02.jpg",
        caption: "Bryce Canyon amphitheater under blue sky.",
        zhCaption: "蓝天下的布莱斯峡谷圆形剧场。",
      },
      {
        src: "/footprint/bryce-canyon-city-03.jpg",
        caption: "Hiking between Bryce Canyon hoodoos.",
        zhCaption: "在布莱斯峡谷石林间徒步。",
      },
      {
        src: "/footprint/bryce-canyon-city-04.jpg",
        caption: "Layered Bryce Canyon hoodoos and open sky.",
        zhCaption: "布莱斯峡谷层叠石林与开阔天空。",
      },
    ],
  },
  {
    id: "springdale",
    name: "Springdale",
    zhName: "斯普林代尔",
    country: "USA",
    zhCountry: "美国",
    lat: 37.1889,
    lng: -112.9986,
    note: "Gateway to Zion National Park and canyon overlooks.",
    zhNote: "通往 Zion 国家公园与峡谷观景点的小镇。",
    photos: [
      {
        src: "/footprint/springdale-01.jpg",
        caption: "Zion canyon walls above a green valley.",
        zhCaption: "Zion 峡谷岩壁俯瞰绿色山谷。",
      },
      {
        src: "/footprint/springdale-02.jpg",
        caption: "Zion sandstone walls and pines.",
        zhCaption: "Zion 的砂岩峭壁与松树。",
      },
      {
        src: "/footprint/springdale-03.jpg",
        caption: "Water and canyon walls on the Zion road.",
        zhCaption: "Zion 路上的水面与峡谷岩壁。",
      },
      {
        src: "/footprint/springdale-04.jpg",
        caption: "Zion Canyon overlook and winding road below.",
        zhCaption: "Zion Canyon 观景点与下方蜿蜒道路。",
      },
    ],
  },
  {
    id: "page",
    name: "Page",
    zhName: "佩吉",
    country: "USA",
    zhCountry: "美国",
    lat: 36.9147,
    lng: -111.4558,
    note: "Glen Canyon Dam, Antelope Canyon, and Horseshoe Bend.",
    zhNote: "Glen Canyon 大坝、羚羊谷与马蹄湾。",
    photos: [
      {
        src: "/footprint/page-01.jpg",
        caption: "Glen Canyon Dam between red rock walls.",
        zhCaption: "红岩之间的 Glen Canyon 大坝。",
      },
      {
        src: "/footprint/page-02.jpg",
        caption: "Glen Canyon Dam concrete face and lake view.",
        zhCaption: "Glen Canyon 大坝坝面与湖水。",
      },
      {
        src: "/footprint/page-03.jpg",
        caption: "Light pouring into Antelope Canyon.",
        zhCaption: "光线洒入羚羊谷。",
      },
      {
        src: "/footprint/page-04.jpg",
        caption: "Sculpted sandstone walls in Antelope Canyon.",
        zhCaption: "羚羊谷中被风水雕刻的砂岩壁。",
      },
      {
        src: "/footprint/page-05.jpg",
        caption: "Warm Antelope Canyon curves and blue sky.",
        zhCaption: "羚羊谷的暖色曲线与蓝天。",
      },
      {
        src: "/footprint/page-06.jpg",
        caption: "Sunbeam inside Antelope Canyon.",
        zhCaption: "羚羊谷里的光束。",
      },
      {
        src: "/footprint/page-07.jpg",
        caption: "Falling sand in Antelope Canyon.",
        zhCaption: "羚羊谷中倾泻而下的细沙。",
      },
      {
        src: "/footprint/page-08.jpg",
        caption: "Horseshoe Bend and the Colorado River.",
        zhCaption: "马蹄湾与科罗拉多河。",
      },
    ],
  },
  {
    id: "williams",
    name: "Williams",
    zhName: "威廉姆斯",
    country: "USA",
    zhCountry: "美国",
    lat: 35.2495,
    lng: -112.191,
    note: "Route 66 stop on the way to the Grand Canyon.",
    zhNote: "前往大峡谷路上的 66 号公路小镇。",
    photos: [
      {
        src: "/footprint/williams-01.jpg",
        caption: "Route 66 classic car in Williams.",
        zhCaption: "威廉姆斯 66 号公路旁的复古车。",
      },
    ],
  },
  {
    id: "grand-canyon-village",
    name: "Grand Canyon Village",
    zhName: "大峡谷村",
    country: "USA",
    zhCountry: "美国",
    lat: 36.0544,
    lng: -112.1401,
    note: "South Rim overlooks and Colorado River views.",
    zhNote: "南缘观景点与科罗拉多河视野。",
    photos: [
      {
        src: "/footprint/grand-canyon-village-01.jpg",
        caption: "Colorado River carving through the Grand Canyon.",
        zhCaption: "科罗拉多河切过大峡谷。",
      },
      {
        src: "/footprint/grand-canyon-village-02.jpg",
        caption: "Grand Canyon South Rim under deep blue sky.",
        zhCaption: "深蓝天空下的大峡谷南缘。",
      },
      {
        src: "/footprint/grand-canyon-village-03.jpg",
        caption: "Wide Grand Canyon view with a cloud ribbon.",
        zhCaption: "云带下的大峡谷广阔视野。",
      },
    ],
  },
  {
    id: "boulder-city",
    name: "Boulder City",
    zhName: "博尔德城",
    country: "USA",
    zhCountry: "美国",
    lat: 35.9786,
    lng: -114.8325,
    note: "Hoover Dam and Lake Mead desert light.",
    zhNote: "胡佛水坝与 Lake Mead 的荒漠光线。",
    photos: [
      {
        src: "/footprint/boulder-city-01.jpg",
        caption: "Lake Mead and desert hills near Hoover Dam.",
        zhCaption: "胡佛水坝附近的 Lake Mead 与荒漠山丘。",
      },
      {
        src: "/footprint/boulder-city-02.jpg",
        caption: "Hoover Dam towers at sunset.",
        zhCaption: "夕阳下的胡佛水坝塔楼。",
      },
    ],
  },
  {
    id: "las-vegas",
    name: "Las Vegas",
    zhName: "拉斯维加斯",
    country: "USA",
    zhCountry: "美国",
    lat: 36.1716,
    lng: -115.1391,
    note: "The Strip, themed hotels, and Sphere nights.",
    zhNote: "拉斯维加斯大道、主题酒店与 Sphere 夜景。",
    photos: [
      {
        src: "/footprint/las-vegas-01.jpg",
        caption: "Mandalay Bay under clear sky.",
        zhCaption: "晴空下的 Mandalay Bay。",
      },
      {
        src: "/footprint/las-vegas-02.jpg",
        caption: "New York-New York and the Strip skyline.",
        zhCaption: "New York-New York 与拉斯维加斯大道天际线。",
      },
      {
        src: "/footprint/las-vegas-03.jpg",
        caption: "Paris Las Vegas and its balloon sign.",
        zhCaption: "Paris Las Vegas 与热气球招牌。",
      },
      {
        src: "/footprint/las-vegas-04.jpg",
        caption: "The Sphere glowing at night.",
        zhCaption: "夜色里亮起的 Sphere。",
      },
      {
        src: "/footprint/las-vegas-05.jpg",
        caption: "The Venetian towers and Grand Canal Shoppes.",
        zhCaption: "The Venetian 的塔楼与 Grand Canal Shoppes。",
      },
    ],
  },
  {
    id: "pittsburgh",
    name: "Pittsburgh",
    zhName: "匹兹堡",
    country: "USA",
    zhCountry: "美国",
    lat: 40.4406,
    lng: -79.9959,
    note: "CMU, the rivers, and skyline views.",
    zhNote: "CMU、河流与城市天际线。",
    photos: [
      {
        src: "/footprint/pittsburgh-cmu-01.jpg",
        caption: "The Fence at Carnegie Mellon University.",
        zhCaption: "卡内基梅隆大学的 The Fence。",
      },
      {
        src: "/footprint/pittsburgh-01.jpg",
        caption: "Pittsburgh skyline and river from an overlook.",
        zhCaption: "从高处望向匹兹堡天际线与河流。",
      },
      {
        src: "/footprint/pittsburgh-02.jpg",
        caption: "Downtown Pittsburgh and its bridges.",
        zhCaption: "匹兹堡市中心与桥梁。",
      },
      {
        src: "/footprint/pittsburgh-03.jpg",
        caption: "Pittsburgh skyline under summer clouds.",
        zhCaption: "夏日云朵下的匹兹堡天际线。",
      },
      {
        src: "/footprint/pittsburgh-04.jpg",
        caption: "Pittsburgh bridges and river bends.",
        zhCaption: "匹兹堡的桥梁与河湾。",
      },
      {
        src: "/footprint/pittsburgh-05.jpg",
        caption: "Pittsburgh skyline and layered clouds.",
        zhCaption: "云层下的匹兹堡天际线。",
      },
      {
        src: "/footprint/pittsburgh-06.jpg",
        caption: "Dinosaur outside the Carnegie museums.",
        zhCaption: "卡内基博物馆外的恐龙雕塑。",
      },
      {
        src: "/footprint/pittsburgh-07.jpg",
        caption: "Pittsburgh residential street.",
        zhCaption: "匹兹堡住宅街道。",
      },
      {
        src: "/footprint/pittsburgh-08.jpg",
        caption: "Pittsburgh streetcar passing through the neighborhood.",
        zhCaption: "穿过匹兹堡街区的有轨电车。",
      },
    ],
  },
  {
    id: "oahu",
    name: "Oahu",
    zhName: "欧胡岛",
    country: "USA",
    zhCountry: "美国",
    lat: 21.4389,
    lng: -158.0001,
    note: "Island skies, sea, and fireworks.",
    zhNote: "岛上的天空、海与烟火。",
    photos: [
      {
        src: "/footprint/oahu-01.jpg",
        caption: "Fireworks over the water.",
        zhCaption: "海面上的烟火。",
      },
      {
        src: "/footprint/oahu-02.jpg",
        caption: "Oahu cliffs in daylight.",
        zhCaption: "日光下的欧胡岛山崖。",
      },
      {
        src: "/footprint/oahu-03.jpg",
        caption: "Sunset near the airport.",
        zhCaption: "机场附近的晚霞。",
      },
    ],
  },
  {
    id: "big-island",
    name: "Big Island",
    zhName: "大岛",
    country: "USA",
    zhCountry: "美国",
    lat: 19.5429,
    lng: -155.6659,
    note: "Ocean light and high-altitude sky.",
    zhNote: "海上的光与高处的天空。",
    photos: [
      {
        src: "/footprint/big-island-01.jpg",
        caption: "Sunset over the ocean.",
        zhCaption: "海上的落日。",
      },
      {
        src: "/footprint/big-island-02.jpg",
        caption: "Waves on the Big Island.",
        zhCaption: "大岛海岸的浪。",
      },
      {
        src: "/footprint/big-island-03.jpg",
        caption: "Above the clouds.",
        zhCaption: "云海之上。",
      },
    ],
  },
  {
    id: "miami",
    name: "Miami",
    zhName: "迈阿密",
    country: "USA",
    zhCountry: "美国",
    lat: 25.7617,
    lng: -80.1918,
    note: "Florida beaches and open wetland skies.",
    zhNote: "佛罗里达海滩与开阔湿地天空。",
    photos: [
      {
        src: "/footprint/miami-01.jpg",
        caption: "Miami beach under a clear sky.",
        zhCaption: "晴空下的迈阿密海滩。",
      },
      {
        src: "/footprint/miami-02.jpg",
        caption: "Wetland sky near Miami.",
        zhCaption: "迈阿密附近湿地的天空。",
      },
      {
        src: "/footprint/miami-03.jpg",
        caption: "Miami skyline beyond the golf course.",
        zhCaption: "高尔夫球场远处的迈阿密天际线。",
      },
      {
        src: "/footprint/miami-04.jpg",
        caption: "Crowds outside Hard Rock Stadium before the Copa America final.",
        zhCaption: "美洲杯决赛前 Hard Rock Stadium 外的人群。",
      },
      {
        src: "/footprint/miami-05.jpg",
        caption: "Pre-match view inside Hard Rock Stadium.",
        zhCaption: "Hard Rock Stadium 内的赛前视野。",
      },
      {
        src: "/footprint/miami-06.jpg",
        caption: "Fans entering Hard Rock Stadium for the final.",
        zhCaption: "球迷进入 Hard Rock Stadium 观看决赛。",
      },
      {
        src: "/footprint/miami-07.jpg",
        caption: "Full stands at the Copa America final.",
        zhCaption: "美洲杯决赛满场的看台。",
      },
      {
        src: "/footprint/miami-08.jpg",
        caption: "Argentina and Colombia flags before kickoff at the final.",
        zhCaption: "决赛开球前的阿根廷与哥伦比亚国旗。",
      },
    ],
  },
  {
    id: "davis",
    name: "Davis",
    zhName: "戴维斯",
    country: "USA",
    zhCountry: "美国",
    lat: 38.5449,
    lng: -121.7405,
    note: "UC Davis campus paths, bike roads, public art, and quiet town corners.",
    zhNote: "UC Davis 校园小路、自行车道、公共艺术与安静小城角落。",
    photos: [
      {
        src: "/footprint/davis-01.jpg",
        caption: "Memorial Union at UC Davis.",
        zhCaption: "UC Davis 的 Memorial Union。",
      },
      {
        src: "/footprint/davis-02.jpg",
        caption: "Bike lane through the UC Davis campus.",
        zhCaption: "UC Davis 校园里的自行车道。",
      },
      {
        src: "/footprint/davis-03.jpg",
        caption: "Campus building and winter trees at UC Davis.",
        zhCaption: "UC Davis 的校园建筑与冬日树影。",
      },
      {
        src: "/footprint/davis-04.jpg",
        caption: "Bare tree and evening sky in Davis.",
        zhCaption: "Davis 傍晚天空下的树影。",
      },
      {
        src: "/footprint/davis-05.jpg",
        caption: "Public art on a Davis street.",
        zhCaption: "Davis 街边的公共艺术。",
      },
      {
        src: "/footprint/davis-06.jpg",
        caption: "Historic City Hall in Davis.",
        zhCaption: "Davis 的历史市政厅。",
      },
    ],
  },
  {
    id: "sacramento",
    name: "Sacramento",
    zhName: "萨克拉门托",
    country: "USA",
    zhCountry: "美国",
    lat: 38.5816,
    lng: -121.4944,
    note: "Old Sacramento, the Capitol, civic streets, and Kings basketball nights.",
    zhNote: "Old Sacramento、州议会大厦、市区街景与 Kings 篮球夜。",
    photos: [
      {
        src: "/footprint/sacramento-01.jpg",
        caption: "Old Sacramento storefronts and railroad signs.",
        zhCaption: "Old Sacramento 的老街店面与铁路招牌。",
      },
      {
        src: "/footprint/sacramento-02.jpg",
        caption: "Vintage rail cars in Old Sacramento.",
        zhCaption: "Old Sacramento 的复古火车车厢。",
      },
      {
        src: "/footprint/sacramento-03.jpg",
        caption: "California State Capitol in Sacramento.",
        zhCaption: "Sacramento 的 California State Capitol。",
      },
      {
        src: "/footprint/sacramento-04.jpg",
        caption: "Capitol dome interior in Sacramento.",
        zhCaption: "Sacramento 州议会大厦内的穹顶。",
      },
      {
        src: "/footprint/sacramento-05.jpg",
        caption: "Brick civic building in Sacramento.",
        zhCaption: "Sacramento 的砖墙市政建筑。",
      },
      {
        src: "/footprint/sacramento-06.jpg",
        caption: "Warm-colored homes on a Sacramento street.",
        zhCaption: "Sacramento 街边暖色的住宅。",
      },
      {
        src: "/footprint/sacramento-07.jpg",
        caption: "Sutter's Fort grounds in Sacramento.",
        zhCaption: "Sacramento 的 Sutter's Fort 场地。",
      },
      {
        src: "/footprint/sacramento-08.jpg",
        caption: "Golden 1 Center before a Kings game.",
        zhCaption: "Kings 比赛前的 Golden 1 Center。",
      },
      {
        src: "/footprint/sacramento-09.jpg",
        caption: "Sacramento Kings game at Golden 1 Center.",
        zhCaption: "Golden 1 Center 里的 Sacramento Kings 比赛。",
      },
    ],
  },
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    zhName: "太浩湖",
    country: "USA",
    zhCountry: "美国",
    lat: 39.0968,
    lng: -120.0324,
    note: "Snow, lake fog, clear water, and winter mountain light.",
    zhNote: "积雪、湖雾、清澈湖水与冬日山光。",
    photos: [
      {
        src: "/footprint/lake-tahoe-01.jpg",
        caption: "Snow and morning fog over Lake Tahoe.",
        zhCaption: "Lake Tahoe 上的积雪与晨雾。",
      },
      {
        src: "/footprint/lake-tahoe-02.jpg",
        caption: "Calm winter water beside a snowy pier.",
        zhCaption: "雪中码头旁平静的冬日湖面。",
      },
      {
        src: "/footprint/lake-tahoe-03.jpg",
        caption: "Lake Tahoe pier and distant mountains.",
        zhCaption: "Lake Tahoe 的码头与远山。",
      },
      {
        src: "/footprint/lake-tahoe-04.jpg",
        caption: "Blue morning water and low fog at Lake Tahoe.",
        zhCaption: "Lake Tahoe 的蓝色晨湖与低雾。",
      },
      {
        src: "/footprint/lake-tahoe-05.jpg",
        caption: "Snow around a Lake Tahoe lodge.",
        zhCaption: "Lake Tahoe 旅馆周围的积雪。",
      },
      {
        src: "/footprint/lake-tahoe-06.jpg",
        caption: "Long pier and winter mountains at Lake Tahoe.",
        zhCaption: "Lake Tahoe 的长码头与冬日远山。",
      },
    ],
  },
  {
    id: "half-moon-bay",
    name: "Half Moon Bay",
    zhName: "半月湾",
    country: "USA",
    zhCountry: "美国",
    lat: 37.4636,
    lng: -122.4286,
    note: "Pacific beach and coastal light.",
    zhNote: "太平洋海滩与海岸天光。",
    photos: [
      {
        src: "/footprint/half-moon-bay-01.jpg",
        caption: "Beach surf at Half Moon Bay.",
        zhCaption: "Half Moon Bay 海滩上的浪。",
      },
    ],
  },
  {
    id: "davenport",
    name: "Davenport",
    zhName: "达文波特",
    country: "USA",
    zhCountry: "美国",
    lat: 37.0116,
    lng: -122.1944,
    note: "Shark Fin Cove cliffs and quiet ocean light.",
    zhNote: "Shark Fin Cove 的海蚀崖与安静海光。",
    photos: [
      {
        src: "/footprint/davenport-01.jpg",
        caption: "Shark Fin Cove below the Davenport cliffs.",
        zhCaption: "Davenport 附近的 Shark Fin Cove。",
      },
    ],
  },
  {
    id: "monterey",
    name: "Monterey",
    zhName: "蒙特雷",
    country: "USA",
    zhCountry: "美国",
    lat: 36.6002,
    lng: -121.8947,
    note: "Cannery Row, aquarium walls, and bay air.",
    zhNote: "Cannery Row、水族馆墙面与海湾空气。",
    photos: [
      {
        src: "/footprint/monterey-01.jpg",
        caption: "Monterey Bay Aquarium on Cannery Row.",
        zhCaption: "Cannery Row 上的 Monterey Bay Aquarium。",
      },
    ],
  },
  {
    id: "carmel-by-the-sea",
    name: "Carmel-by-the-Sea",
    zhName: "卡梅尔海",
    country: "USA",
    zhCountry: "美国",
    lat: 36.5552,
    lng: -121.9233,
    note: "Storybook cottages and Big Sur coastal drives.",
    zhNote: "童话小屋与 Big Sur 海岸公路。",
    photos: [
      {
        src: "/footprint/carmel-by-the-sea-01.jpg",
        caption: "Bixby Creek Bridge along the Big Sur coast.",
        zhCaption: "Big Sur 海岸线上的 Bixby Creek Bridge。",
      },
      {
        src: "/footprint/carmel-by-the-sea-02.jpg",
        caption: "Storybook cottage in Carmel-by-the-Sea.",
        zhCaption: "Carmel-by-the-Sea 的童话小屋。",
      },
    ],
  },
  {
    id: "san-simeon",
    name: "San Simeon",
    zhName: "圣西蒙",
    country: "USA",
    zhCountry: "美国",
    lat: 35.643,
    lng: -121.1908,
    note: "Hearst Castle pools, towers, and hilltop views.",
    zhNote: "赫斯特古堡的泳池、塔楼与山顶视野。",
    photos: [
      {
        src: "/footprint/san-simeon-01.jpg",
        caption: "Neptune Pool at Hearst Castle.",
        zhCaption: "赫斯特古堡的 Neptune Pool。",
      },
      {
        src: "/footprint/san-simeon-02.jpg",
        caption: "Hearst Castle towers above the gardens.",
        zhCaption: "花园上方的赫斯特古堡塔楼。",
      },
      {
        src: "/footprint/san-simeon-03.jpg",
        caption: "Elephant seals resting at the vista point near San Simeon.",
        zhCaption: "San Simeon 附近观景点休息的象海豹。",
      },
    ],
  },
  {
    id: "oceano",
    name: "Oceano",
    zhName: "欧申诺",
    country: "USA",
    zhCountry: "美国",
    lat: 35.0989,
    lng: -120.6124,
    note: "Sand dunes and open coastal sky.",
    zhNote: "沙丘与开阔海岸天空。",
    photos: [
      {
        src: "/footprint/oceano-01.jpg",
        caption: "Dunes under a clear Oceano sky.",
        zhCaption: "晴空下的 Oceano 沙丘。",
      },
    ],
  },
  {
    id: "solvang",
    name: "Solvang",
    zhName: "索尔万",
    country: "USA",
    zhCountry: "美国",
    lat: 34.5958,
    lng: -120.1376,
    note: "Danish-style streets, storefronts, and windmills.",
    zhNote: "丹麦风格街巷、店铺与风车。",
    photos: [
      {
        src: "/footprint/solvang-01.jpg",
        caption: "Danish-style storefronts in Solvang.",
        zhCaption: "Solvang 的丹麦风格店铺。",
      },
      {
        src: "/footprint/solvang-02.jpg",
        caption: "Windmill above the Solvang street.",
        zhCaption: "Solvang 街边的风车。",
      },
    ],
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    zhName: "洛杉矶",
    country: "USA",
    zhCountry: "美国",
    lat: 34.0522,
    lng: -118.2437,
    note: "Beverly Hills, downtown rails, Griffith night, and Lakers memories.",
    zhNote: "Beverly Hills、市中心缆车、Griffith 夜色与湖人记忆。",
    photos: [
      {
        src: "/footprint/los-angeles-01.jpg",
        caption: "Beverly Hills sign by the lily pond.",
        zhCaption: "睡莲池旁的 Beverly Hills 标志。",
      },
      {
        src: "/footprint/los-angeles-02.jpg",
        caption: "Rodeo Drive street scene in Beverly Hills.",
        zhCaption: "Beverly Hills 的 Rodeo Drive 街景。",
      },
      {
        src: "/footprint/los-angeles-03.jpg",
        caption: "Kobe Bryant mural in Los Angeles.",
        zhCaption: "洛杉矶的 Kobe Bryant 壁画。",
      },
      {
        src: "/footprint/los-angeles-04.jpg",
        caption: "Angels Flight Railway in downtown Los Angeles.",
        zhCaption: "洛杉矶市中心的 Angels Flight Railway。",
      },
      {
        src: "/footprint/los-angeles-05.jpg",
        caption: "Griffith Observatory lit up at night.",
        zhCaption: "夜色中亮起的 Griffith Observatory。",
      },
    ],
  },
  {
    id: "menlo-park",
    name: "Menlo Park",
    zhName: "门洛帕克",
    country: "USA",
    zhCountry: "美国",
    lat: 37.453,
    lng: -122.1817,
    note: "Peninsula campus roads and quiet Bay Area neighborhoods.",
    zhNote: "半岛园区道路与安静的湾区社区。",
    photos: [],
  },
  {
    id: "palo-alto",
    name: "Palo Alto",
    zhName: "帕洛阿尔托",
    country: "USA",
    zhCountry: "美国",
    lat: 37.4419,
    lng: -122.143,
    note: "Stanford campus arches, palms, and Silicon Valley afternoons.",
    zhNote: "Stanford 校园拱廊、棕榈树与硅谷午后。",
    photos: [
      {
        src: "/footprint/palo-alto-01.jpg",
        caption: "Stanford Main Quad on a rainy day.",
        zhCaption: "雨天里的 Stanford Main Quad。",
      },
      {
        src: "/footprint/palo-alto-02.jpg",
        caption: "Stanford arcade and palm trees.",
        zhCaption: "Stanford 的拱廊与棕榈树。",
      },
      {
        src: "/footprint/palo-alto-03.jpg",
        caption: "Hoover Tower and the Stanford Main Quad.",
        zhCaption: "Hoover Tower 与 Stanford Main Quad。",
      },
    ],
  },
  {
    id: "saratoga",
    name: "Saratoga",
    zhName: "萨拉托加",
    country: "USA",
    zhCountry: "美国",
    lat: 37.2638,
    lng: -122.023,
    note: "Foothill roads, gardens, and South Bay calm.",
    zhNote: "山麓道路、花园与南湾的安静。",
    photos: [],
  },
  {
    id: "mountain-view",
    name: "Mountain View",
    zhName: "山景城",
    country: "USA",
    zhCountry: "美国",
    lat: 37.3861,
    lng: -122.0839,
    note: "Google headquarters and Silicon Valley campus walks.",
    zhNote: "Google 总部和硅谷园区漫步。",
    photos: [
      {
        src: "/footprint/mountain-view-google-01.jpg",
        caption: "Buildings at Google's Mountain View campus.",
        zhCaption: "Google 山景城园区建筑。",
      },
      {
        src: "/footprint/mountain-view-google-02.jpg",
        caption: "Google sign at the Mountain View headquarters.",
        zhCaption: "Google 山景城总部标识。",
      },
      {
        src: "/footprint/mountain-view-01.jpg",
        caption: "Shoreline Amphitheatre in Mountain View.",
        zhCaption: "山景城的 Shoreline Amphitheatre。",
      },
    ],
  },
  {
    id: "san-jose",
    name: "San Jose",
    zhName: "圣何塞",
    country: "USA",
    zhCountry: "美国",
    lat: 37.3639,
    lng: -121.9289,
    note: "Airport sky and California rainbows.",
    zhNote: "机场天空与加州彩虹。",
    photos: [
      {
        src: "/footprint/san-jose-airport-01.jpg",
        caption: "Rainbow near San Jose airport.",
        zhCaption: "圣何塞机场附近的彩虹。",
      },
      {
        src: "/footprint/san-jose-01.jpg",
        caption: "Salt ponds at Alviso Marina County Park.",
        zhCaption: "Alviso Marina County Park 的盐池。",
      },
    ],
  },
  {
    id: "santa-cruz",
    name: "Santa Cruz",
    zhName: "圣克鲁斯",
    country: "USA",
    zhCountry: "美国",
    lat: 36.9741,
    lng: -122.0308,
    note: "California coast, boardwalk, and ocean light.",
    zhNote: "加州海岸、海滨游乐场和海光。",
    photos: [
      {
        src: "/footprint/santa-cruz-01.jpg",
        caption: "Santa Cruz beach and boardwalk.",
        zhCaption: "圣克鲁斯海滩和海滨游乐场。",
      },
      {
        src: "/footprint/santa-cruz-02.jpg",
        caption: "Surfer statue by the water in Santa Cruz.",
        zhCaption: "圣克鲁斯水边的冲浪者雕像。",
      },
    ],
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    zhName: "旧金山",
    country: "USA",
    zhCountry: "美国",
    lat: 37.7749,
    lng: -122.4194,
    note: "Hills, fog, and the bay.",
    zhNote: "山坡、雾气和海湾。",
    photos: [
      {
        src: "/footprint/san-francisco-01.jpg",
        caption: "Golden Gate Bridge after dusk.",
        zhCaption: "暮色后的金门大桥。",
      },
      {
        src: "/footprint/san-francisco-02.jpg",
        caption: "San Francisco hills and bay views.",
        zhCaption: "旧金山山坡与海湾视野。",
      },
      {
        src: "/footprint/san-francisco-03.jpg",
        caption: "Transamerica Pyramid from the city streets.",
        zhCaption: "城市街道上的泛美金字塔。",
      },
      {
        src: "/footprint/san-francisco-04.jpg",
        caption: "Ferry Building by the waterfront.",
        zhCaption: "海滨的旧金山渡轮大厦。",
      },
      {
        src: "/footprint/san-francisco-05.jpg",
        caption: "Pier 39 by the bay.",
        zhCaption: "海湾边的 39 号码头。",
      },
      {
        src: "/footprint/san-francisco-06.jpg",
        caption: "Golden Gate Bridge in daylight.",
        zhCaption: "日光下的金门大桥。",
      },
      {
        src: "/footprint/san-francisco-07.jpg",
        caption: "San Francisco City Hall under the sky.",
        zhCaption: "天空下的旧金山市政厅。",
      },
      {
        src: "/footprint/san-francisco-08.jpg",
        caption: "Painted Ladies at Alamo Square.",
        zhCaption: "Alamo Square 旁的 Painted Ladies。",
      },
      {
        src: "/footprint/san-francisco-09.jpg",
        caption: "Palace of Fine Arts beside the lagoon.",
        zhCaption: "泻湖边的 Palace of Fine Arts。",
      },
      {
        src: "/footprint/san-francisco-10.jpg",
        caption: "Bay Bridge under pink sunset clouds.",
        zhCaption: "粉色晚霞下的 Bay Bridge。",
      },
      {
        src: "/footprint/san-francisco-11.jpg",
        caption: "Bay Bridge and waterfront after sunset.",
        zhCaption: "日落后的 Bay Bridge 与海滨。",
      },
      {
        src: "/footprint/san-francisco-12.jpg",
        caption: "San Francisco hills under a warm sunset.",
        zhCaption: "暖色日落下的旧金山山坡。",
      },
      {
        src: "/footprint/san-francisco-13.jpg",
        caption: "North Beach signs and Columbus Tower.",
        zhCaption: "North Beach 招牌与 Columbus Tower。",
      },
      {
        src: "/footprint/san-francisco-14.jpg",
        caption: "Japanese Tea Garden in Golden Gate Park.",
        zhCaption: "Golden Gate Park 里的 Japanese Tea Garden。",
      },
    ],
  },
  {
    id: "seattle",
    name: "Seattle",
    zhName: "西雅图",
    country: "USA",
    zhCountry: "美国",
    lat: 47.6062,
    lng: -122.3321,
    note: "Space Needle, Amazon Spheres, the waterfront, and the University of Washington.",
    zhNote: "Space Needle、Amazon Spheres、海滨与华盛顿大学。",
    photos: [
      {
        src: "/footprint/seattle-01.jpg",
        caption: "Denny Triangle high-rises in downtown Seattle.",
        zhCaption: "西雅图市中心 Denny Triangle 的高楼。",
      },
      {
        src: "/footprint/seattle-02.jpg",
        caption: "The Amazon Spheres in Seattle.",
        zhCaption: "西雅图的 Amazon Spheres。",
      },
      {
        src: "/footprint/seattle-03.jpg",
        caption: "Space Needle under a clear Seattle sky.",
        zhCaption: "晴空下的 Space Needle。",
      },
      {
        src: "/footprint/seattle-04.jpg",
        caption: "Lake Union viewed from the Space Needle.",
        zhCaption: "从 Space Needle 俯瞰 Lake Union。",
      },
      {
        src: "/footprint/seattle-05.jpg",
        caption: "Downtown Seattle skyline from the Space Needle.",
        zhCaption: "从 Space Needle 俯瞰西雅图市中心天际线。",
      },
      {
        src: "/footprint/seattle-06.jpg",
        caption: "Seattle waterfront and Elliott Bay from the Space Needle.",
        zhCaption: "从 Space Needle 俯瞰西雅图海滨与 Elliott Bay。",
      },
      {
        src: "/footprint/seattle-07.jpg",
        caption: "Chinatown Gate in Seattle's Chinatown-International District.",
        zhCaption: "西雅图 Chinatown-International District 的牌坊。",
      },
      {
        src: "/footprint/seattle-08.jpg",
        caption: "King Street Station clock tower in Seattle.",
        zhCaption: "西雅图 King Street Station 的钟楼。",
      },
      {
        src: "/footprint/seattle-09.jpg",
        caption: "Union Station in Seattle.",
        zhCaption: "西雅图的 Union Station。",
      },
      {
        src: "/footprint/seattle-10.jpg",
        caption: "Puget Sound sunset from the Space Needle.",
        zhCaption: "从 Space Needle 望向 Puget Sound 的日落。",
      },
      {
        src: "/footprint/seattle-11.jpg",
        caption: "Paul G. Allen Center at the University of Washington.",
        zhCaption: "华盛顿大学的 Paul G. Allen Center。",
      },
      {
        src: "/footprint/seattle-12.jpg",
        caption: "Husky Stadium and Lake Washington from the University of Washington.",
        zhCaption: "从华盛顿大学望向 Husky Stadium 与 Lake Washington。",
      },
      {
        src: "/footprint/seattle-13.jpg",
        caption: "The Quad at the University of Washington.",
        zhCaption: "华盛顿大学的 The Quad。",
      },
      {
        src: "/footprint/seattle-14.jpg",
        caption: "Henry Art Gallery at the University of Washington.",
        zhCaption: "华盛顿大学的 Henry Art Gallery。",
      },
      {
        src: "/footprint/seattle-15.jpg",
        caption: "Liberal Arts Quadrangle at the University of Washington.",
        zhCaption: "华盛顿大学的 Liberal Arts Quadrangle。",
      },
      {
        src: "/footprint/seattle-16.jpg",
        caption: "Suzzallo Library at the University of Washington.",
        zhCaption: "华盛顿大学的 Suzzallo Library。",
      },
      {
        src: "/footprint/seattle-17.jpg",
        caption: "PACCAR Hall at the University of Washington.",
        zhCaption: "华盛顿大学的 PACCAR Hall。",
      },
      {
        src: "/footprint/seattle-18.jpg",
        caption: "Seattle Great Wheel at dusk.",
        zhCaption: "黄昏时的 Seattle Great Wheel。",
      },
      {
        src: "/footprint/seattle-19.jpg",
        caption: "Seattle Great Wheel and Elliott Bay at sunset.",
        zhCaption: "日落时的 Seattle Great Wheel 与 Elliott Bay。",
      },
    ],
  },
  {
    id: "washington-dc",
    name: "Washington, D.C.",
    zhName: "华盛顿",
    country: "USA",
    zhCountry: "美国",
    lat: 38.9072,
    lng: -77.0369,
    note: "National Mall, museums, and monuments.",
    zhNote: "国家广场、博物馆和纪念碑。",
    photos: [
      {
        src: "/footprint/washington-dc-01.jpg",
        caption: "Washington Monument at night.",
        zhCaption: "夜色中的华盛顿纪念碑。",
      },
      {
        src: "/footprint/washington-dc-02.jpg",
        caption: "Lincoln Memorial statue.",
        zhCaption: "林肯纪念堂内的林肯坐像。",
      },
      {
        src: "/footprint/washington-dc-03.jpg",
        caption: "U.S. Capitol at night.",
        zhCaption: "夜色中的美国国会大厦。",
      },
      {
        src: "/footprint/washington-dc-04.jpg",
        caption: "Smithsonian Castle under a blue sky.",
        zhCaption: "蓝天下的史密森尼城堡。",
      },
      {
        src: "/footprint/washington-dc-05.jpg",
        caption: "Holiday lights at Willard Center.",
        zhCaption: "Willard Center 的节日灯饰。",
      },
      {
        src: "/footprint/washington-dc-06.jpg",
        caption: "International Spy Museum in evening light.",
        zhCaption: "暮光里的国际间谍博物馆。",
      },
      {
        src: "/footprint/washington-dc-07.jpg",
        caption: "Space Shuttle Discovery at the Udvar-Hazy Center.",
        zhCaption: "Udvar-Hazy Center 的“发现号”航天飞机。",
      },
      {
        src: "/footprint/washington-dc-08.jpg",
        caption: "Boeing B-29 Superfortress Enola Gay.",
        zhCaption: "波音 B-29 超级空中堡垒 “Enola Gay”。",
      },
      {
        src: "/footprint/washington-dc-09.jpg",
        caption: "Lockheed SR-71 Blackbird in the aircraft hall.",
        zhCaption: "航空展厅里的洛克希德 SR-71“黑鸟”。",
      },
      {
        src: "/footprint/washington-dc-10.jpg",
        caption: "National Mall from above.",
        zhCaption: "俯瞰国家广场。",
      },
      {
        src: "/footprint/washington-dc-11.jpg",
        caption: "The White House from above.",
        zhCaption: "俯瞰白宫。",
      },
      {
        src: "/footprint/washington-dc-12.jpg",
        caption: "Tidal Basin and Jefferson Memorial from above.",
        zhCaption: "俯瞰潮汐湖与杰斐逊纪念堂。",
      },
      {
        src: "/footprint/washington-dc-13.jpg",
        caption: "Washington Monument under a blue sky.",
        zhCaption: "蓝天下的华盛顿纪念碑。",
      },
      {
        src: "/footprint/washington-dc-14.jpg",
        caption: "Classical museum facade in Washington, D.C.",
        zhCaption: "华盛顿特区的古典风格博物馆外立面。",
      },
      {
        src: "/footprint/washington-dc-15.jpg",
        caption: "U.S. Capitol under a clear blue sky.",
        zhCaption: "晴空下的美国国会大厦。",
      },
    ],
  },
  {
    id: "new-york",
    name: "New York",
    zhName: "纽约",
    country: "USA",
    zhCountry: "美国",
    lat: 40.7128,
    lng: -74.006,
    note: "A city that never quite slows down.",
    zhNote: "永远不太慢下来的城市。",
    photos: [
      {
        src: "/footprint/new-york-01.jpg",
        caption: "New Year's Eve fireworks over Central Park.",
        zhCaption: "纽约中央公园跨年烟花。",
      },
      {
        src: "/footprint/new-york-02.jpg",
        caption: "Space Shuttle Enterprise at the Intrepid Museum.",
        zhCaption: "Intrepid Museum 的企业号航天飞机。",
      },
      {
        src: "/footprint/new-york-03.jpg",
        caption: "Grumman E-1B Tracer on the USS Intrepid flight deck.",
        zhCaption: "USS Intrepid 飞行甲板上的 Grumman E-1B Tracer。",
      },
      {
        src: "/footprint/new-york-04.jpg",
        caption: "USS Intrepid (CV-11) at Pier 86.",
        zhCaption: "86 号码头的 USS Intrepid (CV-11)。",
      },
      {
        src: "/footprint/new-york-05.jpg",
        caption: "USS Intrepid (CV-11) from the Hudson River side.",
        zhCaption: "从哈德逊河一侧看到的 USS Intrepid (CV-11)。",
      },
      {
        src: "/footprint/new-york-06.jpg",
        caption: "Times Square billboards and yellow cabs.",
        zhCaption: "时代广场的广告屏与黄色出租车。",
      },
      {
        src: "/footprint/new-york-07.jpg",
        caption: "Looking up through the towers of Times Square.",
        zhCaption: "时代广场高楼之间的仰望视角。",
      },
    ],
  },
  {
    id: "east-rutherford",
    name: "East Rutherford",
    zhName: "东卢瑟福",
    country: "USA",
    zhCountry: "美国",
    lat: 40.8338,
    lng: -74.0971,
    note: "MetLife Stadium and Copa America semifinal memories.",
    zhNote: "MetLife Stadium 与美洲杯半决赛记忆。",
    photos: [
      {
        src: "/footprint/east-rutherford-01.jpg",
        caption: "MetLife Stadium before the Copa America semifinal.",
        zhCaption: "美洲杯半决赛前的 MetLife Stadium。",
      },
      {
        src: "/footprint/east-rutherford-02.jpg",
        caption: "Watching the Copa America semifinal inside MetLife Stadium.",
        zhCaption: "在 MetLife Stadium 看美洲杯半决赛。",
      },
    ],
  },
  {
    id: "princeton",
    name: "Princeton",
    zhName: "普林斯顿",
    country: "USA",
    zhCountry: "美国",
    lat: 40.3573,
    lng: -74.6672,
    note: "Institute for Advanced Study and quiet campus walks.",
    zhNote: "高等研究院与安静的校园漫步。",
    photos: [
      {
        src: "/footprint/princeton-01.jpg",
        caption: "Fuld Hall at the Institute for Advanced Study.",
        zhCaption: "高等研究院的 Fuld Hall。",
      },
      {
        src: "/footprint/princeton-02.jpg",
        caption: "Fuld Hall facade at the Institute for Advanced Study.",
        zhCaption: "高等研究院 Fuld Hall 的正面。",
      },
    ],
  },
  {
    id: "philadelphia",
    name: "Philadelphia",
    zhName: "费城",
    country: "USA",
    zhCountry: "美国",
    lat: 39.9526,
    lng: -75.1652,
    note: "Historic halls and old city landmarks.",
    zhNote: "历史建筑与老城地标。",
    photos: [
      {
        src: "/footprint/philadelphia-01.jpg",
        caption: "Independence Hall in Philadelphia.",
        zhCaption: "费城独立厅。",
      },
      {
        src: "/footprint/philadelphia-02.jpg",
        caption: "Independence Hall clock tower.",
        zhCaption: "独立厅钟楼。",
      },
      {
        src: "/footprint/philadelphia-03.jpg",
        caption: "Historic room inside Independence Hall.",
        zhCaption: "独立厅内的历史房间。",
      },
      {
        src: "/footprint/philadelphia-04.jpg",
        caption: "Commodore Barry statue near Independence Hall.",
        zhCaption: "独立厅附近的 Commodore Barry 雕像。",
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    zhName: "巴塞罗那",
    country: "Spain",
    zhCountry: "西班牙",
    lat: 41.3874,
    lng: 2.1686,
    note: "Sun, streets, and architecture.",
    zhNote: "阳光、街道和建筑。",
    photos: [
      {
        src: "/footprint/barcelona-01.jpg",
        caption: "Barcelona from above.",
        zhCaption: "俯瞰巴塞罗那。",
      },
      {
        src: "/footprint/barcelona-02.jpg",
        caption: "Sagrada Familia facade.",
        zhCaption: "圣家堂外立面。",
      },
      {
        src: "/footprint/barcelona-03.jpg",
        caption: "Stained glass inside Sagrada Familia.",
        zhCaption: "圣家堂内的彩色玻璃。",
      },
      {
        src: "/footprint/barcelona-04.jpg",
        caption: "Sunset waves on the Barcelona coast.",
        zhCaption: "巴塞罗那海岸的暮色海浪。",
      },
      {
        src: "/footprint/barcelona-05.jpg",
        caption: "Barcelona rooftops under a clear sky.",
        zhCaption: "晴空下的巴塞罗那屋顶。",
      },
      {
        src: "/footprint/barcelona-06.jpg",
        caption: "Barcelona Cathedral facade.",
        zhCaption: "巴塞罗那主教座堂外立面。",
      },
      {
        src: "/footprint/barcelona-07.jpg",
        caption: "Inside Barcelona Cathedral.",
        zhCaption: "巴塞罗那主教座堂内部。",
      },
      {
        src: "/footprint/barcelona-08.jpg",
        caption: "A busy Barcelona street.",
        zhCaption: "巴塞罗那的繁忙街道。",
      },
    ],
  },
  {
    id: "milan",
    name: "Milan",
    zhName: "米兰",
    country: "Italy",
    zhCountry: "意大利",
    lat: 45.4642,
    lng: 9.19,
    note: "Cathedral squares, galleries, and northern Italian city light.",
    zhNote: "大教堂广场、拱廊与意大利北部城市光线。",
    photos: [],
  },
  {
    id: "rome",
    name: "Rome",
    zhName: "罗马",
    country: "Italy",
    zhCountry: "意大利",
    lat: 41.9028,
    lng: 12.4964,
    note: "Ancient streets, piazzas, and layered Roman history.",
    zhNote: "古老街巷、广场与层层叠叠的罗马历史。",
    photos: [],
  },
  {
    id: "vatican-city",
    name: "Vatican City",
    zhName: "梵蒂冈",
    country: "Vatican City",
    zhCountry: "梵蒂冈",
    lat: 41.9029,
    lng: 12.4534,
    note: "St. Peter's Square and the compact city-state at Rome's heart.",
    zhNote: "圣彼得广场与罗马城中的袖珍城国。",
    photos: [],
  },
  {
    id: "venice",
    name: "Venice",
    zhName: "威尼斯",
    country: "Italy",
    zhCountry: "意大利",
    lat: 45.4408,
    lng: 12.3155,
    note: "Canals, bridges, and lagoon light.",
    zhNote: "运河、桥与潟湖光线。",
    photos: [],
  },
  {
    id: "paris",
    name: "Paris",
    zhName: "巴黎",
    country: "France",
    zhCountry: "法国",
    lat: 48.8566,
    lng: 2.3522,
    note: "Boulevards, museums, and Seine-side walks.",
    zhNote: "林荫大道、博物馆与塞纳河畔漫步。",
    photos: [],
  },
  {
    id: "zurich",
    name: "Zurich",
    zhName: "苏黎世",
    country: "Switzerland",
    zhCountry: "瑞士",
    lat: 47.3769,
    lng: 8.5417,
    note: "Lake air, old-town lanes, and Swiss city calm.",
    zhNote: "湖风、老城小巷与瑞士城市的安静。",
    photos: [],
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    zhName: "法兰克福",
    country: "Germany",
    zhCountry: "德国",
    lat: 50.1109,
    lng: 8.6821,
    note: "Skyline, old streets, and cathedral light.",
    zhNote: "天际线、老城街巷与教堂光影。",
    photos: [
      {
        src: "/footprint/frankfurt-01.jpg",
        caption: "Historic facade near the old town.",
        zhCaption: "老城附近的历史建筑立面。",
      },
      {
        src: "/footprint/frankfurt-02.jpg",
        caption: "Organ pipes and stained glass.",
        zhCaption: "管风琴与彩色玻璃。",
      },
      {
        src: "/footprint/frankfurt-03.jpg",
        caption: "Old town streets in afternoon light.",
        zhCaption: "午后光线里的老城街巷。",
      },
      {
        src: "/footprint/frankfurt-04.jpg",
        caption: "Romerberg and the old town square.",
        zhCaption: "罗马广场与老城广场。",
      },
      {
        src: "/footprint/frankfurt-05.jpg",
        caption: "Glass towers over a quiet street.",
        zhCaption: "安静街道尽头的玻璃高楼。",
      },
      {
        src: "/footprint/frankfurt-06.jpg",
        caption: "The Main riverfront.",
        zhCaption: "美因河畔。",
      },
      {
        src: "/footprint/frankfurt-07.jpg",
        caption: "Justitia Fountain in the old town.",
        zhCaption: "老城里的正义女神喷泉。",
      },
      {
        src: "/footprint/frankfurt-08.jpg",
        caption: "Frankfurt skyline from above.",
        zhCaption: "俯瞰法兰克福天际线。",
      },
    ],
  },
  {
    id: "moscow",
    name: "Moscow",
    zhName: "莫斯科",
    country: "Russia",
    zhCountry: "俄罗斯",
    lat: 55.7558,
    lng: 37.6173,
    note: "Red Square in winter light.",
    zhNote: "冬日光线里的红场。",
    photos: [
      {
        src: "/footprint/moscow-01.jpg",
        caption: "Red Square and the State Historical Museum.",
        zhCaption: "红场与国家历史博物馆。",
      },
      {
        src: "/footprint/moscow-02.jpg",
        caption: "Saint Basil's Cathedral on Red Square.",
        zhCaption: "红场上的圣瓦西里大教堂。",
      },
    ],
  },
  {
    id: "istanbul",
    name: "Istanbul",
    zhName: "伊斯坦布尔",
    country: "Turkey",
    zhCountry: "土耳其",
    lat: 41.0082,
    lng: 28.9784,
    note: "Mosques beneath heavy clouds.",
    zhNote: "厚云下的清真寺。",
    photos: [
      {
        src: "/footprint/istanbul-01.jpg",
        caption: "Hagia Sophia under heavy clouds.",
        zhCaption: "厚云下的圣索菲亚大教堂。",
      },
      {
        src: "/footprint/istanbul-02.jpg",
        caption: "The Blue Mosque skyline.",
        zhCaption: "蓝色清真寺的天际线。",
      },
      {
        src: "/footprint/istanbul-03.jpg",
        caption: "Taksim Square and Taksim Mosque under gray skies.",
        zhCaption: "灰天下的塔克西姆广场与塔克西姆清真寺。",
      },
      {
        src: "/footprint/istanbul-04.jpg",
        caption: "Streetcar tracks through Istanbul.",
        zhCaption: "伊斯坦布尔街道上的有轨电车轨道。",
      },
      {
        src: "/footprint/istanbul-05.jpg",
        caption: "Cloud light over Istanbul's waterfront.",
        zhCaption: "伊斯坦布尔海边的云光。",
      },
    ],
  },
  {
    id: "vladivostok",
    name: "Vladivostok",
    zhName: "海参崴",
    country: "Russia",
    zhCountry: "俄罗斯",
    lat: 43.1155,
    lng: 131.8855,
    note: "A city by the Pacific.",
    zhNote: "太平洋边的城市。",
    photos: [
      {
        src: "/footprint/vladivostok-01.jpg",
        caption: "Vladivostok city square.",
        zhCaption: "海参崴城市广场。",
      },
    ],
  },
  {
    id: "cairo",
    name: "Cairo",
    zhName: "开罗",
    country: "Egypt",
    zhCountry: "埃及",
    lat: 30.0444,
    lng: 31.2357,
    note: "A gateway to Egyptian memories.",
    zhNote: "埃及记忆的入口。",
    photos: [
      {
        src: "/footprint/cairo-01.jpg",
        caption: "The Great Pyramid of Giza.",
        zhCaption: "吉萨大金字塔。",
      },
      {
        src: "/footprint/cairo-02.jpg",
        caption: "The Pyramid of Khafre.",
        zhCaption: "哈夫拉金字塔。",
      },
      {
        src: "/footprint/cairo-03.jpg",
        caption: "Clouds over Giza.",
        zhCaption: "吉萨上空的云。",
      },
      {
        src: "/footprint/cairo-04.jpg",
        caption: "The Sphinx at golden hour.",
        zhCaption: "金色时刻的狮身人面像。",
      },
    ],
  },
  {
    id: "alexandria",
    name: "Alexandria",
    zhName: "亚历山大",
    country: "Egypt",
    zhCountry: "埃及",
    lat: 31.2001,
    lng: 29.9187,
    note: "Mediterranean air.",
    zhNote: "地中海的空气。",
    photos: [
      {
        src: "/footprint/alexandria-01.jpg",
        caption: "Qaitbay Citadel by the Mediterranean.",
        zhCaption: "地中海边的盖贝依城堡。",
      },
      {
        src: "/footprint/alexandria-02.jpg",
        caption: "The walls of Qaitbay Citadel.",
        zhCaption: "盖贝依城堡的城墙。",
      },
      {
        src: "/footprint/alexandria-03.jpg",
        caption: "Waves on Alexandria's Mediterranean shore.",
        zhCaption: "亚历山大地中海岸边的海浪。",
      },
      {
        src: "/footprint/alexandria-04.jpg",
        caption: "Sea wall and bright clouds in Alexandria.",
        zhCaption: "亚历山大的海堤与明亮云层。",
      },
    ],
  },
  {
    id: "luxor",
    name: "Luxor",
    zhName: "卢克索",
    country: "Egypt",
    zhCountry: "埃及",
    lat: 25.6872,
    lng: 32.6396,
    note: "World Finals and ancient light.",
    zhNote: "世界总决赛与古老光线。",
    photos: [
      {
        src: "/footprint/luxor-01.jpg",
        caption: "Ancient reliefs at Luxor.",
        zhCaption: "卢克索的古埃及浮雕。",
      },
      {
        src: "/footprint/luxor-02.jpg",
        caption: "Columns at Karnak Temple.",
        zhCaption: "卡纳克神庙的石柱。",
      },
      {
        src: "/footprint/luxor-03.jpg",
        caption: "Hot air balloons over Luxor.",
        zhCaption: "卢克索上空的热气球。",
      },
      {
        src: "/footprint/luxor-04.jpg",
        caption: "Luxor Temple at night.",
        zhCaption: "夜晚的卢克索神庙。",
      },
      {
        src: "/footprint/luxor-05.jpg",
        caption: "Valley of the Kings.",
        zhCaption: "帝王谷。",
      },
    ],
  },
  {
    id: "hakodate",
    name: "Hakodate",
    zhName: "函馆",
    country: "Japan",
    zhCountry: "日本",
    lat: 41.7687,
    lng: 140.7291,
    note: "Night view above the harbor.",
    zhNote: "港口上方的夜景。",
    photos: [
      {
        src: "/footprint/hakodate-01.jpg",
        caption: "Hakodate night view.",
        zhCaption: "函馆夜景。",
      },
    ],
  },
  {
    id: "nagoya",
    name: "Nagoya",
    zhName: "名古屋",
    country: "Japan",
    zhCountry: "日本",
    lat: 35.1815,
    lng: 136.9066,
    note: "Castle lights in the city.",
    zhNote: "城市灯火中的城。",
    photos: [
      {
        src: "/footprint/nagoya-01.jpg",
        caption: "Nagoya Castle at night.",
        zhCaption: "夜色中的名古屋城。",
      },
    ],
  },
];

const initialCenter: L.LatLngExpression = [31, 32];
const initialZoom = 2;

const Footprint = () => {
  const { i18n } = useTranslation();
  const isChinese = i18n.language.startsWith("zh");
  const [selectedPlace, setSelectedPlace] = useState<FootprintPlace | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);

  const displayName = (place: FootprintPlace) =>
    isChinese ? place.zhName : place.name;
  const displayCountry = (place: FootprintPlace) =>
    isChinese ? place.zhCountry : countryStyles[place.country].label;
  const displayNote = (place: FootprintPlace) =>
    isChinese ? place.zhNote : place.note;

  const focusPlace = useCallback((place: FootprintPlace) => {
    mapRef.current?.panTo([place.lat, place.lng], { animate: false });
    setPhotoIndex(0);
    setAutoPlay((place.photos?.length ?? 0) > 1);
    setSelectedPlace(place);
  }, []);

  const closeModal = () => {
    setSelectedPlace(null);
    setPhotoIndex(0);
    setAutoPlay(false);
  };

  const countryCount = useMemo(
    () => new Set(places.map((place) => place.country)).size,
    [],
  );

  const cityGroups = useMemo(
    () =>
      continentOrder
        .map((continent) => {
          const continentPlaces = places.filter(
            (place) => getContinent(place) === continent,
          );
          const countries = Array.from(
            new Set(continentPlaces.map((place) => place.country)),
          ).map((country) => {
            const countryPlaces = continentPlaces.filter(
              (place) => place.country === country,
            );
            const regionGroups = countryPlaces.reduce<
              Array<{
                key: string;
                region: PlaceRegion | null;
                places: FootprintPlace[];
              }>
            >((groups, place) => {
              const region = getPlaceRegion(place);
              const key = region ? `${region.label}-${region.zhLabel}` : "all";
              const existing = groups.find((group) => group.key === key);
              if (existing) {
                existing.places.push(place);
              } else {
                groups.push({ key, region, places: [place] });
              }
              return groups;
            }, []);

            return { country, places: countryPlaces, regionGroups };
          });
          if (continent === "NorthAmerica") {
            countries.sort(
              (a, b) =>
                (northAmericaCountryOrder[a.country] ?? 99) -
                (northAmericaCountryOrder[b.country] ?? 99),
            );
          }

          return { continent, countries };
        }),
    [],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 80,
      inertia: true,
      maxBounds: [
        [-85, -180],
        [85, 180],
      ],
      maxBoundsViscosity: 0.72,
    });

    // Use no-label tiles so provider-side political labels do not imply country status.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
      noWrap: true,
      subdomains: "abcd",
    }).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);

    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markerLayerRef.current?.remove();
    const markerLayer = L.layerGroup().addTo(map);

    places.forEach((place) => {
      const style = countryStyles[place.country];
      const tooltipName = isChinese ? place.zhName : place.name;
      const marker = L.circleMarker([place.lat, place.lng], {
        radius: 7,
        color: "#ffffff",
        weight: 2.5,
        fillColor: style.color,
        fillOpacity: 0.96,
        opacity: 1,
        className: "footprint-leaflet-marker",
      });

      marker
        .bindTooltip(tooltipName, {
          direction: "top",
          offset: [0, -9],
          opacity: 0.95,
          className: "footprint-leaflet-tooltip",
        })
        .on("click", () => focusPlace(place))
        .on("mouseover", () => marker.setRadius(9))
        .on("mouseout", () => marker.setRadius(7))
        .addTo(markerLayer);
    });

    markerLayerRef.current = markerLayer;

    return () => {
      markerLayer.remove();
    };
  }, [focusPlace, isChinese]);

  const zoomMap = (delta: number) => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const nextZoom = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), map.getZoom() + delta));
    map.flyTo(map.getCenter(), nextZoom, { duration: 0.35 });
  };

  const resetMap = () => {
    mapRef.current?.setView(initialCenter, initialZoom, { animate: false });
  };

  const selectedPhotos = selectedPlace?.photos ?? [];
  const currentPhoto = selectedPhotos[photoIndex];
  const hasMultiplePhotos = selectedPhotos.length > 1;

  const showNextPhoto = useCallback(() => {
    setPhotoIndex((current) =>
      selectedPhotos.length ? (current + 1) % selectedPhotos.length : 0,
    );
  }, [selectedPhotos.length]);

  const showPreviousPhoto = () => {
    setPhotoIndex((current) =>
      selectedPhotos.length
        ? (current - 1 + selectedPhotos.length) % selectedPhotos.length
        : 0,
    );
  };

  useEffect(() => {
    if (!selectedPlace || !autoPlay || selectedPhotos.length <= 1) {
      return;
    }

    const timer = window.setInterval(showNextPhoto, 4500);
    return () => window.clearInterval(timer);
  }, [autoPlay, selectedPhotos.length, selectedPlace, showNextPhoto]);

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPlace]);

  return (
    <main className="mx-auto max-w-4xl px-3">
      <section className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold leading-none text-slate-950 dark:text-slate-50">
              {isChinese ? "足迹" : "Footprint"}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              {isChinese
                ? "读万卷书，行万里路，要用双脚丈量土地。"
                : "Read widely, travel far, and measure the land with your own feet."}
            </p>
          </div>

          <dl className="grid w-full grid-cols-2 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:w-[320px]">
            <div className="px-4 py-3">
              <dt className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                {isChinese ? "国家" : "Countries"}
              </dt>
              <dd className="mt-1 text-3xl font-bold leading-none text-slate-950 dark:text-slate-50">
                {countryCount}
              </dd>
            </div>
            <div className="border-l border-slate-200 px-4 py-3 dark:border-slate-700">
              <dt className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                {isChinese ? "城市 / 地点" : "Cities / Places"}
              </dt>
              <dd className="mt-1 text-3xl font-bold leading-none text-slate-950 dark:text-slate-50">
                {places.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <div
            ref={mapContainerRef}
            className="h-[390px] w-full bg-slate-100 sm:h-[470px] md:h-[560px] dark:bg-slate-800"
            aria-label={isChinese ? "足迹地图" : "Footprint map"}
          />

          <div className="absolute right-4 top-4 z-[500] flex overflow-hidden rounded-sm border border-white/75 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <button
              type="button"
              aria-label={isChinese ? "放大地图" : "Zoom in"}
              title={isChinese ? "放大" : "Zoom in"}
              onClick={() => zoomMap(1)}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300"
            >
              <ZoomIn size={17} />
            </button>
            <button
              type="button"
              aria-label={isChinese ? "缩小地图" : "Zoom out"}
              title={isChinese ? "缩小" : "Zoom out"}
              onClick={() => zoomMap(-1)}
              className="inline-flex h-9 w-9 items-center justify-center border-l border-slate-100 text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300"
            >
              <ZoomOut size={17} />
            </button>
            <button
              type="button"
              aria-label={isChinese ? "重置地图" : "Reset map"}
              title={isChinese ? "重置" : "Reset"}
              onClick={resetMap}
              className="inline-flex h-9 w-9 items-center justify-center border-l border-slate-100 text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 z-[500] max-w-[calc(100%-2rem)] rounded-sm border border-white/70 bg-white/85 px-3 py-2 text-xs font-medium text-gray-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200">
            <div>
              {isChinese
                ? `已标记 ${places.length} 个地点`
                : `${places.length} places marked`}
            </div>
            <div className="mt-0.5 text-[11px] font-normal text-gray-500 dark:text-slate-400">
              {isChinese ? "可拖拽、滚轮缩放、点击标记" : "Drag, scroll to zoom, and click markers"}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-3 py-3 text-[12px] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {isChinese
            ? "点击地图标记或下方地点可以查看照片。"
            : "Click a map marker or a place below to view photos."}
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {cityGroups.map(({ continent, countries }) => {
          const continentStyle = continentStyles[continent];
          return (
            <div key={continent} className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {isChinese ? continentStyle.zhLabel : continentStyle.label}
                </h2>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                  {countries.reduce((sum, group) => sum + group.places.length, 0)}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {countries.length ? (
                  countries.map(({ country, places: countryPlaces, regionGroups }) => {
                    const style = countryStyles[country];
                    const regionUnit = regionUnitLabels[country];
                    const regionCount = regionGroups.filter(({ region }) => region).length;
                    const countrySummary =
                      regionUnit && regionCount
                        ? isChinese
                          ? `${regionCount} ${regionUnit.zhLabel} / ${placeCountLabel(
                              countryPlaces.length,
                              isChinese,
                            )}`
                          : `${regionCount} ${regionUnit.label} / ${placeCountLabel(
                              countryPlaces.length,
                              isChinese,
                            )}`
                        : placeCountLabel(countryPlaces.length, isChinese);
                    const countryCardClass = [
                      "border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900",
                      continent === "NorthAmerica" && country === "USA" ? "md:row-span-2" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <article
                        key={`${continent}-${country}`}
                        className={countryCardClass}
                        style={{ borderTop: `3px solid ${continentStyle.accent}` }}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: style.color }}
                            />
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-50">
                              {isChinese ? style.zhLabel : style.label}
                            </h3>
                          </div>
                          <span className="shrink-0 text-right text-[12px] text-slate-500 dark:text-slate-400">
                            {countrySummary}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {regionGroups.map(({ key, region, places: regionPlaces }) => (
                            <div key={`${country}-${key}`} className="space-y-1.5">
                              {region && (
                                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-1 dark:border-slate-800">
                                  <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                                    {isChinese ? region.zhLabel : region.label}
                                  </span>
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                    {placeCountLabel(regionPlaces.length, isChinese)}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-1.5">
                                {regionPlaces.map((place) => (
                                  <button
                                    type="button"
                                    key={place.id}
                                    onClick={() => focusPlace(place)}
                                    className="group inline-flex items-center gap-1.5 rounded-sm border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                                  >
                                    <span className="text-[13px] font-semibold leading-none text-slate-800 group-hover:text-slate-950 dark:text-slate-100 dark:group-hover:text-white">
                                      {displayName(place)}
                                    </span>
                                    <MapPin
                                      size={12}
                                      className="shrink-0 text-slate-400 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div
                    className="border border-dashed border-slate-200 bg-white px-3 py-4 text-[13px] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:col-span-2"
                    style={{ backgroundColor: continentStyle.soft }}
                  >
                    {isChinese ? "尚未标记地点。" : "No places marked yet."}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {selectedPlace &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] flex items-center justify-center overflow-hidden bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:px-5"
            onClick={closeModal}
          >
            <article
              className="flex w-[min(94vw,1120px)] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900"
              style={{
                height: "min(92dvh, 860px)",
                maxHeight: "calc(100dvh - 2rem)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-950">
                {currentPhoto ? (
                  <img
                    key={currentPhoto.src}
                    src={currentPhoto.src}
                    alt={isChinese ? currentPhoto.zhCaption : currentPhoto.caption}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-700 dark:text-slate-200">
                    <Camera size={38} strokeWidth={1.8} />
                    <div className="text-center">
                      <div className="text-[15px] font-semibold">
                        {isChinese ? "照片待补充" : "Photo to be added"}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                        {isChinese
                          ? "之后可以替换成你拍的照片"
                          : "This can be replaced with your own photo later"}
                      </div>
                    </div>
                  </div>
                )}
              {hasMultiplePhotos && (
                <>
                  <button
                    type="button"
                    aria-label={isChinese ? "上一张照片" : "Previous photo"}
                    title={isChinese ? "上一张" : "Previous"}
                    onClick={() => {
                      setAutoPlay(false);
                      showPreviousPhoto();
                    }}
                    className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
                  >
                    <ChevronLeft size={21} />
                  </button>
                  <button
                    type="button"
                    aria-label={isChinese ? "下一张照片" : "Next photo"}
                    title={isChinese ? "下一张" : "Next"}
                    onClick={() => {
                      setAutoPlay(false);
                      showNextPhoto();
                    }}
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
                  >
                    <ChevronRight size={21} />
                  </button>
                  <button
                    type="button"
                    aria-label={autoPlay ? (isChinese ? "暂停轮播" : "Pause slideshow") : (isChinese ? "自动轮播" : "Play slideshow")}
                    title={autoPlay ? (isChinese ? "暂停" : "Pause") : (isChinese ? "自动播放" : "Play")}
                    onClick={() => setAutoPlay((current) => !current)}
                    className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
                  >
                    {autoPlay ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                </>
              )}
              <button
                type="button"
                aria-label={isChinese ? "关闭" : "Close"}
                onClick={closeModal}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/85 dark:text-slate-100"
              >
                <X size={17} />
              </button>
            </div>
            <div className="w-full min-w-0 shrink-0 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {displayName(selectedPlace)}
                </h2>
                <span
                  className="shrink-0 text-[13px] font-semibold"
                  style={{ color: countryStyles[selectedPlace.country].color }}
                >
                  {displayCountry(selectedPlace)}
                </span>
              </div>
              {currentPhoto && (
                <div className="mt-1 flex items-center justify-between gap-3 text-[13px] text-slate-500 dark:text-slate-400">
                  <span>{isChinese ? currentPhoto.zhCaption : currentPhoto.caption}</span>
                  {hasMultiplePhotos && (
                    <span className="shrink-0 font-medium">
                      {photoIndex + 1} / {selectedPhotos.length}
                    </span>
                  )}
                </div>
              )}
              <p className="mt-2 text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
                {displayNote(selectedPlace)}
              </p>
            </div>
            </article>
          </div>,
          document.body,
        )}
    </main>
  );
};

export default Footprint;
