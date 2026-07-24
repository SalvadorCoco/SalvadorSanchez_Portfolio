export interface ProjectLink {
  href: string;
  label: string;
  type: "live" | "gh" | "priv";
}

export interface ProjectDemo {
  label: string;
  label_en?: string;
  href?: string;
  pending?: boolean;
}

export interface Project {
  slug: string;
  num: string;
  title: string;
  client: string;
  year: string;
  desc: string;
  desc_en?: string;
  problem: string;
  problem_en?: string;
  solution: string;
  solution_en?: string;
  // Small highlighted stat shown as a badge on the card grid (e.g. usage metric)
  metric?: string;
  metric_en?: string;
  // Video/gallery walkthrough link; use `pending: true` while the asset isn't ready yet
  demo?: ProjectDemo;
  // Extended content for the project page
  context: string;
  context_en?: string;
  process: string;
  process_en?: string;
  result: string;
  result_en?: string;
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
    desc_en: "Official institutional website of the Municipality. Citizen access to procedures, news and services.",
    problem:
      "El portal anterior no tenía diseño responsive y concentraba decenas de accesos sin jerarquía visual: el vecino tenía que escanear una grilla enorme de botones para encontrar un trámite. Sin priorización entre lo informativo y lo transaccional.",
    problem_en:
      "The previous portal had no responsive design and packed dozens of entry points with no visual hierarchy: citizens had to scan a huge grid of buttons to find a procedure. No priority between informational and transactional content.",
    solution:
      "Rediseño completo con navegación jerarquizada, buscador integrado y asistente virtual. Los trámites más usados pasaron al primer scroll. Layout responsive sobre arquitectura de componentes en Next.js.",
    solution_en:
      "Full redesign with hierarchical navigation, integrated search and a virtual assistant. The most-used procedures moved to the first scroll. Responsive layout built on a Next.js component architecture.",
    metric: "+9.000 usuarios semanales",
    metric_en: "+9,000 weekly users",
    context:
      "La Municipalidad de Río Cuarto necesitaba modernizar su presencia digital. El portal anterior era lento, no funcionaba en celular y los ciudadanos abandonaban antes de completar sus trámites. Trabajé junto al equipo interno de sistemas.",
    context_en:
      "The Municipality of Río Cuarto needed to modernize its digital presence. The previous portal was slow, didn't work on mobile, and citizens would abandon before completing their procedures. I worked alongside the internal systems team.",
    process:
      "Relevé las secciones más visitadas y los puntos de abandono. Rediseñé la arquitectura de información priorizando los servicios más usados. El buscador y el asistente virtual fueron desarrollados por el equipo de back-end; yo me encargué del diseño y la integración del frontend.",
    process_en:
      "I surveyed the most visited sections and drop-off points. I redesigned the information architecture prioritizing the most-used services. The search engine and virtual assistant were built by the back-end team; I handled the design and frontend integration.",
    result:
      "Un portal que cualquier vecino puede usar desde el celular. Navegación clara, tiempos de carga reducidos y acceso directo a los trámites más frecuentes desde la home.",
    result_en:
      "A portal any citizen can use from their phone. Clear navigation, reduced load times, and direct access to the most frequent procedures from the homepage.",
    tags: ["Next.js", "SCSS", "Docker", "SSR"],
    links: [
      { href: "https://www.riocuarto.gob.ar/", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/awsgobriocuarto/gobierno-rio-cuarto-site", label: "GitHub", type: "gh" },
    ],
    cover: "/images/projects/portal-municipal/01.webp",
    screenshots: [
      "/images/projects/portal-municipal/01.webp",
      "/images/projects/portal-municipal/02.webp",
      "/images/projects/portal-municipal/03.webp",
    ],
  },
  {
    slug: "postas-pos",
    num: "02",
    title: "Postas · Sistema POS",
    client: "Postas (cliente privado)",
    year: "2023",
    desc: "Frontend de punto de venta para comercios. UI ágil para ventas, productos e inventario.",
    desc_en: "Point-of-sale frontend for retail. Agile UI for sales, products and inventory.",
    problem:
      "Caja ágil que el personal aprenda en minutos y funcione en táctil.",
    problem_en:
      "A fast register interface that staff could learn in minutes and works on touch screens.",
    solution:
      "Atajos de teclado, flujos simplificados y feedback visual inmediato.",
    solution_en:
      "Keyboard shortcuts, simplified flows and immediate visual feedback.",
    context:
      "Un comercio necesitaba reemplazar su sistema de caja por algo que el personal pudiera aprender rápido. El flujo de venta tenía que ser tan simple que alguien sin experiencia técnica pudiera operar sin errores desde el primer día.",
    context_en:
      "A business needed to replace their checkout system with something staff could learn quickly. The sales flow had to be so simple that someone without technical experience could operate without errors from day one.",
    process:
      "Mapeé el flujo de una venta completa y eliminé cada paso que no era necesario. Diseñé pensando en uso táctil (pantallas de caja) y agregué atajos de teclado para acelerar las operaciones repetitivas. El feedback visual fue clave: el cajero siempre sabe qué acaba de pasar.",
    process_en:
      "I mapped the complete sales flow and removed every unnecessary step. I designed for touch use (point-of-sale screens) and added keyboard shortcuts to speed up repetitive operations. Visual feedback was key: the cashier always knows what just happened.",
    result:
      "Sistema de caja que el equipo adoptó sin capacitación extensa. Flujo de venta rápido, con soporte táctil y errores casi nulos en operación diaria.",
    result_en:
      "A checkout system the team adopted without extensive training. Fast sales flow with touch support and near-zero errors in daily operation.",
    // TODO: reemplazar por el link real al video/galería del flujo de venta cuando esté grabado/exportado.
    demo: { label: "Demo del flujo de venta", label_en: "Sales flow demo", pending: true },
    tags: ["React", "JavaScript", "UI/UX"],
    links: [],
    private: true,
    cover: "/images/projects/postas-pos/01.png",
    screenshots: [
      "/images/projects/postas-pos/01.png",
      "/images/projects/postas-pos/02.png",
      "/images/projects/postas-pos/03.png",
    ],
  },
  {
    slug: "emos",
    num: "03",
    title: "EMOS · Sitio Institucional",
    client: "Empresa Municipal de Obras y Servicios · Río Cuarto",
    year: "2025",
    desc: "Comunicación institucional y acceso a servicios para vecinos de Río Cuarto.",
    desc_en: "Institutional communication and service access for citizens of Río Cuarto.",
    problem:
      "Sitio sin adaptación mobile, con los accesos a trámites mezclados entre contenido informativo. Pagar una factura o hacer un reclamo requería navegar entre secciones sin relación clara.",
    problem_en:
      "Site with no mobile adaptation, with procedure access points mixed in among informational content. Paying a bill or filing a complaint meant navigating between sections with no clear relationship.",
    solution:
      "Plataforma mobile-first en Next.js con los servicios (pago online, reclamos, cedulón digital) como eje de la página. Contenido institucional en segundo plano.",
    solution_en:
      "Mobile-first Next.js platform with the services (online payment, complaints, digital cedulón) as the page's focal point. Institutional content takes a back seat.",
    context:
      "EMOS es la empresa municipal que gestiona obras y servicios públicos de Río Cuarto. No tenían presencia online: los vecinos dependían de llamados telefónicos para cualquier consulta. El objetivo era simple: llevar esa información a la web de forma clara.",
    context_en:
      "EMOS is the municipal company that manages public works and services in Río Cuarto. They had no online presence: citizens depended on phone calls for any inquiry. The goal was simple: put that information on the web in a clear way.",
    process:
      "Definí las secciones clave junto al cliente: servicios, novedades, contacto y transparencia. Diseñé una estructura mobile-first porque la mayoría de los vecinos acceden desde el celular. Puse foco especial en la legibilidad y en reducir la cantidad de clics para llegar a la información.",
    process_en:
      "I defined the key sections with the client: services, news, contact and transparency. I designed a mobile-first structure because most citizens access from their phones. Special focus on readability and reducing the number of clicks to reach information.",
    result:
      "Sitio institucional limpio que permite a cualquier vecino conocer los servicios, leer novedades y contactar a la empresa desde cualquier dispositivo.",
    result_en:
      "A clean institutional site that lets any citizen learn about services, read news and contact the company from any device.",
    tags: ["Next.js", "SCSS", "JavaScript", "Docker"],
    links: [
      { href: "https://emos-site.vercel.app", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/gobderiocuarto/emos-site", label: "GitHub", type: "gh" },
    ],
    cover: "/images/projects/emos/01.webp",
    screenshots: [
      "/images/projects/emos/01.webp",
      "/images/projects/emos/02.webp",
      "/images/projects/emos/03.webp",
    ],
  },
  {
    slug: "estudio-juridico",
    num: "04",
    title: "Estudio Jurídico Agustín Sánchez",
    client: "Estudio Jurídico Sánchez",
    year: "2024",
    desc: "Web institucional para estudio de abogacía. Pensada para que cualquier persona con una consulta legal se informe y contacte al equipo sin barreras.",
    desc_en: "Institutional website for a law firm. Built so anyone with a legal question can get informed and contact the team without barriers.",
    problem:
      "El abogado necesitaba más canales de contacto con clientes y mostrar a su equipo. Sin presencia digital, muchas consultas se perdían.",
    problem_en:
      "The lawyer needed more contact channels and a way to showcase his team. Without a digital presence, many inquiries were lost.",
    solution:
      "Diseño limpio y fácil de leer con múltiples vías de contacto visibles. El objetivo: que la web venda el servicio y genere confianza desde el primer scroll.",
    solution_en:
      "Clean, easy-to-read design with multiple visible contact methods. Goal: the website sells the service and builds trust from the first scroll.",
    context:
      "Agustín Sánchez es abogado en Río Cuarto. Su estudio crecía por recomendaciones, pero no tenía forma de mostrar su trabajo ni de que potenciales clientes lo encontraran online. Necesitaba una web que transmitiera profesionalismo y que fuera fácil de usar para cualquier persona, independientemente de su familiaridad con la tecnología.",
    context_en:
      "Agustín Sánchez is a lawyer in Río Cuarto. His firm was growing through referrals, but he had no way to showcase his work or let potential clients find him online. He needed a website that conveyed professionalism and was easy to use for anyone, regardless of their technical familiarity.",
    process:
      "Trabajé con él para entender qué quería mostrar: sus áreas de práctica, su equipo y las formas de contacto. El diseño es intencional: tipografía clara, jerarquía visual fuerte y múltiples llamados a la acción para que quien llegue con una duda no tenga excusa para no escribir.",
    process_en:
      "I worked with him to understand what he wanted to show: his practice areas, his team, and contact methods. The design is intentional: clear typography, strong visual hierarchy and multiple calls to action so anyone who arrives with a question has no excuse not to reach out.",
    result:
      "Una web que funciona como carta de presentación profesional. Fácil de leer para cualquier persona, con su equipo visible y con contacto a un click de distancia.",
    result_en:
      "A website that works as a professional calling card. Easy to read for anyone, with his team visible and contact one click away.",
    tags: ["Next.js", "SCSS", "UI/UX"],
    links: [
      { href: "https://estudiojuridico-sanchez.com.ar/", label: "↗ Ver en vivo", type: "live" },
      { href: "https://github.com/SalvadorCoco/estudio-agustin-sanchez", label: "GitHub", type: "gh" },
    ],
    cover: "/images/projects/estudio-juridico/01.webp",
    screenshots: [
      "/images/projects/estudio-juridico/01.webp",
      "/images/projects/estudio-juridico/02.webp",
      "/images/projects/estudio-juridico/03.webp",
    ],
  },
];

export default projects;
