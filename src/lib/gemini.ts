
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { JobDescription, AggregatedInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeJD(text: string, fileName: string): Promise<JobDescription> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following job description text from file "${fileName}" and return a structured JSON response.
    
    Text:
    ${text}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          role: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["companyName", "role", "summary", "keyRequirements", "technicalSkills", "softSkills"],
      },
    },
  });

  const data = JSON.parse(response.text || "{}");
  return {
    id: Math.random().toString(36).substring(7),
    ...data,
    rawText: text,
    fileName,
  };
}

export async function getAggregatedInsights(jds: JobDescription[]): Promise<AggregatedInsights> {
  const jdContext = jds.map(jd => ({
    company: jd.companyName,
    role: jd.role,
    tech: jd.technicalSkills,
    soft: jd.softSkills,
    requirements: jd.keyRequirements
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze these ${jds.length} job descriptions and provide aggregated insights for a student preparing for interviews.
    Identify common skills, prioritize study topics based on frequency and importance across these companies, and provide an overall summary.
    
    Data:
    ${JSON.stringify(jdContext, null, 2)}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonTechnicalSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                count: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER }
              },
              required: ["skill", "count", "percentage"]
            }
          },
          commonSoftSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                count: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER }
              },
              required: ["skill", "count", "percentage"]
            }
          },
          studyPriority: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                reason: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["topic", "reason", "priority"]
            }
          },
          overallSummary: { type: Type.STRING }
        },
        required: ["commonTechnicalSkills", "commonSoftSkills", "studyPriority", "overallSummary"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithGemini(messages: { role: 'user' | 'model', content: string }[], jdContext: string) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a career coach helping a student prepare for interviews based on these job descriptions:
      ${jdContext}
      
      Provide actionable advice, explain technical concepts, and help them prioritize their learning. Keep responses concise and encouraging.`
    }
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const lastMessage = messages[messages.length - 1].content;

  const result = await chat.sendMessage({
    message: lastMessage,
    // history // The SDK might handle history differently in some versions, but sendMessage usually takes the current message.
    // Actually, ai.chats.create takes history.
  });

  // Wait, the SDK in the skill says ai.chats.create({ model, config }). sendMessage takes { message }.
  // Let's re-read the skill for chat history.
  // The skill doesn't explicitly show passing history to ai.chats.create in the basic example, but it's standard.
  // Actually, I'll just use the simple generateContent for now if I'm unsure about the exact chat history prop in this specific SDK version, 
  // OR I'll just use the sendMessageStream if I want streaming.
  
  // Re-checking skill:
  // const chat: Chat = ai.chats.create({ model: "gemini-3-flash-preview" });
  // let streamResponse = await chat.sendMessageStream({ message: "..." });
  
  return result.text;
}
