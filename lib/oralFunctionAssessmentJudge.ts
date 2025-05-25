/**
 * 口腔機能検査 判定条件・統合判定ロジック
 */

// 判定条件定義
type AssessmentCriteria = {
  [key: string]: {
    label: string
    threshold: number
    operator: ">" | ">=" | "<" | "<=" | "range" | "in"
    field: string
    extra?: any
  }
}

// 各検査項目の判定条件
export const assessmentCriteria: AssessmentCriteria = {
  tongueCoating: {
    label: "舌苔の付着程度",
    threshold: 3,
    operator: "<",
    field: "totalScore"
  },
  oralMucosaWetness: {
    label: "口腔粘膜湿潤度",
    threshold: 27,
    operator: ">=",
    field: "mucusValue"
  },
  salivaAmount: {
    label: "唾液量",
    threshold: 2,
    operator: ">=",
    field: "gauzeWeight"
  },
  bitingForce: {
    label: "咬合力検査",
    threshold: 500,
    operator: ">=",
    field: "occlusionForce",
    extra: { withFilter: 350 }
  },
  remainingTeeth: {
    label: "残存歯数",
    threshold: 20,
    operator: ">=",
    field: "remainingTeeth"
  },
  oralDiadochokinesis: {
    label: "オーラルディアドコキネシス",
    threshold: 6.0,
    operator: ">=",
    field: "minSound"
  },
  tonguePressure: {
    label: "舌圧検査",
    threshold: 30,
    operator: ">=",
    field: "value"
  },
  chewingAbility: {
    label: "咀嚼能力検査",
    threshold: 100,
    operator: ">=",
    field: "glucoseConcentration"
  },
  chewingScore: {
    label: "咀嚼能力スコア法",
    threshold: 3,
    operator: ">=",
    field: "masticatoryScore"
  },
  eat10: {
    label: "EAT-10スコア",
    threshold: 3,
    operator: "<",
    field: "eat10Score"
  },
  questionnaire: {
    label: "聖隷式嚥下質問紙",
    threshold: 2,
    operator: "<",
    field: "seireiScore"
  }
}

// 統合判定関数
export function judgeAssessment(type: keyof typeof assessmentCriteria, data: any, options?: any): boolean | undefined {
  const criteria = assessmentCriteria[type]
  if (!criteria) throw new Error(`Unknown assessment type: ${type}`)

  // 特殊分岐
  if (type === "tongueCoating") {
    // 9点法の合計
    const vals = [
      data.tongueFrontLeft, data.tongueFrontCenter, data.tongueFrontRight,
      data.tongueMiddleLeft, data.tongueMiddleCenter, data.tongueMiddleRight,
      data.tongueBackLeft, data.tongueBackCenter, data.tongueBackRight
    ];
    if (vals.every(v => v === undefined || v === null || v === "")) return undefined;
    const total =
      Number(data.tongueFrontLeft || 0) +
      Number(data.tongueFrontCenter || 0) +
      Number(data.tongueFrontRight || 0) +
      Number(data.tongueMiddleLeft || 0) +
      Number(data.tongueMiddleCenter || 0) +
      Number(data.tongueMiddleRight || 0) +
      Number(data.tongueBackLeft || 0) +
      Number(data.tongueBackCenter || 0) +
      Number(data.tongueBackRight || 0)
    return total < 3
  }
  if (type === "oralDiadochokinesis") {
    if (
      data.paSound === undefined || data.taSound === undefined || data.kaSound === undefined ||
      data.paSound === "" || data.taSound === "" || data.kaSound === ""
    ) return undefined;
    // pa, ta, kaのいずれか1つでも6.0未満なら低下
    return (
      Number(data.paSound) >= 6.0 &&
      Number(data.taSound) >= 6.0 &&
      Number(data.kaSound) >= 6.0
    )
  }
  if (type === "bitingForce") {
    if (data.evaluationMethod === "method1") {
      if (data.occlusionForce === undefined || data.occlusionForce === "") return undefined;
      const value = Number(data.occlusionForce)
      if (isNaN(value)) return undefined;
      if (data.useFilter === "withFilter") {
        return value >= 350
      }
      return value >= 500
    } else {
      if (data.remainingTeeth === undefined || data.remainingTeeth === "") return undefined;
      const value = Number(data.remainingTeeth)
      if (isNaN(value)) return undefined;
      return value >= 20
    }
  }
  if (type === "chewingAbility") {
    if (data.glucoseConcentration === undefined || data.glucoseConcentration === "") return undefined;
    const value = Number(data.glucoseConcentration)
    if (isNaN(value)) return undefined;
    return value >= 100
  }
  if (type === "chewingScore") {
    if (data.masticatoryScore === undefined || data.masticatoryScore === "") return undefined;
    const value = Number(data.masticatoryScore)
    if (isNaN(value)) return undefined;
    return value >= 3
  }
  if (type === "eat10") {
    if (data.eat10Score === undefined || data.eat10Score === "") return undefined;
    const value = Number(data.eat10Score)
    if (isNaN(value)) return undefined;
    return value < 3
  }
  if (type === "questionnaire") {
    if (data.seireiScore === undefined || data.seireiScore === "") return undefined;
    const value = Number(data.seireiScore)
    if (isNaN(value)) return undefined;
    return value < 2
  }

  // 通常の閾値判定
  const value = Number(data[criteria.field])
  if (data[criteria.field] === undefined || data[criteria.field] === "" || isNaN(value)) return undefined;
  switch (criteria.operator) {
    case ">":
      return value > criteria.threshold
    case ">=":
      return value >= criteria.threshold
    case "<":
      return value < criteria.threshold
    case "<=":
      return value <= criteria.threshold
    default:
      return undefined
  }
}

// 口腔機能検査 各項目の正常/低下判定 & 総合評価ユーティリティ

export type OralFunctionExamData = {
  // 口腔衛生状態
  oralHygiene: {
    tongueFrontLeft: string
    tongueFrontCenter: string
    tongueFrontRight: string
    tongueMiddleLeft: string
    tongueMiddleCenter: string
    tongueMiddleRight: string
    tongueBackLeft: string
    tongueBackCenter: string
    tongueBackRight: string
  }
  // 口腔乾燥
  oralDryness: {
    evaluationMethod: "method1" | "method2"
    mucusValue: string // method1
    gauzeWeight: string // method2
  }
  // 咬合力
  bitingForce: {
    evaluationMethod: "method1" | "method2"
    pressureScaleType: "pressScale2" | "pressScale" | "oramo"
    useFilter: "withFilter" | "noFilter"
    occlusionForce: string
    remainingTeeth: string
  }
  // 舌口唇運動
  tongueMovement: {
    paSound: string
    taSound: string
    kaSound: string
  }
  // 舌圧
  tonguePressure: {
    value: string
  }
  // 咀嚼機能
  chewingFunction: {
    evaluationMethod: "method1" | "method2"
    glucoseConcentration: string // method1
    masticatoryScore: string // method2
  }
  // 嚥下機能
  swallowingFunction: {
    evaluationMethod: "eat10" | "seirei"
    eat10Score: string // eat10
    seireiScore: string // seirei
  }
}

/** 既存個別関数はラッパー化（将来的に削除予定） */

// 口腔衛生状態（TCI）判定
export function judgeOralHygiene(data: OralFunctionExamData["oralHygiene"]): boolean | undefined {
  return judgeAssessment("tongueCoating", data)
}

// 口腔乾燥判定
export function judgeOralDryness(data: OralFunctionExamData["oralDryness"]): boolean | undefined {
  if (data.evaluationMethod === "method1") {
    return judgeAssessment("oralMucosaWetness", data)
  } else {
    return judgeAssessment("salivaAmount", data)
  }
}

// 咬合力判定
export function judgeBitingForce(data: OralFunctionExamData["bitingForce"]): boolean | undefined {
  return judgeAssessment("bitingForce", data)
}

// 舌口唇運動判定
export function judgeTongueMovement(data: OralFunctionExamData["tongueMovement"]): boolean | undefined {
  return judgeAssessment("oralDiadochokinesis", data)
}

// 舌圧判定
export function judgeTonguePressure(data: OralFunctionExamData["tonguePressure"]): boolean | undefined {
  return judgeAssessment("tonguePressure", data)
}

// 咀嚼機能判定
export function judgeChewingFunction(data: OralFunctionExamData["chewingFunction"]): boolean | undefined {
  if (data.evaluationMethod === "method1") {
    return judgeAssessment("chewingAbility", data)
  } else {
    return judgeAssessment("chewingScore", data)
  }
}

// 嚥下機能判定
export function judgeSwallowingFunction(data: OralFunctionExamData["swallowingFunction"]): boolean | undefined {
  if (data.evaluationMethod === "eat10") {
    return judgeAssessment("eat10", data)
  } else {
    return judgeAssessment("questionnaire", data)
  }
}

export function judgeOralHygieneStatus(scores: number[]) {
  // 6ブロック分のスコア配列（各0,1,2）
  if (scores.length !== 6) throw new Error('スコア配列は6要素必要です');
  const total = scores.reduce((a, b) => a + b, 0);
  const tci = (total / 12) * 100;
  return {
    tci,
    isAbnormal: tci >= 50
  };
}

// 総合評価（全て正常ならtrue, 1つでも低下ならfalse）
export function judgeOverall(data: OralFunctionExamData): boolean {
  return (
    !!judgeOralHygiene(data.oralHygiene) &&
    !!judgeOralDryness(data.oralDryness) &&
    !!judgeBitingForce(data.bitingForce) &&
    !!judgeTongueMovement(data.tongueMovement) &&
    !!judgeTonguePressure(data.tonguePressure) &&
    !!judgeChewingFunction(data.chewingFunction) &&
    !!judgeSwallowingFunction(data.swallowingFunction)
  )
}
