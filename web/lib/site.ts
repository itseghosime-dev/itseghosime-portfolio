export const SITE_NAME = "ITSEGHOSIME";
export const SITE_URL = "https://itseghosime.com";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
