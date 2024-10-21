import { resultsApi, useDeleteResultsMutation } from '../redux/services/results'
import { useDeleteTemplateMutation } from '../redux/services/templates'

export const useDeleteTemplate = () => {
  const [getResultsByTemplateId] = resultsApi.useLazyGetResultsByTemplateIdQuery()
  const [deleteTemplate] = useDeleteTemplateMutation()
  const [deleteResults] = useDeleteResultsMutation()

  const deleteTemplateWithResults = async (templateId: number) => {
    try {
      await deleteTemplate(templateId).unwrap()

      const results = await getResultsByTemplateId(templateId).unwrap()
      if (results) {
        const allResults = results.map((obj) => obj.id)

        for (const resultId of allResults) {
          await deleteResults(resultId).unwrap()
        }
      }
    } catch (err) {
      console.error('Failed to delete template and its results:', err)
    }
  }

  return [deleteTemplateWithResults]
}
