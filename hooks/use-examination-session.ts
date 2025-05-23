"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

// デバイスIDを生成または取得
const getDeviceId = () => {
  let deviceId = localStorage.getItem("examination_device_id")
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem("examination_device_id", deviceId)
  }
  return deviceId
}

export function useExaminationSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const deviceId = getDeviceId()

  // 新しいセッションを作成
  const createSession = async (patientId: string, patientName: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/examination-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId, patientName }),
      })

      if (!response.ok) {
        throw new Error("セッションの作成に失敗しました")
      }

      const data = await response.json()
      setSessionId(data.sessionId)
      return data.sessionId
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      return null
    } finally {
      setLoading(false)
    }
  }

  // セッションに参加
  const joinSession = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/examination-sessions?sessionId=${id}`)

      if (!response.ok) {
        throw new Error("セッションの取得に失敗しました")
      }

      const data = await response.json()
      setSessionId(id)
      setSessionData(data.data)
      setLastUpdated(data.lastUpdated)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      return false
    } finally {
      setLoading(false)
    }
  }

  // セッションデータを更新
  const updateSessionData = async (category: string, field: string, value: any) => {
    if (!sessionId) return false

    try {
      const response = await fetch(`/api/examination-sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, field, value, deviceId }),
      })

      if (!response.ok) {
        throw new Error("データの更新に失敗しました")
      }

      const data = await response.json()
      setLastUpdated(data.lastUpdated)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      return false
    }
  }

  // セッションデータを取得（ポーリング）
  const fetchSessionData = async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/examination-sessions?sessionId=${sessionId}`)

      if (!response.ok) {
        throw new Error("セッションデータの取得に失敗しました")
      }

      const data = await response.json()

      // 最終更新時刻が異なる場合のみデータを更新
      if (data.lastUpdated !== lastUpdated) {
        setSessionData(data.data)
        setLastUpdated(data.lastUpdated)
      }
    } catch (err) {
      console.error("セッションデータ取得エラー:", err)
    }
  }

  // セッションを完了し、データを保存
  const finalizeSession = async () => {
    if (!sessionId) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/examination-sessions/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalizeSession: true }),
      })

      if (!response.ok) {
        throw new Error("データの保存に失敗しました")
      }

      const data = await response.json()
      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ポーリングでセッションデータを定期的に取得
  useEffect(() => {
    if (!sessionId) return

    const intervalId = setInterval(fetchSessionData, 3000) // 3秒ごとに更新

    return () => clearInterval(intervalId)
  }, [sessionId, lastUpdated])

  return {
    sessionId,
    sessionData,
    loading,
    error,
    lastUpdated,
    deviceId,
    createSession,
    joinSession,
    updateSessionData,
    finalizeSession,
  }
}
