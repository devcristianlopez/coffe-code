import type { Recipe } from '../types';

const NOW = Date.now();

export const SEED_RECIPES: Recipe[] = [
  // ── V60 ───────────────────────────────────────────────────────────────
  {
    id: 'a1b2c3d4-e5f6-4789-abcd-ef1234567890',
    name: 'V60 de James Hoffmann',
    method: 'v60',
    author: 'James Hoffmann',
    coffeeGrams: 15,
    waterGrams: 250,
    ratio: 16.7,
    temperature: 98,
    grindSize: 'medio-fina',
    description:
      'Receta clásica de James Hoffmann para V60. Un vertido lento y controlado que produce una taza limpia y equilibrada.',
    steps: [
      {
        id: 'hoffmann-bloom',
        order: 0,
        title: 'Bloom',
        duration: 45,
        instruction:
          'Vierte 45g de agua caliente en círculos concéntricos, asegurando que todo el café se humedezca. Deja reposar 45 segundos.',
        waterAmount: 45,
        action: 'bloom',
      },
      {
        id: 'hoffmann-pour1',
        order: 1,
        title: 'Primer vertido',
        duration: 45,
        instruction:
          'Vierte 100g de agua hasta alcanzar 145g totales. Mantén un flujo constante y evita verter directamente sobre el filtro.',
        waterAmount: 100,
        action: 'pour',
      },
      {
        id: 'hoffmann-pour2',
        order: 2,
        title: 'Segundo vertido',
        duration: 45,
        instruction:
          'Vierte 105g de agua hasta alcanzar 250g totales. Mantén el nivel de agua constante.',
        waterAmount: 105,
        action: 'pour',
      },
      {
        id: 'hoffmann-drain',
        order: 3,
        title: 'Drenar',
        duration: 45,
        instruction:
          'Espera a que termine de drenar el agua. El tiempo total de extracción debe ser de 2:30 a 3:00 minutos.',
        action: 'wait',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },
  {
    id: 'b2c3d4e5-f6a7-4890-bcde-f12345678901',
    name: '4:6 de Tetsu Kasuya',
    method: 'v60',
    author: 'Tetsu Kasuya',
    coffeeGrams: 20,
    waterGrams: 300,
    ratio: 15,
    temperature: 92,
    grindSize: 'medio-gruesa',
    description:
      'El famoso método 4:6 de Tetsu Kasuya, campeón mundial de Brewers Cup 2016. Divide el agua en dos fases para controlar dulzor y acidez.',
    steps: [
      {
        id: 'kasuya-pour1',
        order: 0,
        title: 'Primer vertido (40g)',
        duration: 45,
        instruction:
          'Vierte 40g de agua en el centro del café, expandiendo suavemente hacia afuera. Define el dulzor.',
        waterAmount: 40,
        action: 'pour',
      },
      {
        id: 'kasuya-pour2',
        order: 1,
        title: 'Segundo vertido (60g)',
        duration: 45,
        instruction:
          'Vierte 60g de agua hasta alcanzar 100g totales.',
        waterAmount: 60,
        action: 'pour',
      },
      {
        id: 'kasuya-pour3',
        order: 2,
        title: 'Tercer vertido (60g)',
        duration: 45,
        instruction:
          'Vierte 60g de agua hasta alcanzar 160g totales. Define la acidez.',
        waterAmount: 60,
        action: 'pour',
      },
      {
        id: 'kasuya-pour4',
        order: 3,
        title: 'Cuarto vertido (70g)',
        duration: 45,
        instruction:
          'Vierte 70g de agua hasta alcanzar 230g totales.',
        waterAmount: 70,
        action: 'pour',
      },
      {
        id: 'kasuya-pour5',
        order: 4,
        title: 'Quinto vertido (70g)',
        duration: 45,
        instruction:
          'Vierte 70g de agua hasta alcanzar 300g totales. Deja drenar completamente.',
        waterAmount: 70,
        action: 'pour',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },

  // ── Chemex ────────────────────────────────────────────────────────────
  {
    id: 'c3d4e5f6-a7b8-4901-cdef-123456789012',
    name: 'Chemex de James Hoffmann',
    method: 'chemex',
    author: 'James Hoffmann',
    coffeeGrams: 30,
    waterGrams: 500,
    ratio: 16.7,
    temperature: 96,
    grindSize: 'medio-gruesa',
    description:
      'Método de James Hoffmann para Chemex. Vertidos pausados que aprovechan el grosor del filtro para una taza limpia y brillante.',
    steps: [
      {
        id: 'chemex-bloom',
        order: 0,
        title: 'Bloom',
        duration: 45,
        instruction:
          'Vierte 90g de agua en círculos concéntricos. Deja reposar 45 segundos.',
        waterAmount: 90,
        action: 'bloom',
      },
      {
        id: 'chemex-pour1',
        order: 1,
        title: 'Primer vertido',
        duration: 30,
        instruction:
          'Vierte 150g de agua lentamente hasta alcanzar 240g totales.',
        waterAmount: 150,
        action: 'pour',
      },
      {
        id: 'chemex-wait1',
        order: 2,
        title: 'Pausa',
        duration: 30,
        instruction:
          'Espera 30 segundos a que baje el nivel de agua.',
        action: 'wait',
      },
      {
        id: 'chemex-pour2',
        order: 3,
        title: 'Segundo vertido',
        duration: 30,
        instruction:
          'Vierte 150g de agua hasta alcanzar 390g totales.',
        waterAmount: 150,
        action: 'pour',
      },
      {
        id: 'chemex-wait2',
        order: 4,
        title: 'Pausa',
        duration: 30,
        instruction:
          'Espera 30 segundos.',
        action: 'wait',
      },
      {
        id: 'chemex-pour3',
        order: 5,
        title: 'Tercer vertido',
        duration: 30,
        instruction:
          'Vierte los últimos 110g de agua hasta alcanzar 500g totales.',
        waterAmount: 110,
        action: 'pour',
      },
      {
        id: 'chemex-drain',
        order: 6,
        title: 'Drenar',
        duration: 60,
        instruction:
          'Deja que el agua drene completamente. El tiempo total debe ser de 4:00 a 4:30 minutos.',
        action: 'wait',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },

  // ── French Press ──────────────────────────────────────────────────────
  {
    id: 'd4e5f6a7-b8c9-4012-defa-234567890123',
    name: 'French Press de James Hoffmann',
    method: 'french-press',
    author: 'James Hoffmann',
    coffeeGrams: 30,
    waterGrams: 500,
    ratio: 16.7,
    temperature: 96,
    grindSize: 'gruesa',
    description:
      'El método definitivo para prensa francesa según James Hoffmann. Una inmersión larga que maximiza el sabor y minimiza los sólidos en suspensión.',
    steps: [
      {
        id: 'fp-add',
        order: 0,
        title: 'Añadir café y agua',
        duration: 10,
        instruction:
          'Añade 30g de café molido grueso y vierte 500g de agua a 96°C.',
        waterAmount: 500,
        action: 'pour',
      },
      {
        id: 'fp-steep1',
        order: 1,
        title: 'Inmersión inicial',
        duration: 240,
        instruction:
          'Deja reposar durante 4 minutos exactos. No remuevas ni tapes.',
        action: 'wait',
      },
      {
        id: 'fp-skim',
        order: 2,
        title: 'Romper costra',
        duration: 15,
        instruction:
          'Rompe la costra de café en la superficie con una cuchara. Remueve suavemente y retira la espuma y los granos flotantes.',
        action: 'stir',
      },
      {
        id: 'fp-steep2',
        order: 3,
        title: 'Inmersión final',
        duration: 300,
        instruction:
          'Espera 5 minutos más (tiempo total de 8 a 10 minutos). Esto permite que los sólidos se asienten.',
        action: 'wait',
      },
      {
        id: 'fp-press',
        order: 4,
        title: 'Presionar y servir',
        duration: 20,
        instruction:
          'Presiona el émbolo lenta y firmemente hasta el fondo. Sirve inmediatamente para evitar sobre-extracción.',
        action: 'press',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },

  // ── Moka ───────────────────────────────────────────────────────────────
  {
    id: 'e5f6a7b8-c9d0-4123-efab-345678901234',
    name: 'Moka Clásica Italiana',
    method: 'moka',
    author: 'Tradicional Italiano',
    coffeeGrams: 18,
    waterGrams: 180,
    ratio: 10,
    temperature: 100,
    grindSize: 'fina (como sal de mesa)',
    description:
      'La receta tradicional italiana para cafetera moka. Usar agua caliente al inicio evita que el café se queme y produce una extracción más suave.',
    steps: [
      {
        id: 'moka-water',
        order: 0,
        title: 'Calentar agua',
        duration: 30,
        instruction:
          'Llena la base con agua caliente (recién hervida) hasta justo debajo de la válvula de seguridad.',
        action: 'pour',
      },
      {
        id: 'moka-basket',
        order: 1,
        title: 'Llenar filtro',
        duration: 15,
        instruction:
          'Llena el portafiltro con café molido fino, nivelando con una cuchara. No presiones el café.',
        action: 'stir',
      },
      {
        id: 'moka-assemble',
        order: 2,
        title: 'Ensamblar',
        duration: 10,
        instruction:
          'Enrosca la parte superior firmemente. Coloca la moka a fuego medio-bajo.',
        action: 'wait',
      },
      {
        id: 'moka-brew',
        order: 3,
        title: 'Extracción',
        duration: 240,
        instruction:
          'Espera a que el café empiece a salir por la columna. Debe fluir suavemente. En cuanto empiece a burbujear (gorgoteo), retira del fuego.',
        action: 'wait',
      },
      {
        id: 'moka-serve',
        order: 4,
        title: 'Servir',
        duration: 10,
        instruction:
          'Remueve el café con una cuchara para homogeneizar y sirve inmediatamente.',
        action: 'serve',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },

  // ── Aeropress ──────────────────────────────────────────────────────────
  {
    id: 'f6a7b8c9-d0e1-4234-fabc-456789012345',
    name: 'Aeropress Clásico',
    method: 'aeropress',
    author: 'Clásico',
    coffeeGrams: 14,
    waterGrams: 200,
    ratio: 14.3,
    temperature: 80,
    grindSize: 'fina',
    description:
      'La receta clásica de Aeropress con agua a menor temperatura. Rápida, limpia y con una taza suave y brillante.',
    steps: [
      {
        id: 'aero-classic-filter',
        order: 0,
        title: 'Preparar filtro',
        duration: 10,
        instruction:
          'Coloca un filtro en el portafiltros, humedécelo con agua caliente y enrosca en la aeropress.',
        action: 'stir',
      },
      {
        id: 'aero-classic-add',
        order: 1,
        title: 'Añadir café',
        duration: 10,
        instruction:
          'Añade 14g de café molido fino. Nivela dando un golpe suave.',
        action: 'stir',
      },
      {
        id: 'aero-classic-pour',
        order: 2,
        title: 'Verter agua',
        duration: 15,
        instruction:
          'Vierte 200g de agua a 80°C. Empieza un cronómetro al comenzar a verter.',
        waterAmount: 200,
        action: 'pour',
      },
      {
        id: 'aero-classic-stir',
        order: 3,
        title: 'Remover',
        duration: 30,
        instruction:
          'Remueve vigorosamente durante 30 segundos.',
        action: 'stir',
      },
      {
        id: 'aero-classic-steep',
        order: 4,
        title: 'Reposar',
        duration: 30,
        instruction:
          'Deja reposar hasta completar 1 minuto total.',
        action: 'wait',
      },
      {
        id: 'aero-classic-press',
        order: 5,
        title: 'Prensar',
        duration: 30,
        instruction:
          'Presiona lentamente durante 30 segundos hasta escuchar el siseo final.',
        action: 'press',
      },
      {
        id: 'aero-classic-serve',
        order: 6,
        title: 'Servir',
        duration: 5,
        instruction:
          'Sirve y disfruta. Diluye con un poco de agua caliente si prefieres una taza más suave.',
        action: 'serve',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },
  {
    id: 'a7b8c9d0-e1f2-4345-abcd-567890123456',
    name: 'Aeropress Campeón Mundial 2023',
    method: 'aeropress',
    author: 'Campeonato Mundial',
    coffeeGrams: 18,
    waterGrams: 200,
    ratio: 11.1,
    temperature: 85,
    grindSize: 'media-fina',
    description:
      'Receta de estilo campeonato mundial para Aeropress. Método invertido con mayor dosis para una taza concentrada y compleja.',
    steps: [
      {
        id: 'aero-wc-invert',
        order: 0,
        title: 'Montaje invertido',
        duration: 10,
        instruction:
          'Coloca la aeropress en posición invertida (émbolo hacia abajo). Ajusta el émbolo en la marca 4.',
        action: 'stir',
      },
      {
        id: 'aero-wc-add',
        order: 1,
        title: 'Añadir café',
        duration: 10,
        instruction:
          'Añade 18g de café molido media-fina.',
        action: 'stir',
      },
      {
        id: 'aero-wc-pour',
        order: 2,
        title: 'Verter agua',
        duration: 15,
        instruction:
          'Vierte 200g de agua a 85°C. Inicia el cronómetro.',
        waterAmount: 200,
        action: 'pour',
      },
      {
        id: 'aero-wc-stir',
        order: 3,
        title: 'Remover suavemente',
        duration: 20,
        instruction:
          'Remueve suavemente 5 veces para asegurar una extracción uniforme.',
        action: 'stir',
      },
      {
        id: 'aero-wc-steep',
        order: 4,
        title: 'Reposar',
        duration: 90,
        instruction:
          'Deja reposar hasta 1:30 total desde el inicio del vertido.',
        action: 'wait',
      },
      {
        id: 'aero-wc-flip',
        order: 5,
        title: 'Voltear',
        duration: 5,
        instruction:
          'Coloca el filtro humedecido, enrosca el portafiltros y voltea cuidadosamente sobre la taza.',
        action: 'stir',
      },
      {
        id: 'aero-wc-press',
        order: 6,
        title: 'Prensar',
        duration: 30,
        instruction:
          'Presiona lenta y firmemente durante 30 segundos hasta escuchar el siseo.',
        action: 'press',
      },
      {
        id: 'aero-wc-serve',
        order: 7,
        title: 'Servir',
        duration: 5,
        instruction:
          'Sirve y disfruta. Opcionalmente diluye con 30-50g de agua caliente.',
        action: 'serve',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },

  // ── Espresso ───────────────────────────────────────────────────────────
  {
    id: 'b8c9d0e1-f2a3-4456-bcde-678901234567',
    name: 'Espresso Clásico 1:2',
    method: 'espresso',
    author: 'Tradicional Italiano',
    coffeeGrams: 18,
    waterGrams: 36,
    ratio: 2,
    temperature: 93,
    grindSize: 'fina (espresso)',
    description:
      'La receta italiana tradicional para espresso. Proporción 1:2 con extracción controlada para un espresso equilibrado con crema dorada.',
    steps: [
      {
        id: 'espresso-dose',
        order: 0,
        title: 'Dosificar y distribuir',
        duration: 15,
        instruction:
          'Muele 18g de café directamente en el portafiltro. Distribuye uniformemente con los dedos o una herramienta de distribución.',
        action: 'stir',
      },
      {
        id: 'espresso-tamp',
        order: 1,
        title: 'Prensar',
        duration: 10,
        instruction:
          'Presiona firmemente con un tamper nivelado. Aplica presión pareja y constante.',
        action: 'press',
      },
      {
        id: 'espresso-extract',
        order: 2,
        title: 'Extraer',
        duration: 28,
        instruction:
          'Inicia la extracción. Busca 36g de espresso en 27-30 segundos. La crema debe ser color avellana y fluir como miel.',
        waterAmount: 36,
        action: 'wait',
      },
      {
        id: 'espresso-serve',
        order: 3,
        title: 'Servir',
        duration: 5,
        instruction:
          'Detén la extracción al alcanzar 36g. Sirve inmediatamente.',
        action: 'serve',
      },
    ],
    isBuiltIn: true,
    createdAt: NOW,
  },
];
