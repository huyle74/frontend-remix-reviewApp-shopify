export function checkUrlAmazon(url) {
  const amazonRegex =
    /^https?:\/\/(www\.)?amazon\.com\/(?:[^\/]+\/)?dp\/[A-Z0-9]{10}(?:[\/?].*)?$/;
  return amazonRegex.test(url);
}

export function checkUrlAliExpress(url) {
  const aliExpressRegex =
    /^https:\/\/(?:[a-z]{2}\.)?aliexpress\.com\/item\/\d+\.html(?:\?.*)?$/;

  return aliExpressRegex.test(url);
}

export function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname;

    if (hostname.includes("aliexpress")) return "AliExpress";
    if (hostname.includes("amazon")) return "Amazon";
    return "";
  } catch (e) {
    return "";
  }
}
