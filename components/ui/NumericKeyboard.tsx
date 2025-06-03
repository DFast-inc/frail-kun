"use client";

import React from "react";

export interface NumericKeyboardProps {
  /** 入力キー (数字文字 "0"-"9", ".", "backspace") */
  onInput: (key: string) => void;
  /** 任意のスタイル調整用クラス名 */
  className?: string;
}

const keys: readonly string[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "backspace",
];

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
  onInput,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {keys.map((key) => {
        const label = key === "backspace" ? "←" : key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onInput(key)}
            className="py-4 text-lg bg-gray-100 rounded shadow active:bg-gray-300"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default NumericKeyboard;
