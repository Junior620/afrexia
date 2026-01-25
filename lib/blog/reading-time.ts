/**
 * Calculate reading time for blog post content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: any[]): number {
  if (!content || !Array.isArray(content)) {
    return 1;
  }

  // Extract text from portable text blocks
  const text = content
    .filter((block) => block._type === 'block')
    .map((block) => {
      if (block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join(' ');
      }
      return '';
    })
    .join(' ');

  // Count words
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate reading time (200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  return readingTime > 0 ? readingTime : 1;
}
