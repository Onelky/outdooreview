'use client'
import React, { type FC } from 'react'
import { Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { RoundedButton } from '@/components/Elements/RoundedButton'
import { poppins } from '@/lib/fonts'
import { APP_NAME } from '@/lib/constants'
import styles from './HomeContent.module.css'
import bg from '@/assets/hero-background.jpg'
import bgMobile from '@/assets/hero-background-mobile.png'

const SLOGAN = 'Your Gateway to Outdoor Adventures!'
const APP_DESCRIPTION =
  'Join our vibrant camping community, share your tales, and inspire others to embark on unforgettable adventures. At OutdooReview, the great outdoors\n' +
  'awaits. Start your journey today!'

const BACKGROUND = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
                    linear-gradient(0deg, #022420 0%, #022420 3%, rgba(2, 36, 32, 0.00) 20%), url([src]) no-repeat`

const ScrollArrow = () => {
  return (
    <Box
      height={'max-content'}
      width={'max-content'}
      display={'flex'}
      flexDirection={'column'}
      rowGap={1}
      position={'absolute'}
      bottom={{ md: '8vh' }}
      top={{ xs: '50vh', md: 'unset' }}
      left={{ xs: '50%', md: 130, xl: 150 }}
      sx={{ transform: 'translate(-50%)' }}>
      <Typography
        component={'span'}
        color={'white'}
        fontSize={'14px !important'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
        className={poppins.className}
        sx={{ writingMode: { md: 'tb' }, transform: { md: 'rotate(180deg)' }, userSelect: 'none', order: { xs: 2, md: 0 } }}>
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: { xs: 8, md: 12 },
        background: { xs: BACKGROUND.replace('[src]', bgMobile.src), md: BACKGROUND.replace('[src]', bg.src) },
        backgroundSize: 'cover !important',
        backgroundPosition: 'center !important'
      }}>
      <Box
        component={'header'}
        display={'flex'}
        position={'relative'}
        justifyContent={'center'}
        sx={{ maxWidth: 1536, width: '100%', height: '100%', pt: { sm: '10vh' }, paddingX: { sm: 2, md: 13, xl: 15 } }}>
        <ScrollArrow />
        <Stack maxWidth={760} alignItems={'center'} rowGap={4}>
          <Typography variant={'h1'} color={'white'}>
            {APP_NAME}
          </Typography>
          <Typography color={'white'} fontWeight={'bold'} fontSize={{ sm: 16, md: 20 }} letterSpacing={'10%'} textTransform={'uppercase'}>
            {SLOGAN}
          </Typography>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'} rowGap={4} paddingX={6}>
            <Typography variant={'body1'} color={'white'} textAlign={'center'} fontSize={{ sm: 16, md: 20 }}>
              {APP_DESCRIPTION}
            </Typography>
            <RoundedButton text={'explore  campgrounds'} styles={{ width: { sm: 260, md: 300 } }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
