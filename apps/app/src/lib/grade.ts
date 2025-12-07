export function calculateGrade(
  questions?: { pointsAwarded?: number; points?: number }[],
) {
  const [totalPointsAwarded, totalPoints] = (questions ?? []).reduce(
    (accumulator, question) => {
      return [
        accumulator[0] + (question.pointsAwarded || 0),
        accumulator[1] + (question.points || 0),
      ]
    },
    [0, 0],
  )

  const grade =
    totalPoints > 0
      ? ((totalPointsAwarded / totalPoints) * 100).toFixed(2) + '%'
      : 'N/A'

  return {
    totalPointsAwarded,
    totalPoints,
    grade,
  }
}
