import Together from 'together-ai';

interface PromptElements {
  designPrinciples: string[];
  visualStyles: string[];
  compositions: string[];
  aesthetics: string[];
  symbolism: string[];
  premium: string[];
  effects: string[];
  materials: string[];
}

export class PromptEngineer {
  private static elements: PromptElements = {
    designPrinciples: [
      'golden ratio harmony', 'dynamic balance', 'sacred geometry',
      'negative space mastery', 'visual weight distribution', 'modular grid system',
      'mathematical precision', 'optical perfection', 'gestalt principles'
    ],
    visualStyles: [
      'avant-garde minimalism', 'corporate futurism', 'timeless sophistication',
      'geometric abstraction', 'organic fluidity', 'brutalist elegance',
      'neo-modernist', 'premium reductionism', 'dynamic simplicity'
    ],
    compositions: [
      'asymmetric balance', 'radial harmony', 'golden spiral flow',
      'dynamic tension', 'sacred proportions', 'fibonacci sequence',
      'rule of thirds mastery', 'dynamic symmetry', 'modular scaling'
    ],
    aesthetics: [
      'ultra-premium finish', 'luxury materiality', 'dimensional depth',
      'light interaction', 'shadow interplay', 'textural richness',
      'visual hierarchy', 'contrast dynamics', 'tonal sophistication'
    ],
    symbolism: [
      'conceptual abstraction', 'metaphorical elements', 'symbolic resonance',
      'archetypal forms', 'cultural significance', 'universal symbols',
      'emotional triggers', 'psychological impact', 'brand storytelling'
    ],
    premium: [
      'luxury market positioning', 'high-end brand language', 'premium visual codes',
      'exclusive aesthetic', 'sophisticated appeal', 'upmarket presence',
      'elite brand identity', 'prestigious symbolism', 'refined elegance'
    ],
    effects: [
      'dimensional layering', 'subtle gradients', 'metallic accents',
      'light refraction', 'depth mapping', 'texture mapping',
      'environmental reflection', 'material simulation', 'optical illusion'
    ],
    materials: [
      'brushed metal', 'polished chrome', 'matte finish',
      'glass effect', 'ceramic texture', 'premium substrate',
      'marble essence', 'carbon fiber', 'precious materials'
    ]
  };

  private static async enhanceWithAI(basePrompt: string): Promise<string> {
    const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
    
    const systemPrompt = `You are an expert brand identity designer specializing in creating exceptional, premium-quality logos. Your expertise lies in transforming simple concepts into sophisticated, memorable brand marks that command premium value. Your task is to:

1. Analyze the brand essence and market positioning
2. Identify unique visual opportunities
3. Apply advanced design principles
4. Create distinctive, ownable visual elements
5. Ensure premium market differentiation

Transform the input into a detailed, premium logo design specification that justifies high-end pricing.`;

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-Vision-Free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transform this brand concept into a premium logo design specification: "${basePrompt}"` }
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || basePrompt;
  }

  private static getRandomElements(arr: string[], count: number): string[] {
    return arr.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  private static constructBasePrompt(concept: string): string {
    const principles = this.getRandomElements(this.elements.designPrinciples, 3);
    const styles = this.getRandomElements(this.elements.visualStyles, 2);
    const compositions = this.getRandomElements(this.elements.compositions, 2);
    const aesthetics = this.getRandomElements(this.elements.aesthetics, 3);
    const symbolism = this.getRandomElements(this.elements.symbolism, 2);
    const premium = this.getRandomElements(this.elements.premium, 2);
    const effects = this.getRandomElements(this.elements.effects, 2);
    const materials = this.getRandomElements(this.elements.materials, 2);

    return `Create an exceptional, premium-quality brand mark:

Brand Concept: ${concept}

Design Foundation:
- Ultra-premium brand identity
- Distinctive market positioning
- Sophisticated visual language
- Memorable brand mark
- Future-proof design system

Design Principles:
${principles.map(p => `- ${p}`).join('\n')}

Visual Style:
${styles.map(s => `- ${s}`).join('\n')}

Composition:
${compositions.map(c => `- ${c}`).join('\n')}

Premium Aesthetics:
${aesthetics.map(a => `- ${a}`).join('\n')}

Brand Symbolism:
${symbolism.map(s => `- ${s}`).join('\n')}

Market Positioning:
${premium.map(p => `- ${p}`).join('\n')}

Visual Effects:
${effects.map(e => `- ${e}`).join('\n')}

Material Language:
${materials.map(m => `- ${m}`).join('\n')}`;
  }

  public static async generateEnhancedPrompt(userPrompt: string): Promise<string> {
    const basePrompt = this.constructBasePrompt(userPrompt);
    const enhancedPrompt = await this.enhanceWithAI(basePrompt);
    
    return `${enhancedPrompt}

Technical Requirements:
- Ultra-high resolution (1024x1024)
- Vector-quality rendering
- Professional material simulation
- Premium color science
- Perfect contrast ratios
- High-end finish quality
- Sophisticated lighting
- Dimensional depth
- Premium market positioning

Negative prompt: text, words, letters, watermark, signature, low quality, blurry, pixelated, amateur, unprofessional, busy, cluttered, childish, cartoon, sketchy, hand-drawn, distorted, unbalanced, asymmetrical, poor composition, basic, generic, template-like, stock-image-like, dated, old-fashioned, trendy, gimmicky, complex, overwhelming, noisy, messy, unrefined, low-res, jpeg artifacts, compression artifacts, poorly drawn, bad anatomy, wrong proportions, extra limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, bad art`;
  }
}