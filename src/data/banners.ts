// src/data/banners.ts

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  text: string;}

const banners: Banner[] = [
  {
    id: 0,
    imageUrl: '/banners/idwin_logo.png',
    linkUrl: '',
    altText: 'Elegancia, confianza y durabilidad.',
    text: 'iDwin',
  },
  {
    id: 1,
    imageUrl: '/banners/idwin_logo1.png',
    linkUrl: '',
    altText: 'Más de 250 clientes satisfechos en todo el Perú',
    text: 'iDwin',
  },
  // {
  //   id: 2,
  //   imageUrl: '/banners/2.webp',
  //   linkUrl: '',
  //   altText: 'Promotional Banner 2',
  // },  
  // {
  //   id: 3,
  //   imageUrl: '/banners/3.webp',
  //   linkUrl: '',
  //   altText: 'Promotional Banner 3',
  // },
  // {
  //   id: 4,
  //   imageUrl: '/banners/4.webp',
  //   linkUrl: '',
  //   altText: 'Promotional Banner 4',
  // },
  // {
  //   id: 5,
  //   imageUrl: '/banners/5.webp',
  //   linkUrl: '',
  //   altText: 'Promotional Banner 5',
  // }
];

export function getBanners(): Banner[] {
  return banners;
}