import React, { type FC } from 'react'
import { Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { RoundedButton } from '@/components/Elements/RoundedButton'
import { poppins } from '@/lib/fonts'
import { APP_NAME } from '@/lib/constants'
import styles from './HomeContent.module.css'

const SLOGAN = 'Your Gateway to Outdoor Adventures!'
const APP_DESCRIPTION =
  'Join our vibrant camping community, share your tales, and inspire others to embark on unforgettable adventures. At OutdooReview, the great outdoors\n' +
  'awaits—start your journey today!'
const ScrollArrow = () => {
  return (
    <Box height={'max-content'} display={'flex'} flexDirection={'column'} rowGap={1} position={'absolute'} bottom={{ xl: '8vh' }} left={{ xl: 150 }}>
      <Typography
        component={'span'}
        color={'white'}
        fontSize={'14px !important'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
        className={poppins.className}
        sx={{ writingMode: 'tb', transform: 'rotate(180deg)', userSelect: 'none' }}>
        Scroll
      </Typography>

      <div className={styles.scrollDown}>
        <span className={styles.arrowDown}></span>
      </div>
    </Box>
  )
}
export const HomeContent: FC = () => {
  return (
    <>
      <ScrollArrow />
      <Stack maxWidth={760} alignItems={'center'} rowGap={4}>
        <Typography variant={'h1'} color={'white'}>
          {APP_NAME}
        </Typography>
        <Typography color={'white'} fontWeight={'bold'} fontSize={20} letterSpacing={'10%'} textTransform={'uppercase'}>
          {SLOGAN}
        </Typography>
        <Typography variant={'body1'} color={'white'} textAlign={'center'}>
          {APP_DESCRIPTION}
        </Typography>
        <RoundedButton text={'explore  campgrounds'} styles={{ width: 300 }} />
      </Stack>
    </>
  )
}
