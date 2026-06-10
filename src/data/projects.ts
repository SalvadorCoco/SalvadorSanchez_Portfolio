export interface ProjectLink {
  href: string;
  label: string;
  type: "live" | "gh" | "priv";
}

export interface Project {
  slug: string;
  num: string;
  title: string;
  client: string;
  year: string;
  desc: string;
  problem: string;
  solution: string;
  // Extended content for the project page
  context: string;
  process: string;
  result: string;
  tags: string[];
  links: ProjectLink[];
  private?: boolean;
  full?: boolean;
  // Images: drop files in public/images/projects/{slug}/
  // cover is shown on the card grid, screenshots on the project page
  cover: string;
  screenshots: string[];
}

const projects: Project[] = [
  {
    slug: "portal-municipal",
    num: "01",
    title: "Portal Municipal",
    client: "Municipalidad de Río Cuarto",
    year: "2025",
    desc: "Sitio institucional oficial de la Municipalidad. Acceso ciudadano a trámites, noticias y servicios.",
    problem:
      "Portal lento sin responsive. Los vecinos no encontraban los servicios digitales que necesitaban.",
    solution:
      "Rediseño completo con buscador integrado, asistente virtual y navegación clara para que cada vecino encuentre lo que necesita.",
    context:
      "La Municipalidad de Río Cuarto necesitaba modernizar su presencia digital. El portal anterior era lento, no funcionaba en celular y los ciudadanos abandonaban antes de completar sus trámites. Trabajé junto al equipo interno de sistemas.",
    process:
      "Relevé las secciones más visitadas y los puntos de abandono. Rediseñé la arquitectura de información priorizando los servicios más usados. El buscador y el asistente virtual fueron desarrollados por el equipo de back-end; yo me encargué del diseño y la integración del frontend.",
    result:
      "Un portal que cualquier vecino puede usar desde el celular. Navegación clara, tiempos de carga reducidos y acceso directo a los trámites más frecuentes desde la home.",
    tags: ["Next.js", "SCSS", "Docker", "SSR"],
    links: [
      { href: "https://www.riocuarto.gob.ar/", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/awsgobriocuarto/gobierno-rio-cuarto-site", label: "GitHub", type: "gh" },
    ],
    cover: "/images/projects/portal-municipal/01.webp",
    screenshots: [
      "/images/projects/portal-municipal/01.webp",
    ],
  },
  {
    slug: "emos",
    num: "02",
    title: "EMOS · Sitio Institucional",
    client: "Empresa Municipal de Obras y Servicios · Río Cuarto",
    year: "2025",
    desc: "Comunicación institucional y acceso a servicios para vecinos de Río Cuarto.",
    problem:
      "Sin presencia digital. Los vecinos no tenían forma de acceder a información de servicios ni contactar a la empresa.",
    solution:
      "Plataforma Next.js limpia, mobile-first y accesible. Foco en que cualquier persona encuentre lo que necesita sin fricción.",
    context:
      "EMOS es la empresa municipal que gestiona obras y servicios públicos de Río Cuarto. No tenían presencia online: los vecinos dependían de llamados telefónicos para cualquier consulta. El objetivo era simple: llevar esa información a la web de forma clara.",
    process:
      "Definí las secciones clave junto al cliente: servicios, novedades, contacto y transparencia. Diseñé una estructura mobile-first porque la mayoría de los vecinos acceden desde el celular. Puse foco especial en la legibilidad y en reducir la cantidad de clics para llegar a la información.",
    result:
      "Sitio institucional limpio que permite a cualquier vecino conocer los servicios, leer novedades y contactar a la empresa desde cualquier dispositivo.",
    tags: ["Next.js", "SCSS", "JavaScript", "Docker"],
    links: [
      { href: "https://emos-site.vercel.app", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/gobderiocuarto/emos-site", label: "GitHub", type: "gh" },
    ],
    cover: "",
    screenshots: [],
  },
  {
    slug: "estudio-juridico",
    num: "03",
    title: "Estudio Jurídico Agustín Sánchez",
    client: "Estudio Jurídico Sánchez",
    year: "2024",
    desc: "Web institucional para estudio de abogacía. Pensada para que cualquier persona con una consulta legal se informe y contacte al equipo sin barreras.",
    problem:
      "El abogado necesitaba más canales de contacto con clientes y mostrar a su equipo. Sin presencia digital, muchas consultas se perdían.",
    solution:
      "Diseño limpio y fácil de leer con múltiples vías de contacto visibles. El objetivo: que la web venda el servicio y genere confianza desde el primer scroll.",
    context:
      "Agustín Sánchez es abogado en Río Cuarto. Su estudio crecía por recomendaciones, pero no tenía forma de mostrar su trabajo ni de que potenciales clientes lo encontraran online. Necesitaba una web que transmitiera profesionalismo y que fuera fácil de usar para cualquier persona, independientemente de su familiaridad con la tecnología.",
    process:
      "Trabajé con él para entender qué quería mostrar: sus áreas de práctica, su equipo y las formas de contacto. El diseño es intencional: tipografía clara, jerarquía visual fuerte y múltiples llamados a la acción para que quien llegue con una duda no tenga excusa para no escribir.",
    result:
      "Una web que funciona como carta de presentación profesional. Fácil de leer para cualquier persona, con su equipo visible y con contacto a un click de distancia.",
    tags: ["Next.js", "SCSS", "UI/UX"],
    links: [
      { href: "https://estudiojuridico-sanchez.com.ar/", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/SalvadorCoco/estudio-agustin-sanchez", label: "GitHub", type: "gh" },
    ],
    cover: "",
    screenshots: [],
  },
  {
    slug: "postas-pos",
    num: "04",
    title: "Postas · Sistema POS",
    client: "Postas (cliente privado)",
    year: "2023",
    desc: "Frontend de punto de venta para comercios. UI ágil para ventas, productos e inventario.",
    problem:
      "Caja ágil que el personal aprenda en minutos y funcione en táctil.",
    solution:
      "Atajos de teclado, flujos simplificados y feedback visual inmediato.",
    context:
      "Un comercio necesitaba reemplazar su sistema de caja por algo que el personal pudiera aprender rápido. El flujo de venta tenía que ser tan simple que alguien sin experiencia técnica pudiera operar sin errores desde el primer día.",
    process:
      "Mapeé el flujo de una venta completa y eliminé cada paso que no era necesario. Diseñé pensando en uso táctil (pantallas de caja) y agregué atajos de teclado para acelerar las operaciones repetitivas. El feedback visual fue clave: el cajero siempre sabe qué acaba de pasar.",
    result:
      "Sistema de caja que el equipo adoptó sin capacitación extensa. Flujo de venta rápido, con soporte táctil y errores casi nulos en operación diaria.",
    tags: ["React", "JavaScript", "UI/UX"],
    links: [],
    private: true,
    full: true,
    cover: "",
    screenshots: [],
  },
];

export default projects;
