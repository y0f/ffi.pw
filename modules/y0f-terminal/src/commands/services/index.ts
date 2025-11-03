import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const services = createCommand({
  name: 'services',
  description: 'List technical service offerings',
  category: CommandCategory.SERVICES,
  usage: 'services',

  execute: async () => {
    return [
      formatHeader('SERVICES'),
      formatDivider(),
      formatText('web-dev     - Full-stack development'),
      formatText('mobile-dev  - React Native solutions'),
      formatText('security    - Cybersecurity services'),
      formatEmptyLine(),
      formatHeader('Type the service name to see details'),
    ]
  },
})

export const webDev = createCommand({
  name: 'web-dev',
  description: 'Full-stack web development solutions',
  category: CommandCategory.SERVICES,
  usage: 'web-dev',

  execute: async () => {
    return [
      formatHeader('WEB DEVELOPMENT'),
      formatDivider(),
      formatText('End-to-end solutions from database to UI'),
      formatEmptyLine(),
      formatHeader('SERVICES:'),
      formatText('◈ Full-Stack Development'),
      formatText('  Complete solutions architecture | Laravel + React/Vue'),
      formatText('◈ Frontend Engineering'),
      formatText('  React/Vue SPAs | SSR | Design Systems | Tailwind'),
      formatText('◈ Backend Systems'),
      formatText('  APIs, workers, queues, microservices'),
      formatText('◈ CRM Integration'),
      formatText('  HubSpot automation | Custom workflows | Python scripting'),
      formatText('◈ Legacy Modernization'),
      formatText('  Codebase upgrades | Refactors | Platform rewrites'),
      formatEmptyLine(),
      formatHeader('TECH STACK:'),
      formatText('Frontend: React, Vue 3, Inertia.js, Next.js, Tailwind, TS'),
      formatText('Backend: Laravel, Node.js, Python, Go, PostgreSQL'),
      formatText('CRM: HubSpot API/integrations, Python automation, Custom forms'),
      formatText('Tooling: Custom Go executables, CLI daemons, API proxies'),
      formatEmptyLine(),
    ]
  },
})

export const mobileDev = createCommand({
  name: 'mobile-dev',
  description: 'Cross-platform mobile solutions',
  category: CommandCategory.SERVICES,
  usage: 'mobile-dev',

  execute: async () => {
    return [
      formatHeader('MOBILE DEVELOPMENT'),
      formatDivider(),
      formatText('Native-like performance with React Native'),
      formatEmptyLine(),
      formatHeader('SERVICES:'),
      formatText('◈ React Native Development'),
      formatText('  Cross-platform apps | Expo or bare workflow'),
      formatText('◈ API Integration'),
      formatText('  REST | GraphQL | Secure auth flows'),
      formatText('◈ Full Mobile Solutions'),
      formatText('  App + backend | CI/CD pipelines'),
      formatText('◈ App Store Readiness'),
      formatText('  iOS & Android publishing support'),
      formatEmptyLine(),
      formatHeader('FEATURES:'),
      formatText('✓ Offline-first architecture'),
      formatText('✓ Secure JWT/OAuth implementation'),
      formatText('✓ Real-time updates via WebSockets'),
      formatText('✓ Push Notifications (Expo / FCM)'),
      formatEmptyLine(),
    ]
  },
})

export const security = createCommand({
  name: 'security',
  description: 'Cybersecurity services',
  category: CommandCategory.SERVICES,
  usage: 'security',

  execute: async () => {
    return [
      formatHeader('SECURITY SERVICES'),
      formatDivider(),
      formatText('Enterprise-grade security solutions'),
      formatEmptyLine(),
      formatHeader('SERVICES:'),
      formatText('◈ Penetration Testing'),
      formatText('  Manual + tool-assisted auditing | Burp Suite, OWASP ZAP'),
      formatText('◈ Network Reconnaissance'),
      formatText('  Port scanning, service enumeration | Nmap'),
      formatText('◈ Secure Auth Systems'),
      formatText('  OAuth 2.0 | SSO | JWT | Multi-Tenant Auth'),
      formatText('◈ Code & Infra Audits'),
      formatText('  Secure-by-default configs | Secrets & tokens'),
      formatText('◈ API Security'),
      formatText('  Rate limiting | Token flows | Abuse protection'),
      formatEmptyLine(),
      formatHeader('METHODOLOGY:'),
      formatText('✓ OWASP Top 10 coverage'),
      formatText('✓ Secure SDLC implementation'),
      formatText('✓ Incident response planning'),
      formatText('✓ Compliance-ready documentation'),
      formatEmptyLine(),
    ]
  },
})
