import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const sendChatMessage = async (message: string, image?: string, context?: string) => {
  try {
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an expert AI farming assistant. Your name is FarmAI. You help farmers with:
        - Plant identification and disease diagnosis
        - Crop care recommendations
        - Weather-based farming advice
        - Market insights and pricing
        - Sustainable farming practices
        - Pest and disease management
        - Soil health and fertilization
        - Irrigation and water management
        
        Always provide practical, actionable advice. Be encouraging and supportive. If you're unsure about something, recommend consulting local agricultural experts. Keep responses concise but helpful.
        
        ${context || ''}`
      }
    ];

    if (image) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: message || 'Please analyze this image and provide farming advice.'
          },
          {
            type: 'image_url',
            image_url: {
              url: image
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
    });

    return {
      message: completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request right now. Please try again.",
      success: true
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return {
      message: "I'm experiencing technical difficulties. Please try again. In the meantime, I can help you with general farming advice, plant care, weather planning, or market insights.",
      success: false
    };
  }
};

export const identifyPlant = async (imageUrl: string) => {
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: 'system',
          content: `You are an expert plant identification specialist. Analyze plant images and provide:
          1. Plant name (scientific and common)
          2. Family/classification
          3. Health assessment
          4. Care instructions
          5. Common issues to watch for
          
          Format your response as JSON with these fields:
          {
            "name": "Plant name",
            "family": "Plant family",
            "confidence": 85,
            "description": "Brief description",
            "careInstructions": ["instruction1", "instruction2"],
            "commonIssues": ["issue1", "issue2"],
            "healthStatus": "healthy|disease|pest|nutrient"
          }`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please identify this plant and provide care recommendations.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        return JSON.parse(response);
      } catch {
        // If JSON parsing fails, return a structured response
        return {
          name: "Plant identification in progress",
          family: "Unknown",
          confidence: 70,
          description: response.substring(0, 200) + "...",
          careInstructions: ["Regular watering", "Adequate sunlight", "Well-draining soil"],
          commonIssues: ["Overwatering", "Pest infestation", "Nutrient deficiency"],
          healthStatus: "healthy"
        };
      }
    }
    
    throw new Error('No response received');
  } catch (error) {
    console.error('Plant identification error:', error);
    return {
      name: "Unable to identify plant",
      family: "Unknown",
      confidence: 0,
      description: "Please try again with a clearer image showing the plant's leaves and overall structure.",
      careInstructions: ["Ensure good lighting in photos", "Show clear leaf details", "Include multiple angles if possible"],
      commonIssues: ["Image quality", "Lighting conditions", "Plant clarity"],
      healthStatus: "healthy"
    };
  }
};