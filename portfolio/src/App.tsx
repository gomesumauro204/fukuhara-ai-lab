import { FEATURES } from './data/site'

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
 * 企業担当者は Hero → 制作実績 → プロフィール → お問い合わせ の順に
 * 見るため、制作実績を最初のセクションに置いている。
 * 背景は 濃紺 / オフホワイト を交互に切り替え、スクロールにリズムを作る。
 */
export default function App() {
  return (
    <>
      {FEATURES.brandIntro && <BrandIntro />}

      <Header />

      <main>
        <Hero />       {/*     ファーストビュー          */}
        <Works />      {/* 01  制作実績（最重要）  濃紺  */}
        <Problem />    {/* 02  課題                淡色  */}
        <Service />    {/* 03  支援内容            濃紺  */}
        <Strengths />  {/* 04  特徴                淡色  */}
        <Process />    {/* 05  制作の流れ          濃紺  */}
        <Team />       {/* 06  専門体制            淡色  */}
        <Profile />    {/* 07  プロフィール        濃紺  */}
        <Faq />        {/* 08  よくある質問        淡色  */}
        <Contact />    {/*     お問い合わせ        最暗  */}
      </main>

      <Footer />

      {FEATURES.chatWidget && <ChatWidget />}
    </>
  )
}
