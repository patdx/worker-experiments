/**
 * get a UUID like value, but make it more HTML friendly by
 * always prefixing with a string character and removing hyphens
 */
export const getUuid = () => {
  return 'c' + crypto.randomUUID().replace(/-/g, '');
};
