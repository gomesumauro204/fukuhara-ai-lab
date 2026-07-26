import { FEATURES } from './data/site'
import Header from './components/Header'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Service from './components/Service'
import Works from './components/Works'
import Features from './components/Features'
import Process from './components/Process'
import Profile from './components/Profile'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />        {/* ファーストビュー */}
        <Problem />     {/* 顧客が抱えやすい課題 */}
        <Service />     {/* 支援内容 */}
        <Works />       {/* 制作実績 */}
        <Features />    {/* 特徴 */}
        <Process />     {/* 制作・相談の流れ */}
        <Profile />     {/* プロフィール */}
        <Faq />         {/* よくある質問 */}
        <Contact />     {/* 無料相談・メール問い合わせ */}
      </main>

      <Footer />

      {/* 選択式チャット（data/site.ts の FEATURES.chatWidget で切替） */}
      {FEATURES.chatWidget && <ChatWidget />}
    </>
  )
}
