const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        // Initialize Gemini AI with API key from environment variables
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_api_key_here');
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    /**
     * Generate AI suggestions for task creation based on natural language input
     * @param {string} naturalLanguageInput - User's natural language description
     * @returns {Promise<Object>} - AI generated title and description
     */
    async generateTaskSuggestions(naturalLanguageInput) {
        try {
            const prompt = `
You are a helpful task management assistant. Based on the user's natural language input, generate a clear task title and structured description.

User Input: "${naturalLanguageInput}"

Please provide:
1. A clear, professional task title (2-8 words)
2. A structured description that explains what needs to be done (1-2 sentences)

Format your response as JSON:
{
    "title": "Clear Task Title",
    "description": "Structured description of what needs to be done."
}

Guidelines:
- Make the title concise and action-oriented
- Make the description specific and actionable
- Use professional language
- If the input is vague, make reasonable assumptions based on context
- Keep descriptions under 100 characters for better readability

Example:
Input: "follow up with designer"
Output: {
    "title": "Follow up with UI Designer",
    "description": "Send a Slack message to confirm wireframe delivery status."
}
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Try to parse JSON response
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedResponse = JSON.parse(jsonMatch[0]);
                    return {
                        success: true,
                        data: {
                            title: parsedResponse.title || this.generateFallbackTitle(naturalLanguageInput),
                            description: parsedResponse.description || this.generateFallbackDescription(naturalLanguageInput)
                        }
                    };
                }
            } catch (parseError) {
                console.log('JSON parsing failed, using fallback:', parseError.message);
            }

            // Fallback if JSON parsing fails
            return {
                success: true,
                data: {
                    title: this.generateFallbackTitle(naturalLanguageInput),
                    description: this.generateFallbackDescription(naturalLanguageInput)
                }
            };

        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                success: false,
                error: 'Failed to generate AI suggestions',
                fallback: {
                    title: this.generateFallbackTitle(naturalLanguageInput),
                    description: this.generateFallbackDescription(naturalLanguageInput)
                }
            };
        }
    }

    /**
     * Generate a fallback title when AI service fails
     * @param {string} input - Natural language input
     * @returns {string} - Fallback title
     */
    generateFallbackTitle(input) {
        // Simple fallback logic
        const words = input.toLowerCase().split(' ');
        const capitalizedWords = words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        );
        return capitalizedWords.join(' ');
    }

    /**
     * Generate a fallback description when AI service fails
     * @param {string} input - Natural language input
     * @returns {string} - Fallback description
     */
    generateFallbackDescription(input) {
        return `Complete the following task: ${input}`;
    }

    /**
     * Validate if the API key is properly configured
     * @returns {boolean} - True if API key is configured
     */
    isConfigured() {
        return process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here';
    }
}

module.exports = new AIService();
