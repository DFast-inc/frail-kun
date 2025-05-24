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

// 口腔衛生状態（TCI）判定
export function judgeOralHygiene(data: OralFunctionExamData["oralHygiene"]): boolean {
  // 合計スコア
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
  // 3点以上で低下（✕）、2点以下で正常（〇）
  return total < 3
}

// 口腔乾燥判定
export function judgeOralDryness(data: OralFunctionExamData["oralDryness"]): boolean {
  if (data.evaluationMethod === "method1") {
    // 湿潤度値 27.0以上が正常
    return Number(data.mucusValue) >= 27.0
  } else {
    // ガーゼ重量増加量 2g以上が正常
    return Number(data.gauzeWeight) >= 2.0
  }
}

// 咬合力判定
export function judgeBitingForce(data: OralFunctionExamData["bitingForce"]): boolean {
  if (data.evaluationMethod === "method1") {
    const value = Number(data.occlusionForce)
    // フィルタ有無で基準値を分岐
    if (data.useFilter === "noFilter") {
      return value >= 500
    } else if (data.useFilter === "withFilter") {
      return value >= 350
    } else {
      // 万一useFilterが未設定の場合は従来通り
      return value >= 500
    }
  } else {
    // 残存歯数 20本以上が正常
    return Number(data.remainingTeeth) >= 20
  }
}

// 舌口唇運動判定
export function judgeTongueMovement(data: OralFunctionExamData["tongueMovement"]): boolean {
  // いずれか1音でも6.0回/秒未満なら低下
  return (
    Number(data.paSound) >= 6.0 &&
    Number(data.taSound) >= 6.0 &&
    Number(data.kaSound) >= 6.0
  )
}

// 舌圧判定
export function judgeTonguePressure(data: OralFunctionExamData["tonguePressure"]): boolean {
  // 30kPa以上が正常
  return Number(data.value) >= 30
}

// 咀嚼機能判定
export function judgeChewingFunction(data: OralFunctionExamData["chewingFunction"]): boolean {
  if (data.evaluationMethod === "method1") {
    // グルコース濃度 100mg/dL以上が正常
    return Number(data.glucoseConcentration) >= 100
  } else {
    // 咀嚼能率スコア 3以上が正常
    return Number(data.masticatoryScore) >= 3
  }
}

// 嚥下機能判定
export function judgeSwallowingFunction(data: OralFunctionExamData["swallowingFunction"]): boolean {
  if (data.evaluationMethod === "eat10") {
    // EAT-10スコア 3点未満が正常
    return Number(data.eat10Score) < 3
  } else {
    // 聖隷式スコア 2点未満が正常
    return Number(data.seireiScore) < 2
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
    judgeOralHygiene(data.oralHygiene) &&
    judgeOralDryness(data.oralDryness) &&
    judgeBitingForce(data.bitingForce) &&
    judgeTongueMovement(data.tongueMovement) &&
    judgeTonguePressure(data.tonguePressure) &&
    judgeChewingFunction(data.chewingFunction) &&
    judgeSwallowingFunction(data.swallowingFunction)
  )
}
