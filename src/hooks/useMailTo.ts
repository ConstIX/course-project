import moment from 'moment'
import { ICurrentResults } from '../types/results.types'
import { ITemplate } from '../types/templates.types'
import { IUser } from '../types/user.types'

export const useMailTo = () => {
  const sendMessage = async (data: ICurrentResults, template?: ITemplate, user?: IUser) => {
    try {
      const answersFormatted = template?.questions.map(({ id, label }) => `${label}: ${data[id]}`).join('\n')
      const subject = encodeURIComponent(`${template!.title}`)
      const body = encodeURIComponent(
        `Пользователь: ${user!.username} (${user!.email})\n` + `Форма: "${template!.title}"\n` + `Дата: ${moment().format('DD/MM/YYYY HH:mm')}\n\n` + `Ответы:\n${answersFormatted}`
      )

      window.location.href = `mailto:${user!.email}?subject=${subject}&body=${body}`
    } catch (err) {
      console.error('Failed to delete template and its results:', err)
    }
  }

  return [sendMessage]
}
