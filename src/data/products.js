export const products = [
  {
    id: 'terminator-lite',
    cpu: 'AMD Ryzen 5',
    gpu: 'RTX 3060',
    name: 'TERMINATOR-lite',
    image: '/images/pc-terminator.png',
    price: 35999,
    title: 'Ігровий Ryzen™ 5 5500 RTX 3060 16Gb',
    card: [
      'CPU: Ryzen™ 5 5500',
      'GPU: GeForce RTX 3060 12GB',
      'RAM: 16GB DDR4',
      'Storage: 1Tb SSD',
    ],
    specs: [
      ['Відеокарта', 'GeForce RTX 3060 12GB'],
      ['Процесор', 'Ryzen™ 5 5500F'],
      ['Кількість ядер', '10 ядер'],
      ['Кількість потоків', '12'],
      ['Обʼєм памʼяті ОЗП', '16 ГБ'],
    ],
  },
  {
    id: 'jag-panzer',
    cpu: 'Intel Core i5',
    gpu: 'RTX 3060',
    name: 'JAG-PANZER',
    image: '/images/pc-jag-panzer.png',
    price: 45999,
    title: 'Ігровий i5 14400F RTX 3060 32Gb',
    card: [
      'CPU: Core™ i5 14400F',
      'GPU: GeForce RTX 3060 12GB',
      'RAM: 32GB DDR4',
      'Storage: 2Tb SSD',
    ],
    specs: [
      ['Відеокарта', 'GeForce RTX 3060 12GB'],
      ['Процесор', 'Core™ i5 14400F'],
      ['Кількість ядер', '10 ядер'],
      ['Кількість потоків', '16'],
      ['Обʼєм памʼяті ОЗП', '32 ГБ'],
    ],
  },
];
export const ramOptions = [
  { label: 'Базова ОЗП (+0 грн)', price: 0 },
  { label: 'Більше ОЗП (+2000 грн)', price: 2000 },
  { label: 'Максимум ОЗП (+5000 грн)', price: 5000 },
];
export const hddOptions = [
  { label: 'Без HDD', price: 0 },
  { label: '1TB HDD (+1500 грн)', price: 1500 },
  { label: '2TB HDD (+2800 грн)', price: 2800 },
];
export const formatPrice = (n) => n.toLocaleString('uk-UA') + ' грн';
