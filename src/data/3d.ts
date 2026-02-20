// src/data/3d.ts

export interface Render {
  id: number;
  renderUrl: string;
  linkUrl: string;
  altText: string;
  text: string;}

const renders: Render[] = [
  {
    id: 0,
    renderUrl: '/models/Phone1.glb',
    linkUrl: '',
    altText: 'Elegancia, confianza y durabilidad.',
    text: 'iDwin',
  },
  {
    id: 1,
    renderUrl: '/models/Phone2.glb',
    linkUrl: '',
    altText: 'MÁS DE 250 CLIENTES SATISFECHOS',
    text: 'iDwin',
  },
  {
    id: 2,
    renderUrl: '/models/Phone3.glb',
    linkUrl: '',
    altText: 'MÁS DE 250 CLIENTES SATISFECHOS',
    text: 'iDwin',
  }
];

export function getRenders(): Render[] {
  return renders;
}