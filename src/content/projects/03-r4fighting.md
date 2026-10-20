---
slug: "r4fighting"
num: "03"
title: "R4 Fighting"
client: "R4F"
desc: "Sitio público y gestor administrativo para una organización de torneos de juegos de lucha."
desc_en: "Public site and admin panel for a fighting-game tournament organization."
role: "Frontend y backend"
role_en: "Frontend and backend"
integrations: ["Challonge", "Google Analytics 4"]
parts:
  - key: "public"
    title: "Sitio público"
    title_en: "Public site"
    stack: ["Next.js", "TypeScript"]
    text: "Sitio con torneos, eventos y Hall of Fame. Inscripción a torneos, contacto para locales y transmisiones de Twitch y Kick integradas."
    text_en: "Site with tournaments, events and a Hall of Fame. Tournament sign-up, a contact form for venues and embedded Twitch and Kick streams."
    shots:
      - src: "/images/projects/r4fighting/01.webp"
        label: "Inicio"
        label_en: "Home"
        w: 1584
        h: 834
      - src: "/images/projects/r4fighting/02.webp"
        label: "Hall of Fame"
        label_en: "Hall of Fame"
        w: 1584
        h: 834
  - key: "admin"
    title: "Gestor administrativo"
    title_en: "Admin panel"
    stack: ["PHP", "Laravel", "FilamentPHP"]
    text: "Panel para que el equipo de R4F cargue torneos, eventos, jugadores y posts sin tocar código. Los torneos se sincronizan con Challonge, los pedidos de bares llegan como leads con estado y un tablero resume la actividad."
    text_en: "Panel for the R4F team to manage tournaments, events, players and posts without touching code. Tournaments sync with Challonge, venue requests arrive as leads with a status, and a dashboard summarizes activity."
    shots:
      - src: "/images/projects/r4fighting/admin-torneo.webp"
        label: "Edición de un torneo"
        label_en: "Editing a tournament"
        w: 1584
        h: 1056
      - src: "/images/projects/r4fighting/admin-dashboard.webp"
        label: "Resumen del panel"
        label_en: "Panel overview"
        w: 1214
        h: 184
      - src: "/images/projects/r4fighting/admin-leads.webp"
        label: "Leads de bares"
        label_en: "Venue leads"
        w: 1584
        h: 834
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
screenshots:
  - "/images/projects/r4fighting/01.webp"
  - "/images/projects/r4fighting/02.webp"
  - "/images/projects/r4fighting/03.webp"
---
