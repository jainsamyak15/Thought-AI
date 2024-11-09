import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export const enhanceLogoPrompt = async (userPrompt) => {
  const messages = [
    {
      role: "system",
      content: `You are a creative assistant specializing in logo design, with a focus on creating professional, minimalistic logos that embody high-quality design principles. Your task is to refine a user prompt for an AI model that generates logos, ensuring that they reflect the sophistication and elegance of a professional graphic designer's work. The logo should prioritize simplicity, clean lines, and an abstract or symbol-based approach, completely avoiding any text, words, or letters. Provide an enhanced version of the user's prompt, emphasizing color schemes that are striking against dark backgrounds while maintaining a refined and modern aesthetic.`,
    },
    {
      role: "user",
      content: `The user provided this prompt: "${userPrompt}". Enhance it to include suggestions for a minimalistic design that communicates professionalism, timelessness, and visual impact. Focus on providing guidelines related to color palettes that work well with dark themes, while ensuring the logo retains a polished and high-end appearance. Aim for creativity and innovation without any textual elements in the logo design.`,
    },
  ];

  try {
    const response = await together.chat.completions.create({
      messages,
      model: "meta-llama/Llama-Vision-Free",
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1.2,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: false,
    });

    const enhancedPrompt = response.choices[0]?.message?.content.trim();
    if (enhancedPrompt) {
      console.log("Enhanced Prompt:", enhancedPrompt); // Log the enhanced prompt for debugging
      return enhancedPrompt;
    } else {
      throw new Error("Failed to enhance the prompt.");
    }
  } catch (error) {
    console.error("Error enhancing the prompt:", error);
    return userPrompt; // Return the original prompt if enhancement fails
  }
};
