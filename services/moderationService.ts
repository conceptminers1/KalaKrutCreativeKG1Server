
export const FORBIDDEN_TERMS = ['illicit', 'foul', 'badword', 'hate', 'scam', 'violence', 'illegal', 'fraud', 'terror', 'metaverse', 'nft_scam', 'rugpull', 'darkweb', 'xxx', 'nsfw'];

/**
 * Checks text content for forbidden terms.
 * Returns true if a violation is found.
 */
export const checkContentForViolation = (text: string): boolean => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.some(term => lower.includes(term));
};

export const MODERATION_WARNING_TEXT = "Zero Tolerance Policy: Content is monitored by AI. Use of illicit, foul, or hateful language/content (text, audio, video, NFT) will result in an IMMEDIATE ACCOUNT BLOCK subject to appeal.";
