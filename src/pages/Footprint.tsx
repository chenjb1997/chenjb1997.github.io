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
    | "Germany";
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
  if (place.country === "Canada" || place.country === "USA") {
    return "NorthAmerica";
  }
  if (
    place.country === "Spain" ||
    place.country === "Russia" ||
    place.country === "Turkey" ||
    place.country === "Germany"
  ) {
    return "Europe";
  }
  return "Africa";
};

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
    note: "Crescent Spring, Yardang landforms, and grottoes in the desert.",
    zhNote: "沙漠中的月牙泉、雅丹地貌与石窟记忆。",
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
    note: "Meetings, contests, and city walks.",
    zhNote: "会议、比赛和城市漫步。",
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
        caption: "Tiananmen Square in Beijing at dusk.",
        zhCaption: "傍晚的北京天安门广场。",
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
        src: "/footprint/tokyo-01.jpg",
        caption: "Tokyo Tower at night.",
        zhCaption: "夜色中的东京塔。",
      },
      {
        src: "/footprint/tokyo-02.jpg",
        caption: "Tokyo Tower from the street.",
        zhCaption: "街巷间望见东京塔。",
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
    note: "Harbor, skyline, and city light.",
    zhNote: "海港、天际线与城市灯火。",
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
    note: "A nearby big-city window.",
    zhNote: "身边的大城市窗口。",
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
    note: "University of Central Florida and lakeside skies.",
    zhNote: "中佛罗里达大学与湖边天空。",
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
    ],
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
    note: "Museums and monuments.",
    zhNote: "博物馆与纪念碑。",
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
          ).map((country) => ({
            country,
            places: continentPlaces.filter((place) => place.country === country),
          }));

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
                  countries.map(({ country, places: countryPlaces }) => {
                    const style = countryStyles[country];
                    return (
                      <article
                        key={`${continent}-${country}`}
                        className="border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
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
                          <span className="text-[12px] text-slate-500 dark:text-slate-400">
                            {countryPlaces.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {countryPlaces.map((place) => (
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
