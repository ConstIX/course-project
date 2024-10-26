import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const NotFound: FC = () => {
  const { t } = useTranslation(['title'])

  return (
    <Box className="flex flex-1 items-center justify-center p-[120px_10px_10px_10px]">
      <Box className="space-y-7 text-center">
        <Typography variant="h1" color="textSecondary">
          404
        </Typography>
        <Typography variant="h4" color="textDisabled">
          {t('title.notFound')}
        </Typography>
        <Typography color="textSecondary">
          {t('title.notFoundMessage')} <br /> {t('title.notFoundBack')}
        </Typography>
      </Box>
    </Box>
  )
}

export default NotFound
