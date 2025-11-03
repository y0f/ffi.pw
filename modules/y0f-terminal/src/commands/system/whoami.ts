import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatDivider, formatText, formatEmptyLine } from '../../core/formatters'

export const whoami = createCommand({
  name: 'whoami',
  description:
    'Learn about my professional background, technical skills, and development expertise',
  category: CommandCategory.SYSTEM,
  usage: 'whoami',

  execute: async () => {
    return [
      formatHeader('FULL-STACK DEVELOPER & SECURITY SPECIALIST'),
      formatDivider(),
      formatText('Hello, my name is Jon!'),
      formatText(
        "I've spend over a decade building secure, performant systems. I work across the stack - frontend, backend, and security - with a focus on reliability and maintainability.",
      ),
      formatDivider(),
      formatEmptyLine(),
      formatHeader('STACK & TOOLS:'),
      formatText('◈ VILT Stack (Vue + Inertia + Laravel + Tailwind)'),
      formatText('◈ TALL Stack (Tailwind + Alpine + Laravel + Livewire)'),
      formatText('◈ React + Laravel REST APIs'),
      formatText('◈ React Native + Expo for mobile'),
      formatText('◈ Go for backend tooling, API proxies, CLI daemons, custom executables'),
      formatText('◈ Python for CRM automation (HubSpot, internal ops)'),
      formatText('◈ HubSpot integrations (API, CRM extensions, workflows)'),
      formatText('◈ Docker, Bash, and CI/CD for devops'),
      formatEmptyLine(),
      formatHeader('SECURITY:'),
      formatText('◈ Web app pentesting (Burp Suite, OWASP ZAP, manual methods)'),
      formatText('◈ Network scanning & reconnaissance (Nmap, enumeration)'),
      formatText('◈ Secure auth (OAuth 2.0, JWT, SSO)'),
      formatText('◈ OWASP-based auditing & hardening'),
      formatText('◈ API security, rate limiting, token flows'),
      formatEmptyLine(),
      formatHeader("Explore my services by typing 'services'"),
      formatDivider(),
    ]
  },
})
