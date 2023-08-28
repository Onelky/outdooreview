import { HomeContent } from '@/components/Home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OutdooReview',
  description: 'Based on Yelp, OutdooReview is a web application that allows users to explore and create campgrounds.'
}
export default function Home() {
  return (
    <main>
      <HomeContent />
    </main>
  )
}
