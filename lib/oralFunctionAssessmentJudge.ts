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
    tongueFrontLeft: number | undefined
    tongueFrontCenter: number | undefined
    tongueFrontRight: number | undefined
    tongueMiddleLeft: number | undefined
    tongueMiddleCenter: number | undefined
    tongueMiddleRight: number | undefined
    tongueBackLeft: number | undefined
    tongueBackCenter: number | undefined
    tongueBackRight: number | undefined
  }
  // 口腔乾燥
  oralDryness: {
    evaluationMethod: "method1" | "method2"
    mucusValue: number | undefined // method1
    gauzeWeight: number | undefined // method2
  }
  // 咬合力
  bitingForce: {
    evaluationMethod: "method1" | "method2"
    pressureScaleType: "pressScale2" | "pressScale" | "oramo"
    useFilter: "withFilter" | "noFilter"
    occlusionForce: number | undefined
    remainingTeeth: number | undefined
  }
  // 舌口唇運動
  tongueMovement: {
    paSound: number | undefined
    taSound: number | undefined
    kaSound: number | undefined
  }
  // 舌圧
  tonguePressure: {
    value: number | undefined
  }
  // 咀嚼機能
  chewingFunction: {
    evaluationMethod: "method1" | "method2"
    glucoseConcentration: number | undefined // method1
    masticatoryScore: number | undefined // method2
  }
  // 嚥下機能
  swallowingFunction: {
    evaluationMethod: "eat10" | "seirei"
    eat10Score: number | undefined // eat10
    seireiScore: number | undefined // seirei
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

/**
 * DB値→OralFunctionExamData型へ変換
 */
export function toOralFunctionExamData(exam: any): OralFunctionExamData {
  return {
    oralHygiene: {
      tongueFrontLeft: exam.tongue_front_left !== null && exam.tongue_front_left !== undefined ? Number(exam.tongue_front_left) : undefined,
      tongueFrontCenter: exam.tongue_front_center !== null && exam.tongue_front_center !== undefined ? Number(exam.tongue_front_center) : undefined,
      tongueFrontRight: exam.tongue_front_right !== null && exam.tongue_front_right !== undefined ? Number(exam.tongue_front_right) : undefined,
      tongueMiddleLeft: exam.tongue_middle_left !== null && exam.tongue_middle_left !== undefined ? Number(exam.tongue_middle_left) : undefined,
      tongueMiddleCenter: exam.tongue_middle_center !== null && exam.tongue_middle_center !== undefined ? Number(exam.tongue_middle_center) : undefined,
      tongueMiddleRight: exam.tongue_middle_right !== null && exam.tongue_middle_right !== undefined ? Number(exam.tongue_middle_right) : undefined,
      tongueBackLeft: exam.tongue_back_left !== null && exam.tongue_back_left !== undefined ? Number(exam.tongue_back_left) : undefined,
      tongueBackCenter: exam.tongue_back_center !== null && exam.tongue_back_center !== undefined ? Number(exam.tongue_back_center) : undefined,
      tongueBackRight: exam.tongue_back_right !== null && exam.tongue_back_right !== undefined ? Number(exam.tongue_back_right) : undefined,
    },
    oralDryness: {
      evaluationMethod: exam.oral_dryness_method ?? "method1",
      mucusValue: exam.mucus_value !== null && exam.mucus_value !== undefined ? Number(exam.mucus_value) : undefined,
      gauzeWeight: exam.gauze_weight !== null && exam.gauze_weight !== undefined ? Number(exam.gauze_weight) : undefined,
    },
    bitingForce: {
      evaluationMethod: exam.biting_force_method ?? "method1",
      pressureScaleType: exam.pressure_scale_type ?? "pressScale2",
      useFilter: exam.use_filter ?? "noFilter",
      occlusionForce: exam.occlusion_force !== null && exam.occlusion_force !== undefined ? Number(exam.occlusion_force) : undefined,
      remainingTeeth: exam.remaining_teeth !== null && exam.remaining_teeth !== undefined ? Number(exam.remaining_teeth) : undefined,
    },
    tongueMovement: {
      paSound: exam.pa_sound !== null && exam.pa_sound !== undefined ? Number(exam.pa_sound) : undefined,
      taSound: exam.ta_sound !== null && exam.ta_sound !== undefined ? Number(exam.ta_sound) : undefined,
      kaSound: exam.ka_sound !== null && exam.ka_sound !== undefined ? Number(exam.ka_sound) : undefined,
    },
    tonguePressure: {
      value: exam.tongue_pressure_value !== null && exam.tongue_pressure_value !== undefined ? Number(exam.tongue_pressure_value) : undefined,
    },
    chewingFunction: {
      evaluationMethod: exam.chewing_function_method ?? "method1",
      glucoseConcentration: exam.glucose_concentration !== null && exam.glucose_concentration !== undefined ? Number(exam.glucose_concentration) : undefined,
      masticatoryScore: exam.masticatory_score !== null && exam.masticatory_score !== undefined ? Number(exam.masticatory_score) : undefined,
    },
    swallowingFunction: {
      evaluationMethod: exam.swallowing_function_method ?? "eat10",
      eat10Score: exam.eat10_score !== null && exam.eat10_score !== undefined ? Number(exam.eat10_score) : undefined,
      seireiScore: exam.seirei_score !== null && exam.seirei_score !== undefined ? Number(exam.seirei_score) : undefined,
    },
  };
}

/**
 * 全項目の表示値・該当判定・scoreを返す共通ロジック
 */
export function toResultStruct(exam: any) {
  const data = toOralFunctionExamData(exam);
  return {
    oralHygiene: (() => {
      // 6ブロック: 左前・右前・左中・右中・左後・右後
      const scores = [
        Number(data.oralHygiene.tongueFrontLeft || 0),
        Number(data.oralHygiene.tongueFrontRight || 0),
        Number(data.oralHygiene.tongueMiddleLeft || 0),
        Number(data.oralHygiene.tongueMiddleRight || 0),
        Number(data.oralHygiene.tongueBackLeft || 0),
        Number(data.oralHygiene.tongueBackRight || 0),
      ];
      const { tci, isAbnormal } = judgeOralHygieneStatus(scores);
      const blockStr = [
        `左前: ${scores[0]}`,
        `右前: ${scores[1]}`,
        `左中: ${scores[2]}`,
        `右中: ${scores[3]}`,
        `左後: ${scores[4]}`,
        `右後: ${scores[5]}`
      ].join(" / ");
      const tciStr = `TCI: ${tci.toFixed(1)}%`;
      const status = isAbnormal ? "低下（✕）" : "正常";
      return {
        score: isAbnormal ? 1 : 0,
        value: {
          blocks: blockStr,
          tci: tciStr,
          tciValue: tci,
          plaque: `プラークコントロール: ${exam.plaque_control ?? "-"}`
        },
        status,
        name: "口腔衛生状態",
        description: "舌苔指数（TCI）・プラークコントロール",
        normalRange: "TCI 50%未満が正常",
        notes: exam.oral_hygiene_notes,
      };
    })(),
    oralDryness: (() => {
      const isNormal = judgeOralDryness(data.oralDryness);
      const value =
        data.oralDryness.evaluationMethod === "method1"
          ? `湿潤度値: ${data.oralDryness.mucusValue ?? "-"}`
          : `ガーゼ重量: ${data.oralDryness.gauzeWeight ?? "-"}`;
      const status = isNormal ? "正常" : "低下（✕）";
      return {
        score: isNormal ? 0 : 1,
        value: `${value} / 判定: ${status}`,
        status,
        name: "口腔乾燥",
        description: "口腔湿潤度測定値・サクソンテスト",
        normalRange: "湿潤度27.0以上, ガーゼ2g以上",
        notes: exam.oral_dryness_notes,
      };
    })(),
    bitingForce: {
      score: judgeBitingForce(data.bitingForce) ? 0 : 1,
      value: `咬合力: ${data.bitingForce.occlusionForce ?? "-"}N / 残存歯数: ${data.bitingForce.remainingTeeth ?? "-"}本 / 器具: ${data.bitingForce.pressureScaleType ?? "-"} / フィルタ: ${data.bitingForce.useFilter ?? "-"}`,
      status: judgeBitingForce(data.bitingForce) ? "正常" : "該当",
      name: "咬合力",
      description: "最大咬合力・残存歯数",
      normalRange: "200N以上, 20本以上",
      notes: exam.biting_force_notes,
    },
    tongueMotor: {
      score: judgeTongueMovement(data.tongueMovement) ? 0 : 1,
      value: `pa: ${data.tongueMovement.paSound ?? "-"} / ta: ${data.tongueMovement.taSound ?? "-"} / ka: ${data.tongueMovement.kaSound ?? "-"}`,
      status: judgeTongueMovement(data.tongueMovement) ? "正常" : "該当",
      name: "舌口唇運動機能",
      description: "オーラルディアドコキネシス",
      normalRange: "6.0回/秒以上",
      notes: exam.tongue_movement_notes,
    },
    tonguePressure: {
      score: judgeTonguePressure(data.tonguePressure) ? 0 : 1,
      value: `${data.tonguePressure.value ?? "-"} kPa`,
      status: judgeTonguePressure(data.tonguePressure) ? "正常" : "該当",
      name: "舌圧",
      description: "舌圧測定値",
      normalRange: "30kPa以上",
      notes: exam.tongue_pressure_notes,
    },
    chewingFunction: {
      score: judgeChewingFunction(data.chewingFunction) ? 0 : 1,
      value: `グルコース濃度: ${data.chewingFunction.glucoseConcentration ?? "-"} / 咀嚼能率スコア: ${data.chewingFunction.masticatoryScore ?? "-"}`,
      status: judgeChewingFunction(data.chewingFunction) ? "正常" : "該当",
      name: "咀嚼機能",
      description: "グルコース含有ゼリー法・咀嚼能率スコア",
      normalRange: "100mg/dL以上, スコア3以上",
      notes: exam.chewing_function_notes,
    },
    tonguePressureValue: data.tonguePressure.value ?? "-",
    swallowingFunction: {
      score: judgeSwallowingFunction(data.swallowingFunction) ? 0 : 1,
      value: `EAT-10: ${data.swallowingFunction.eat10Score ?? "-"} / 聖隷式: ${data.swallowingFunction.seireiScore ?? "-"}`,
      status: judgeSwallowingFunction(data.swallowingFunction) ? "正常" : "該当",
      name: "嚥下機能",
      description: "EAT-10・聖隷式嚥下質問紙",
      normalRange: "EAT-10: 3点未満, 聖隷式: 2点未満",
      notes: exam.swallowing_function_notes,
    },
  };
}

// 口腔機能検査の該当項目数（0〜7）を返す
export function countApplicableItems(data: OralFunctionExamData): number {
  // toResultStructのscore合計と完全一致させる
  const oralHygieneScore = (() => {
    // 6ブロック: 左前・右前・左中・右中・左後・右後
    const scores = [
      Number(data.oralHygiene.tongueFrontLeft || 0),
      Number(data.oralHygiene.tongueFrontRight || 0),
      Number(data.oralHygiene.tongueMiddleLeft || 0),
      Number(data.oralHygiene.tongueMiddleRight || 0),
      Number(data.oralHygiene.tongueBackLeft || 0),
      Number(data.oralHygiene.tongueBackRight || 0),
    ];
    const { isAbnormal } = judgeOralHygieneStatus(scores);
    return isAbnormal ? 1 : 0;
  })();

  const oralDrynessScore = judgeOralDryness(data.oralDryness) ? 0 : 1;
  const bitingForceScore = judgeBitingForce(data.bitingForce) ? 0 : 1;
  const tongueMotorScore = judgeTongueMovement(data.tongueMovement) ? 0 : 1;
  const tonguePressureScore = judgeTonguePressure(data.tonguePressure) ? 0 : 1;
  const chewingFunctionScore = judgeChewingFunction(data.chewingFunction) ? 0 : 1;
  const swallowingFunctionScore = judgeSwallowingFunction(data.swallowingFunction) ? 0 : 1;

  return [
    oralHygieneScore,
    oralDrynessScore,
    bitingForceScore,
    tongueMotorScore,
    tonguePressureScore,
    chewingFunctionScore,
    swallowingFunctionScore,
  ].reduce((a, b) => a + b, 0);
}
