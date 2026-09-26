import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'sq')) {
    locale = routing.defaultLocale;
  }

  const [common, navigation, home, services, projects, blog, contact, about, footer, forms, errors] = await Promise.all([
    import(`../../locales/${locale}/common.json`),
    import(`../../locales/${locale}/navigation.json`),
    import(`../../locales/${locale}/home.json`),
    import(`../../locales/${locale}/services.json`),
    import(`../../locales/${locale}/projects.json`),
    import(`../../locales/${locale}/blog.json`),
    import(`../../locales/${locale}/contact.json`),
    import(`../../locales/${locale}/about.json`),
    import(`../../locales/${locale}/footer.json`),
    import(`../../locales/${locale}/forms.json`),
    import(`../../locales/${locale}/errors.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      navigation: navigation.default,
      home: home.default,
      services: services.default,
      projects: projects.default,
      blog: blog.default,
      contact: contact.default,
      about: about.default,
      footer: footer.default,
      forms: forms.default,
      errors: errors.default,
    },
  };
});
