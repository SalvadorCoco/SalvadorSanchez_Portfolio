---
slug: "r4fighting"
num: "03"
title: "R4 Fighting"
client: "R4F"
desc: "Plataforma full stack para una organización de torneos de juegos de lucha: panel interno para administradores y sitio público que muestra torneos, eventos y ganadores en tiempo real."
desc_en: "Full stack platform for a fighting-games tournament organization: an internal admin panel and a public site that shows tournaments, events and winners in real time."
problem: "R4F organiza torneos online de juegos de lucha (SF6, Tekken, etc.) y tiene potencial para crecer, pero no tenía forma de que gente nueva los encontrara: dependían solo de avisar por Instagram y Twitch. Alguien buscando \"torneos SF6\" no tenía cómo dar con ellos."
problem_en: "R4F organizes online fighting-game tournaments (SF6, Tekken, etc.) and has real growth potential, but had no way for new people to discover them: they relied only on announcing through Instagram and Twitch. Someone searching \"SF6 tournaments\" had no way to find them."
solution: "Un sitio público en Next.js que les da presencia y posicionamiento propios, más un panel interno construido con FilamentPHP que funciona como gestor de contenido: los admins cargan torneos, eventos y ganadores sin depender de mí, y esos datos se reflejan al instante en el front."
solution_en: "A public Next.js site that gives them their own presence and search visibility, plus an internal panel built with FilamentPHP that works as a content manager: admins load tournaments, events and winners without depending on me, and that data reflects instantly on the front."
context: "Mi primer proyecto full stack: front en Next.js consumiendo una API propia hecha con FilamentPHP (Laravel). El objetivo de fondo no es solo tener una web, sino que R4F se haga más conocido para poder ser invitados a eventos y ferias presenciales, donde llevan sus propios setups y stands."
context_en: "My first full stack project: a Next.js frontend consuming my own API built with FilamentPHP (Laravel). The underlying goal isn't just having a website — it's for R4F to become better known so they can get invited to in-person events and expos, where they bring their own setups and stands."
process: "Diseñé el panel de FilamentPHP pensado para que cualquier admin de R4F pueda cargar contenido sin conocimientos técnicos: torneos, eventos y ganadores. El front en Next.js consume esa API y refleja los cambios en tiempo real, así el sitio público siempre está actualizado sin que nadie tenga que tocar código."
process_en: "I designed the FilamentPHP panel so any R4F admin can load content without technical knowledge: tournaments, events and winners. The Next.js frontend consumes that API and reflects changes in real time, so the public site is always up to date without anyone touching code."
result: "R4F ahora tiene presencia propia y buscable en la web, y un equipo que puede mantenerla actualizada sin depender de un desarrollador para cada cambio. Sienta la base para que ganen visibilidad y puedan sumar apariciones en eventos y ferias."
result_en: "R4F now has its own searchable web presence, and a team that can keep it updated without depending on a developer for every change. It lays the groundwork for them to gain visibility and land appearances at events and expos."
tags: ["Next.js", "FilamentPHP", "Laravel", "Full Stack"]
links:
  - href: "https://r4fighting.vercel.app/"
    label: "↗ Ver en vivo"
    type: "live"
  - href: "https://github.com/SalvadorCoco/R4F-Front"
    label: "GitHub (Front)"
    type: "gh"
    inactive: true
  - href: "https://github.com/SalvadorCoco/R4F-Back"
    label: "GitHub (Back)"
    type: "gh"
    inactive: true
feature: "poster"
kicker: "Full stack · R4F"
kicker_en: "Full stack · R4F"
layers:
  - name: "Front"
    tech: "Next.js"
  - name: "Back"
    tech: "FilamentPHP · Laravel"
cover: "/images/projects/r4fighting/01.webp"
screenshots: []
---
