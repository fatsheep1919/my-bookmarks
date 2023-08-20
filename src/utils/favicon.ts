export function faviconURL(u: string, size?: number) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", `${size || 20}`);
  return url.toString();
}