"use client";
import { useState } from "react";

export default function Home() {
  const [university, setUniversity] = useState("");
  const [position, setPosition] = useState("");
  const [gakuchika, setGakuchika] = useState("");
  const [targetType, setTargetType] = useState("中小企業");
  const [result, setResult] = useState<{ rank: string; review: string } | null>(null);

  const handleDiagnose = async () => {
    const rank = targetType === "中小企業" ? "S" : "A";
    
    try {
      // 👈 ログの「/api/診断」ではなく、英語の「/api/diagnose」に統一します
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ university, position, gakuchika, targetType }),
      });

      if (!response.ok) throw new Error("サーバーエラーが発生しました");

      const data = await response.json();
      setResult({ rank, review: data.review });

    } catch (error) {
      console.error("エラー:", error);
      alert("診断に失敗しました。Vercelのログを確認してください。");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-center mb-8 text-indigo-600">✨ 就活偏差値 爆上げ診断 ✨</h1>
        {!result ? (
          <div className="space-y-4">
            <input className="w-full p-3 border rounded" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="大学名" />
            <input className="w-full p-3 border rounded" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="学校での役割" />
            <textarea className="w-full p-3 border rounded h-32" value={gakuchika} onChange={(e) => setGakuchika(e.target.value)} placeholder="ガクチカ（頑張ったこと）" />
            <select className="w-full p-3 border rounded" value={targetType} onChange={(e) => setTargetType(e.target.value)}>
              <option value="中小企業">中小企業</option>
              <option value="大企業">大企業</option>
            </select>
            <button onClick={handleDiagnose} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg">診断して自信をつける！</button>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-9xl font-black text-red-500">{result.rank}</div>
            <div className="p-6 bg-indigo-50 rounded-xl border-l-8 border-indigo-500 text-left">
              <p className="whitespace-pre-wrap text-indigo-900 font-medium">{result.review}</p>
            </div>
            <button onClick={() => setResult(null)} className="text-slate-400 font-bold">← 入力画面に戻る</button>
          </div>
        )}
      </div>
    </main>
  );
}