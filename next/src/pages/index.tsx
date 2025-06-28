import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from './components/Layout'
import FeatureSection from './components/index/FeatureSection'
import FooterLinks from './components/index/FooterLinks'
import HeroSection from './components/index/HeroSection'

export default function PublicThanksDeck() {
  const router = useRouter()

  return (
    <>
      <Layout>
        <HeroSection />
        <FeatureSection />
        <FooterLinks />

        <div>ここで新規登録やログイン</div>
        <Button onClick={() => router.push('/signup')}>新規登録ボタン</Button>
        <Button onClick={() => router.push('/signin')}>ログイン</Button>
      </Layout>
    </>
  )
}
