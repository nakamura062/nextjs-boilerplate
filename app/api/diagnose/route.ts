import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { university, position, gakuchika, targetType } = await req.json();

  // AIへの指示（プロンプト）
  const prompt = `
    あなたは就活生の自己肯定感を最大化する天才キャリアアドバイザーです。
    以下の情報を元に、その学生がいかに素晴らしいか、特に「${targetType}において即戦力のS級人材である理由」を、
    熱く、ポジティブに、200文字程度でレビューしてください。
    
    大学名: ${university}
    役割: ${position}
    ガクチカ: ${gakuchika}
    
    条件：
    - 否定的なことは一切言わない。
    - 「あなたは${targetType === '中小企業' ? 'S' : 'A'}判定の逸材です」という言葉を混ぜる。
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ review: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "AI診断に失敗しました" }, { status: 500 });
  }
}