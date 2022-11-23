/**
 * Determines if the players nameflags have a GM flag enabled.
 *
 * @param {int} flags - The characters nameflags to test.
 * @return {bool} - True if a flag is present, false otherwise.
 */
export const hasGmFlag = function (flags: number): boolean {
  // GM - PlayOnline
  if ((flags & 0x00010000) == 0x00010000) return true;
  // GM - Standard GM
  if ((flags & 0x04000000) == 0x04000000) return true;
  // GM - Senior
  if ((flags & 0x05000000) == 0x05000000) return true;
  // GM - Lead
  if ((flags & 0x06000000) == 0x06000000) return true;
  // GM - Producer
  if ((flags & 0x07000000) == 0x07000000) return true;
  return false;
};

/**
 * Converts the linkshell color to a RGB value.
 *
 * @param {Number} color - The color code to convert.
 * @returns {String} - The converted color code.
 */
export const getLinkshellHtmlColor = (color: number | string): string => {
  if (!color || color === 0 || typeof color === 'string') {
    return 'transparent';
  }

  const r = ((color & 0x0f) << 4) + 0x0f;
  const g = (((color >> 0x04) & 0x0f) << 0x04) + 0x0f;
  const b = (((color >> 0x08) & 0x0f) << 0x04) + 0x0f;
  return `rgb(${r}, ${g}, ${b})`;
};
