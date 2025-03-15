export function checkUrlAmazon(url) {
  const amazonRegex =
    /^https?:\/\/(www\.)?amazon\.com\/(?:[^\/]+\/)?dp\/[A-Z0-9]{10}(?:[\/?].*)?$/;
  return amazonRegex.test(url);
}
