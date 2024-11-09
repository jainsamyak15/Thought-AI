// src/utils/enhancePrompt.ts

const enhanceLogoPrompt = (prompt: string): string => {
  const designStyles = [
    'minimalist', 'abstract', 'geometric', 'organic', 'futuristic',
    'retro', 'hand-drawn', 'typography-based', 'symbol-based', 'dynamic'
  ];
  
  const designPrinciples = [
    'innovative', 'memorable', 'scalable', 'versatile', 'simple yet meaningful',
    'unique silhouette', 'clever concept', 'balanced composition'
  ];

  const colorStrategies = [
    'monochromatic', 'complementary colors', 'analogous colors', 'triadic colors', 
    'gradient', 'black and white with an accent color'
  ];

  const getRandomElements = (arr: string[], count: number) => 
    arr.sort(() => 0.5 - Math.random()).slice(0, count).join(', ');

  const style = getRandomElements(designStyles, 2);
  const principles = getRandomElements(designPrinciples, 3);
  const colorStrategy = getRandomElements(colorStrategies, 1);

  return `Design an original, innovative logo for: ${prompt}.
Style: ${style}.
Design principles: ${principles}.
Color strategy: ${colorStrategy}.

Create a unique and original logo that captures the essence of a ${prompt}. The logo should be innovative and memorable, drawing inspiration from the impact of famous logos without copying or closely imitating any existing designs.

Key requirements:
1. Originality: The logo must be completely original. Do not reproduce or closely imitate any existing logos, especially those of well-known brands.
2. Relevance: Ensure the design clearly relates to the concept of a ${prompt}.
3. Simplicity: Aim for a clean, uncluttered design that's easily recognizable even at small sizes.
4. Versatility: The logo should work well in both color and monochrome, and be scalable for various applications.
5. Meaning: Incorporate clever symbolism or visual metaphors that relate to the service.

Design approach:
- Start with the core concept of a ${prompt}. What visual elements or metaphors could represent this uniquely?
- Consider abstract or geometric forms that could symbolize the key aspects of the service.
- Experiment with negative space to create dual imagery if appropriate.
- If using text, integrate it seamlessly with graphical elements.
- Ensure the color scheme enhances the concept and mood of the service.

Remember, the goal is to create a logo as impactful and innovative as famous logos, but entirely unique to this ${prompt}. Avoid any direct references to existing brands or their visual styles.`;
};

const enhanceBannerPrompt = (prompt: string): string => {
  const keywords = [
    'eye-catching', 'vibrant', 'cohesive', 'balanced', 'on-brand',
    'engaging', 'modern', 'clean', 'dynamic', 'impactful',
    'storytelling', 'harmonious', 'striking', 'professional', 'polished',
    'inviting', 'attention-grabbing', 'themed', 'consistent', 'visually appealing'
  ];
  const randomKeywords = getRandomKeywords(keywords, 4);
  
  return `Create a visually striking banner for ${prompt}. Style: ${randomKeywords.join(', ')}. The banner should be eye-catching and representative of the brand or service, without including any social media logos or interface elements. Focus on creating a design that is:

  1. Relevant to the ${prompt} concept
  2. Visually appealing with a cohesive color scheme
  3. Clean and uncluttered
  4. Suitable for use as a social media banner (but not specific to any platform)
  5. Engaging and professional-looking

  Do not include any text, logos, or user interface elements in the image. The design should work well as a standalone banner for any social media platform or website header.`;
};

const enhanceTaglinePrompt = (prompt: string): string => {
  const keywords = [
    'catchy', 'memorable', 'concise', 'impactful', 'clever',
    'emotive', 'brand-centric', 'benefit-focused', 'unique', 'inspiring',
    'persuasive', 'rhythmic', 'alliterative', 'witty', 'powerful'
  ];
  const randomKeywords = getRandomKeywords(keywords, 3);
  return `Generate 5 unique taglines for: ${prompt}. Style: ${randomKeywords.join(', ')}. 

Create short, memorable phrases that capture the essence of the brand or product. Each tagline should be:
- No more than 5-7 words
- Easy to understand
- Emotionally resonant
- Unique and memorable
- Aligned with brand values

Provide exactly 5 taglines, each on a new line. Do not include any numbering, explanations, or additional text.`;
};

const getRandomKeywords = (keywords: string[], count: number): string[] => {
  return keywords.sort(() => 0.5 - Math.random()).slice(0, count);
};

export { enhanceLogoPrompt, enhanceBannerPrompt, enhanceTaglinePrompt };