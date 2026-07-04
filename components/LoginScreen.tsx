"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import FairyCharacter from "@/components/FairyCharacter";

interface Props {
  onLogin: (username: string) => void;
}

const MAX_LEN = 10;

export default function LoginScreen({ onLogin }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const name = value.trim();
    if (!name) {
      setError("なまえを いれてね！");
      return;
    }
    onLogin(name);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: "linear-gradient(135deg,#FFF9F0,#F0EEFF)" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        <h1 className="text-2xl font-black text-purple-700">🍳 ようせいレストラン</h1>

        <FairyCharacter state="idle" />

        <div className="w-full flex flex-col gap-2">
          <p className="text-center text-sm font-bold text-purple-700">
            あそぶ なまえを いれてね！
          </p>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            maxLength={MAX_LEN}
            placeholder="なまえ"
            className="w-full text-center text-lg font-black py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-400 outline-none"
          />
          {error && (
            <p className="text-center text-xs font-bold text-red-500">{error}</p>
          )}
          <p className="text-center text-[11px] text-gray-400 leading-relaxed mt-1">
            はじめての なまえなら、あたらしく とうろくされるよ！
            <br />
            なまえは わすれないでね。わすれると、つづきが できなくなるよ。
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-white text-xl font-black shadow-lg"
          style={{ background: "linear-gradient(135deg,#48BB78,#38A169)" }}
        >
          はじめる！
        </motion.button>
      </div>
    </main>
  );
}
