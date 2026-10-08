// Catálogo de ejemplo. Marcas y productos ficticios.
// kind → ilustración (ver ProductArt.vue) · hue → color base (0–360)

export const categories = [
  { id: 'tecnologia', name: 'Tecnología', icon: 'phone' },
  { id: 'electro', name: 'Electrodomésticos', icon: 'coffee' },
  { id: 'hogar', name: 'Hogar y muebles', icon: 'lamp' },
  { id: 'deportes', name: 'Deportes', icon: 'bike' },
  { id: 'moda', name: 'Moda', icon: 'sneaker' },
  { id: 'gaming', name: 'Gaming', icon: 'controller' },
]

const p = (o) => ({
  condition: 'new',
  freeShipping: true,
  installments: 6,
  stock: 12,
  colors: [o.hue, (o.hue + 200) % 360, 220],
  ...o,
  slug: o.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
})

export const products = [
  p({ id: 1, title: 'Smartphone Voltra X12 128 GB 8 GB RAM', brand: 'Voltra', category: 'tecnologia', kind: 'phone', hue: 225, price: 489999, oldPrice: 579999, rating: 4.7, reviews: 1284, sold: 5000, installments: 12, deal: true,
      specs: { Pantalla: '6,5" AMOLED 120 Hz', Almacenamiento: '128 GB', 'Memoria RAM': '8 GB', Cámara: '50 MP + 12 MP', Batería: '5000 mAh' } }),
  p({ id: 2, title: 'Notebook Aster Air 14" Ryzen 7 16 GB SSD 512 GB', brand: 'Aster', category: 'tecnologia', kind: 'laptop', hue: 210, price: 1249999, oldPrice: 1399999, rating: 4.8, reviews: 642, sold: 1000, installments: 12,
      specs: { Procesador: 'Ryzen 7 7735U', 'Memoria RAM': '16 GB', Almacenamiento: 'SSD 512 GB', Pantalla: '14" IPS 2.2K', Peso: '1,3 kg' } }),
  p({ id: 3, title: 'Auriculares inalámbricos Kumo Pro con cancelación de ruido', brand: 'Kumo', category: 'tecnologia', kind: 'headphones', hue: 265, price: 159999, oldPrice: 219999, rating: 4.6, reviews: 2311, sold: 10000, deal: true,
      specs: { Conexión: 'Bluetooth 5.3', Autonomía: '40 h', Cancelación: 'ANC híbrida', Peso: '250 g' } }),
  p({ id: 4, title: 'Smartwatch Lumen Fit 2 con GPS y monitor de sueño', brand: 'Lumen', category: 'tecnologia', kind: 'watch', hue: 160, price: 129999, rating: 4.4, reviews: 873, sold: 2500,
      specs: { Pantalla: '1,8" AMOLED', 'Resistencia al agua': '5 ATM', GPS: 'Sí', Batería: '10 días' } }),
  p({ id: 5, title: 'Parlante portátil Kumo Boom resistente al agua', brand: 'Kumo', category: 'tecnologia', kind: 'speaker', hue: 15, price: 74999, oldPrice: 89999, rating: 4.5, reviews: 1902, sold: 5000,
      specs: { Potencia: '30 W', Autonomía: '18 h', Protección: 'IP67', Conexión: 'Bluetooth 5.0' } }),
  p({ id: 6, title: 'Cámara mirrorless Aster M50 + lente 15-45 mm', brand: 'Aster', category: 'tecnologia', kind: 'camera', hue: 35, price: 899999, rating: 4.9, reviews: 211, sold: 500, installments: 12,
      specs: { Sensor: 'APS-C 24 MP', Video: '4K 30 fps', Lente: '15-45 mm', Estabilización: 'Digital' } }),

  p({ id: 7, title: 'Cafetera espresso Pampa Barista 15 bar', brand: 'Pampa', category: 'electro', kind: 'coffee', hue: 20, price: 219999, oldPrice: 259999, rating: 4.6, reviews: 534, sold: 1000, deal: true,
      specs: { Presión: '15 bar', Capacidad: '1,5 L', Espumador: 'Sí', Potencia: '1350 W' } }),
  p({ id: 8, title: 'Licuadora Pampa Power 1000 W vaso de vidrio 1,5 L', brand: 'Pampa', category: 'electro', kind: 'blender', hue: 140, price: 64999, rating: 4.3, reviews: 1120, sold: 5000,
      specs: { Potencia: '1000 W', Vaso: 'Vidrio 1,5 L', Velocidades: '5 + pulso' } }),
  p({ id: 9, title: 'Smart TV Voltra 55" 4K UHD Google TV', brand: 'Voltra', category: 'electro', kind: 'tv', hue: 230, price: 749999, oldPrice: 899999, rating: 4.7, reviews: 965, sold: 2500, installments: 12, deal: true,
      specs: { Tamaño: '55"', Resolución: '4K UHD', 'Sistema operativo': 'Google TV', HDR: 'HDR10+' } }),

  p({ id: 10, title: 'Lámpara de pie nórdica Norte con pantalla de lino', brand: 'Norte', category: 'hogar', kind: 'lamp', hue: 40, price: 89999, rating: 4.5, reviews: 312, sold: 500, freeShipping: false,
      specs: { Altura: '160 cm', Material: 'Madera y lino', Lámpara: 'E27 (no incluida)' } }),
  p({ id: 11, title: 'Silla ergonómica Norte Pro con soporte lumbar', brand: 'Norte', category: 'hogar', kind: 'chair', hue: 200, price: 279999, oldPrice: 329999, rating: 4.6, reviews: 744, sold: 1000,
      specs: { Respaldo: 'Malla transpirable', 'Peso máximo': '120 kg', Apoyabrazos: '3D', Garantía: '2 años' } }),
  p({ id: 12, title: 'Set x4 tazas de cerámica artesanal Norte', brand: 'Norte', category: 'hogar', kind: 'mug', hue: 180, price: 32999, rating: 4.8, reviews: 189, sold: 500, freeShipping: false, installments: 3,
      specs: { Capacidad: '350 ml', Material: 'Cerámica esmaltada', 'Apto lavavajillas': 'Sí' } }),
  p({ id: 13, title: 'Planta Monstera deliciosa con maceta de cerámica', brand: 'Verde Casa', category: 'hogar', kind: 'plant', hue: 130, price: 45999, rating: 4.4, reviews: 97, sold: 100, freeShipping: false, installments: 3,
      specs: { Altura: '60–70 cm', Maceta: 'Cerámica 20 cm', Luz: 'Indirecta' } }),

  p({ id: 14, title: 'Bicicleta urbana Rodada 28" cuadro de aluminio 21 vel.', brand: 'Rodada', category: 'deportes', kind: 'bike', hue: 0, price: 549999, oldPrice: 619999, rating: 4.7, reviews: 402, sold: 1000, installments: 12,
      specs: { Rodado: '28"', Cuadro: 'Aluminio', Cambios: '21 velocidades', Frenos: 'Disco mecánico' } }),
  p({ id: 15, title: 'Set mancuernas ajustables 2 a 20 kg', brand: 'Atlas', category: 'deportes', kind: 'dumbbell', hue: 220, price: 189999, rating: 4.5, reviews: 655, sold: 2500, deal: true, oldPrice: 239999,
      specs: { Peso: '2 a 20 kg c/u', Ajuste: 'Selector rápido', Material: 'Acero y PVC' } }),
  p({ id: 16, title: 'Botella térmica Atlas 1 L acero inoxidable', brand: 'Atlas', category: 'deportes', kind: 'bottle', hue: 190, price: 27999, rating: 4.8, reviews: 3410, sold: 10000, installments: 3,
      specs: { Capacidad: '1 L', Frío: '24 h', Calor: '12 h' } }),

  p({ id: 17, title: 'Zapatillas running Aire Run 3 hombre', brand: 'Aire', category: 'moda', kind: 'sneaker', hue: 350, price: 139999, oldPrice: 169999, rating: 4.6, reviews: 1532, sold: 5000, deal: true,
      specs: { Uso: 'Running', Suela: 'Goma de alta tracción', Capellada: 'Mesh transpirable', Drop: '8 mm' } }),
  p({ id: 18, title: 'Mochila urbana Norte 25 L porta notebook 15,6"', brand: 'Norte', category: 'moda', kind: 'backpack', hue: 25, price: 69999, rating: 4.7, reviews: 821, sold: 2500,
      specs: { Capacidad: '25 L', Notebook: 'Hasta 15,6"', Material: 'Poliéster repelente al agua' } }),
  p({ id: 19, title: 'Remera oversize algodón peinado unisex', brand: 'Aire', category: 'moda', kind: 'tshirt', hue: 250, price: 18999, rating: 4.4, reviews: 2104, sold: 10000, freeShipping: false, installments: 3,
      specs: { Material: '100% algodón peinado 24/1', Calce: 'Oversize', Talles: 'S a XXL' } }),
  p({ id: 20, title: 'Anteojos de sol polarizados Lumen Classic', brand: 'Lumen', category: 'moda', kind: 'glasses', hue: 45, price: 49999, oldPrice: 59999, rating: 4.3, reviews: 276, sold: 500, installments: 3,
      specs: { Lentes: 'Polarizadas UV400', Armazón: 'Acetato', Estuche: 'Incluido' } }),

  p({ id: 21, title: 'Joystick inalámbrico Voltra Pad para PC y consola', brand: 'Voltra', category: 'gaming', kind: 'controller', hue: 275, price: 59999, oldPrice: 74999, rating: 4.5, reviews: 1673, sold: 5000, deal: true,
      specs: { Conexión: 'Bluetooth / USB-C', Batería: '20 h', Compatibilidad: 'PC, Android, consolas' } }),
  p({ id: 22, title: 'Teclado mecánico Kumo TKL RGB switches red', brand: 'Kumo', category: 'gaming', kind: 'keyboard', hue: 300, price: 84999, rating: 4.7, reviews: 932, sold: 2500,
      specs: { Formato: 'TKL 87 teclas', Switches: 'Red lineales', Iluminación: 'RGB por tecla', Conexión: 'USB-C' } }),
  p({ id: 23, title: 'Monitor gamer Aster 27" QHD 165 Hz 1 ms', brand: 'Aster', category: 'gaming', kind: 'monitor', hue: 195, price: 399999, oldPrice: 459999, rating: 4.8, reviews: 507, sold: 1000, installments: 12,
      specs: { Tamaño: '27"', Resolución: '2560 x 1440', Frecuencia: '165 Hz', Panel: 'IPS' } }),
  p({ id: 24, title: 'Mouse gamer Kumo Glide 26000 DPI ultraliviano', brand: 'Kumo', category: 'gaming', kind: 'mouse', hue: 120, price: 45999, rating: 4.6, reviews: 1188, sold: 5000, installments: 3,
      specs: { Sensor: '26000 DPI', Peso: '58 g', Conexión: 'Inalámbrico 2.4 GHz' } }),
]

export const descriptions = {
  default: 'Producto nuevo, con garantía oficial del fabricante. Diseñado para durar y pensado para el uso diario. Enviamos a todo el país y podés devolverlo gratis dentro de los 30 días si no es lo que esperabas.',
}

export const getProduct = (id) => products.find((x) => x.id === Number(id))
export const discount = (x) => (x.oldPrice ? Math.round((1 - x.price / x.oldPrice) * 100) : 0)
export const money = (n) => '$ ' + Math.round(n).toLocaleString('es-AR')
