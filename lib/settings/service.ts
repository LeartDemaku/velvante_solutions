import { prisma } from '@/lib/db/client';

export interface SiteSettings {
  siteName: string;
  notificationEmail: string;
  contactPhone: string;
  primaryLocation: string;
  primaryLocationSq: string;
}

export const defaultSettings: SiteSettings = {
  siteName: 'Velvante Solutions',
  notificationEmail: 'velvantesolutions@outlook.com',
  contactPhone: '+383 45 319 619',
  primaryLocation: 'Pristina, Kosovo',
  primaryLocationSq: 'Prishtinë, Kosovë',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const s = await prisma.systemSetting.findFirst();
    if (s) {
      return {
        siteName: s.siteName || defaultSettings.siteName,
        notificationEmail: s.notificationEmail || defaultSettings.notificationEmail,
        contactPhone: s.contactPhone || defaultSettings.contactPhone,
        primaryLocation: s.primaryLocation || defaultSettings.primaryLocation,
        primaryLocationSq: s.primaryLocationSq || defaultSettings.primaryLocationSq,
      };
    }
  } catch (err) {
    console.error('Failed to get site settings:', err);
  }
  return defaultSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const nextData = {
    siteName: data.siteName !== undefined ? String(data.siteName).trim() : current.siteName,
    notificationEmail: data.notificationEmail !== undefined ? String(data.notificationEmail).trim().toLowerCase() : current.notificationEmail,
    contactPhone: data.contactPhone !== undefined ? String(data.contactPhone).trim() : current.contactPhone,
    primaryLocation: data.primaryLocation !== undefined ? String(data.primaryLocation).trim() : current.primaryLocation,
    primaryLocationSq: data.primaryLocationSq !== undefined ? String(data.primaryLocationSq).trim() : (data.primaryLocation ? String(data.primaryLocation).trim() : current.primaryLocationSq),
  };

  const existing = await prisma.systemSetting.findFirst();
  let saved;
  if (existing) {
    saved = await prisma.systemSetting.update({
      where: { id: existing.id },
      data: nextData,
    });
  } else {
    saved = await prisma.systemSetting.create({
      data: {
        id: 'default',
        ...nextData,
      },
    });
  }

  return {
    siteName: saved.siteName,
    notificationEmail: saved.notificationEmail,
    contactPhone: saved.contactPhone,
    primaryLocation: saved.primaryLocation,
    primaryLocationSq: saved.primaryLocationSq,
  };
}
