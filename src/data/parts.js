import { productImage } from './images'
const KINDS = {
  Процесори: 'cpu', Відеокарти: 'gpu', Накопичувачі: 'ssd', 'Материнські плати': 'motherboard', Памʼять: 'ram', Охолодження: 'cooler',
  Миші: 'mouse', Клавіатури: 'keyboard', Монітори: 'monitor', Гарнітури: 'headset', Килимки: 'mousepad', Вебкамери: 'webcam',
}
const withImage = (items) => items.map((i) => ({ ...i, image: productImage(i.id), kind: KINDS[i.category] }))

export const componentItems = withImage([
  { id: 'c1', category: 'Процесори', brand: 'Intel', name: 'Intel Core i9-14900K', info: '24 ядра, 6.0 GHz, LGA1700', price: 24999 },
  { id: 'c2', category: 'Відеокарти', brand: 'ASUS', name: 'ASUS GeForce RTX 4070 Ti Super', info: '16GB GDDR6X, Ada Lovelace', price: 39999 },
  { id: 'c3', category: 'Накопичувачі', brand: 'Samsung', name: 'Samsung 990 Pro 2TB', info: 'NVMe PCIe 4.0, 7450 MB/s', price: 6899 },
  { id: 'c4', category: 'Материнські плати', brand: 'ASUS', name: 'ASUS ROG Strix Z790-E', info: 'Intel Z790, DDR5, ATX', price: 14999 },
  { id: 'c5', category: 'Памʼять', brand: 'Kingston', name: 'Kingston Fury Beast 32GB', info: 'DDR5 6000 MHz, CL36', price: 5299 },
  { id: 'c6', category: 'Охолодження', brand: 'Noctua', name: 'Noctua NH-D15', info: 'Повітряне охолодження, 2 вентилятори', price: 4199 },
])
export const peripheralItems = withImage([
  { id: 'p1', category: 'Миші', brand: 'Logitech', name: 'Logitech G Pro X Superlight 2', info: 'Ігрова миша, чорна', price: 5499 },
  { id: 'p2', category: 'Клавіатури', brand: 'HyperX', name: 'HyperX Alloy Origins', info: 'Механічна, RGB, Red', price: 4599 },
  { id: 'p3', category: 'Монітори', brand: 'ASUS', name: 'ASUS TUF Gaming VG27AQ', info: '27", QHD, 165 Гц', price: 11999 },
  { id: 'p4', category: 'Гарнітури', brand: 'Razer', name: 'Razer BlackShark V2', info: 'Ігрова гарнітура, 7.1', price: 3799 },
  { id: 'p5', category: 'Килимки', brand: 'SteelSeries', name: 'SteelSeries QcK Heavy', info: 'Килимок XL', price: 1299 },
  { id: 'p6', category: 'Вебкамери', brand: 'Logitech', name: 'Logitech C920', info: 'Веб-камера Full HD', price: 2399 },
])
export const crypto = [
  { id: 'ton', net: 'TON', full: 'The Open Network', addr: 'UQCDRsuM8YD4Ztzq9G2DNL7gOSkJAKo1xKItVEV72iCaZARg' },
  { id: 'trc', net: 'TRC-20', full: 'TRON (TRC20)', addr: 'TEV6oBWSbhCX6RM2BeoMqnC8M6ffMwGgyW' },
  { id: 'erc', net: 'ERC-20', full: 'Ethereum (ERC20)', addr: '0x6202D3f502F508A06ea3eF011F393995B70222CE' },
]
