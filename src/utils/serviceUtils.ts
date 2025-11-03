export type ServiceSlug = 'web-development' | 'mobile-development' | 'web-security'

export const getReadableTitle = (title: string): string => {
  return title
    .replace('_', ' ')
    .replace('DEVELOPMENT', 'Development')
    .replace('MOBILE', 'Mobile')
    .replace('WEB', 'Web')
    .replace('SECURITY', 'Security')
}

export const getServiceExplanation = (slug: string): string => {
  const explanations: Record<ServiceSlug, string> = {
    'web-development':
      'Custom websites and web applications that work perfectly on all devices, from simple business sites to complex web platforms.',
    'mobile-development':
      'Mobile apps for iOS and Android that provide a seamless user experience and connect to your business systems.',
    'web-security':
      'Protecting your website and applications from hackers and data breaches through rigorous testing and security best practices.',
  }
  return explanations[slug as ServiceSlug] || ''
}
