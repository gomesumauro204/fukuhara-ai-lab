import { FEATURES } from './data/site'
import { useSectionParallax } from './hooks/useSectionParallax'

import BrandIntro from './components/BrandIntro'
import Header    from './components/Header'
import Hero      from './components/Hero'
import Works     from './components/Works'
import Problem   from './components/Problem'
import Service   from './components/Service'
import Strengths from './components/Strengths'
import Process   from './components/Process'
import Team      from './components/Team'
import Profile   from './components/Profile'
import Faq       from './components/Faq'
import Contact   from './components/Contact'
import Footer    from './components/Footer'
import ChatWidget from './components/ChatWidget'

/**
 * ページ構成
 *
 * 企業担当者は Hero → 課題共感 → サービス理解 → 実績確認 → 問い合わせ、
 * という順で理解が進むよう、実績（Works）より前に課題・支援内容・
 * 専門体制を置いている。
 * 背景は 濃紺 / オフホワイト を交互に切り替え、スクロールにリズムを作る。
 */
export default function App() {
  // セクションをまたぐ軽量パララックス（背景装飾・画像のみ。文字は動かさない）
  useSectionParallax()

  return (
    <>
      {FEATURES.brandIntro && <BrandIntro />}

      <Header />

      <main>
        <Hero />       {/*     ファーストビュー          */}
        <Problem />    {/* 01  課題                濃紺  */}
        <Service />    {/* 02  支援内容            濃紺  */}
        <Strengths />  {/* 03  特徴                淡色  */}
        <Team />       {/* 04  専門体制            淡色  */}
        <Works />      {/* 05  制作実績            濃紺  */}
        <Process />    {/* 06  制作の流れ          濃紺  */}
        <Profile />    {/* 07  プロフィール        濃紺  */}
        <Faq />        {/* 08  よくある質問        淡色  */}
        <Contact />    {/*     お問い合わせ        最暗  */}
      </main>

      <Footer />

      {FEATURES.chatWidget && <ChatWidget />}
    </>
  )
}
