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
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 👈 AIが読み取るために絶対必要な1行！
        },
        body: JSON.stringify({ university, position, gakuchika, targetType }),
      });

      const data = await response.json();
      setResult({ rank, review: data.review });
    } catch (error) {
      console.error("エラーです:", error);
    }
  };
      
      if (data.review) {
        setResult({ rank, review: data.review });
      } else {
        alert("AIからの回答が空でした。もう一度試してください。");
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert("通信に失敗しました。インターネット接続やAPIの設定を確認してください。");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black text-center mb-8 text-indigo-600">
          ✨ 就活偏差値 爆上げ診断 ✨
        </h1>
        
        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">大学名</label>
              <input className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="例：岩手県立大学" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">今までの学校でのポジション</label>
              <input className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="例：ボランティア団体の代表" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">学生時代頑張ってきたこと（ガクチカ）</label>
              <textarea className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none h-32" value={gakuchika} onChange={(e) => setGakuchika(e.target.value)} placeholder="あなたの努力を教えてください" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">志望企業のタイプ</label>
              <select className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white" value={targetType} onChange={(e) => setTargetType(e.target.value)}>
                <option value="中小企業">中小企業</option>
                <option value="大企業">大企業</option>
              </select>
            </div>
            <button onClick={handleDiagnose} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg">
              診断して自信をつける！
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div>
              <p className="text-lg font-bold text-slate-500">あなたの就活偏差値は...</p>
              <div className="text-9xl font-black text-red-500 drop-shadow-lg">{result.rank}</div>
            </div>
            <div className="p-6 bg-indigo-50 rounded-xl border-l-8 border-indigo-500 text-left">
              <p className="leading-relaxed text-indigo-900 font-medium whitespace-pre-wrap">
                {result.review}
              </p>
            </div>
            <button onClick={() => setResult(null)} className="text-slate-400 hover:text-indigo-600 font-bold transition-colors">
              ← 入力画面に戻る
            </button>
          </div>
        )}
      </div>
    </main>
  );
}