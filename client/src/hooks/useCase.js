import { useState, useEffect, useCallback } from 'react'
import { getCase } from '../services/caseApi'

export default function useCase(caseId) {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCase = useCallback(async () => {
    if (!caseId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getCase(caseId)
      setCaseData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [caseId])

  useEffect(() => {
    fetchCase()
  }, [fetchCase])

  const updateCase = useCallback((updater) => {
    setCaseData((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  return { caseData, loading, error, refetch: fetchCase, updateCase }
}
