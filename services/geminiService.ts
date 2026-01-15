
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple in-memory cache to avoid redundant calls within the same session
const cache: Record<string, { data: string, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

async function withCache(cacheKey: string, fetchFn: () => Promise<string>): Promise<string> {
  const cached = cache[cacheKey];
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const result = await fetchFn();
    cache[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  } catch (error: any) {
    if (error?.message?.includes('429')) {
      return "AI分析请求频繁，请稍后再试。您的孩子目前状态良好，请继续保持。";
    }
    throw error;
  }
}

export async function getHealthInsight(data: any) {
  const cacheKey = `health_${JSON.stringify(data.eyeStatus.posture)}_${Math.floor(Date.now() / (1000 * 60 * 60))}`;
  
  return withCache(cacheKey, async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `分析以下儿童近视防控数据并给出专业建议（100字以内）：${JSON.stringify(data)}。请保持语气温和且专业。`,
        config: {
          temperature: 0.7,
        },
      });
      return response.text || "您的孩子今日用眼习惯良好，建议适当增加户外活动时间。";
    } catch (error: any) {
      console.error("AI Insight Error:", error);
      if (error?.message?.includes('429')) return "AI助手休息中（配额限制），建议参考历史健康报告。";
      return "暂时无法获取分析，请检查网络。";
    }
  });
}

export async function generateEncouragement(mood: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `生成一句给正在学习的孩子的鼓励话语。情境：${mood}。要求：充满童趣、温暖，长度在20字左右。`,
      config: {
        temperature: 0.9,
      },
    });
    return response.text || "宝贝加油，你专注的样子真好看！";
  } catch (error: any) {
    console.error("AI Encouragement Error:", error);
    return "小主人，休息一下，看看窗外的绿树吧！";
  }
}

export async function transformParentMessage(message: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个智能护眼机器人StarryEyes。将家长的这段话：“${message}” 转化成一段充满爱意、俏皮且容易被孩子接受的机器人语音文本。不要包含表情符号，直接输出文字。`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text || message;
  } catch (error: any) {
    console.error("Transform Message Error:", error);
    return message;
  }
}
