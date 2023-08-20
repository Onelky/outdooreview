import { HomeContent } from '@/components/Home'
import { Metadata } from 'next'
import bg from '../assets/hero-background.jpg'
import Box from '@mui/material/Box'

export const metadata: Metadata = {
  title: 'OutdooReview',
  description: 'Based on Yelp, OutdooReview is a web application that allows users to explore and create campgrounds.'
}
export default function Home() {
  return (
    <main>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          marginTop: -120,
          paddingTop: '120px',
          background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
          linear-gradient(0deg, #022420 0%, #022420 3%, rgba(2, 36, 32, 0.00) 20%),
           url(${bg.src}) no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <Box
          component={'header'}
          display={'flex'}
          position={'relative'}
          justifyContent={'center'}
          sx={{ maxWidth: 1536, width: '100%', height: '100%', padding: '10vh 150px 0 150px' }}>
          <HomeContent />
        </Box>
      </div>
    </main>
  )
}
