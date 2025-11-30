import React, { useState, useEffect, useRef } from 'react';
// npm install lucide-react firebase react-helmet-async
import {
  BookOpen,
  Home,
  Search,
  User,
  Star,
  Share2,
  ChevronLeft,
  Calendar,
  Plus,
  Upload,
  Trash2,
  Settings,
  Image as ImageIcon,
  Menu,
  ChevronRight,
  Clock,
  RotateCcw,
  X,
  Loader,
  DollarSign,
  Briefcase,
  Smile,
  ExternalLink,
  checkCircle,
  Crown,
  Lock,
  Heart,
  Flame,
  MessageCircle,
  Copy,
  Link as LinkIcon,
  Globe,
  Languages,
  Sparkles,
  Check,
  Trophy,
  Handshake,
  Building,
  AlertCircle,
  Wand2,
  FileText,
  Palette,
  MonitorPlay,
  FileCheck,
  Mail,
  Download,
  Smartphone,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ==========================================
// 🌍 環境変数設定エリア (Vercel対応)
// ==========================================
const env = import.meta.env || process.env;

const FIREBASE_CONFIG = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN || env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET || env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID || env.VITE_FIREBASE_APP_ID,
};

// Gemini / Stripe
const GEMINI_API_KEY = env.REACT_APP_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
const STRIPE_KEY = env.REACT_APP_STRIPE_PUBLIC_KEY || env.VITE_STRIPE_PUBLIC_KEY;

// App ID
const APP_ID = 'mangax-prod-v1';

// --- Initialization Logic ---
let app;
let auth;
let db;
let isConfigured = false;
try {
  if (FIREBASE_CONFIG.apiKey) {
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
  }
} catch (e) {
  console.error('Firebase init error:', e);
}

// --- Translation Resources ---
const RESOURCES = {
  ja: {
    app_name: 'MangaX by FOMUS',
    app_tagline: 'The Cross-Border Manga Platform',
    nav_home: 'ホーム',
    nav_free: '無料',
    nav_search: 'さがす',
    nav_mypage: 'マイページ',
    nav_partners: 'スポンサー',
    guest_name: 'ゲストさん',
    guest_label: 'ゲスト',
    new_badge: '新着',
    free_first: '初回全話無料',
    read_from_start: '最初から読む',
    continue_reading: '続きから読む',
    read_finished: '読了',
    share: 'シェア',
    share_msg: 'シェアして応援',
    presented_by: 'Presented by',
    sponsored_by_msg: 'この作品はご覧のスポンサーの提供でお送りします',
    special_thanks: 'Special Thanks',
    sponsor_desc: 'この物語を支えてくれたスポンサー',
    official_site: '公式サイトを見る',
    author_note: '作者あとがき',
    finished_reading: '読み終わりました',
    back_to_detail: '詳細へ戻る',
    next_chapter: '次の話',
    prev_chapter: '前の話',
    chapter_list: '話一覧',
    work_detail: '作品詳細',
    support_title: 'スポンサーになる',
    support_btn: 'スポンサーになる',
    premium_plan: 'プレミアムプラン',
    premium_desc: 'AI翻訳機能で、世界中の漫画をあなたの言葉で。',
    premium_price: '月額 $5 (約750円)',
    premium_benefit_1: '漫画内のセリフをAIが瞬時に翻訳',
    premium_benefit_2: '広告非表示 (予定)',
    premium_benefit_3: '作者への還元率アップ',
    subscribe_btn: '今すぐ登録する',
    subscribed: 'プレミアム会員',
    unlock_translate: '翻訳機能を使う (Premium)',
    ai_translate: 'AI翻訳',
    translating: 'AIが翻訳中...',
    translation_error: '翻訳できませんでした',
    plan_episode_title: '1話まるごとスポンサー',
    plan_episode_desc: 'あなたの広告を作品の「冒頭」と「巻末」に掲載。',
    plan_episode_price_display: '$200 / 話',
    input_shopname: '表示名',
    input_url: 'リンク先URL',
    input_images: 'ロゴ画像',
    upload_logo: 'ロゴをアップロード',
    select_chapter: 'スポンサーになりたい話数を選択',
    sold_out: 'SOLD OUT',
    available: '選択可能',
    purchase_confirm: 'デモ決済: スポンサー枠を購入しますか？',
    purchase_complete: '購入完了！',
    tab_latest: '新着・更新',
    tab_ranking: '人気ランキング',
    create_new_series: '連載を申請する',
    upload_chapter: 'エピソードの投稿',
    title: 'タイトル',
    author: '作者名',
    desc: 'あらすじ',
    upload_images: '漫画の原稿',
    create: '申請',
    publish: '公開',
    uploading: 'アップロード中...',
    cancel: 'キャンセル',
    admin_title: 'クリエイター管理画面',
    tab_works: '投稿',
    tab_requests: '収益',
    tab_dashboard: '分析',
    tab_studio: '制作ツール',
    ep_sponsor_req: '1話スポンサー',
    hope_chapter: '希望: 第',
    tap_to_select: '画像をタップして選択 (複数可)',
    no_requests: 'まだ依頼はありません',
    link_copied: 'リンクをコピーしました！',
    copy_link: 'コピー',
    close: '閉じる',
    share_this: 'この作品をシェア',
    status_pending: '審査中',
    status_approved: '連載中',
    apply_msg: '連載申請を受け付けました。',
    free_registration: 'クリエイター登録・連載申請は無料です',
    label_direction: '読む方向',
    dir_rtl: '右開き (日本など)',
    dir_ltr: '左開き (海外など)',
    label_language: '作品の言語',
    lang_ja: '日本語',
    lang_en: '英語',
    studio_title: 'Manga X Studio',
    studio_subtitle: 'あなたの小説を、プロクオリティの漫画に。',
    studio_desc: '原作テキストさえあれば、漫画化・翻訳・配信までワンストップでサポートします。',
    input_script: '原作小説・あらすじ',
    input_script_placeholder: 'ここに物語を入力してください...',
    style_shonen: '少年漫画風',
    style_shojo: '少女漫画風',
    style_seinen: '劇画・青年誌風',
    style_webtoon: 'Webtoon (カラー)',
    label_style: '作画スタイル',
    label_pages: '希望ページ数',
    cost_per_page: '$20 (約3,000円) / ページ',
    total_cost: 'お見積もり合計',
    order_btn: '契約内容の確認へ',
    payment_btn: '同意して支払う',
    contract_title: '制作委託契約および権利規定',
    contract_agree: '上記契約内容および利用規約に同意します',
    studio_step_1: '見積もり',
    studio_step_2: '契約',
    studio_step_3: '完了',
    order_complete_title: 'ご依頼ありがとうございます！',
    order_complete_msg:
      'お支払いが確認できました。制作を開始いたします。\n\n今後は登録メールアドレスにて、担当編集者より直接ご連絡差し上げます。\n（納期目安：20ページの場合 約2週間）',
    back_to_home: 'ホームへ戻る',
    install_app: 'アプリをインストール',
    install_desc: 'ホーム画面に追加して、最新話を通知で受け取ろう！',
    seo_desc: 'MangaXは、世界中のインディーズ漫画が集まるクロスボーダープラットフォームです。',
    config_error: '設定未完了',
    config_error_msg: 'VercelのEnvironment VariablesにFirebase設定を追加してください。',
    monthly_views: '月間ビュー',
    total_revenue: '総収益',
    global_readers: '海外読者',
    become_sponsor: 'スポンサーになる',
    latest_ep: '最新話',
    future_ep: '先行予約',
  },
  en: {
    app_name: 'MangaX by FOMUS',
    app_tagline: 'The Cross-Border Manga Platform',
    nav_home: 'Home',
    nav_free: 'Free',
    nav_search: 'Search',
    nav_mypage: 'My Page',
    nav_partners: 'Partners',
    guest_name: 'Guest',
    guest_label: 'Guest',
    new_badge: 'NEW',
    free_first: 'Free First Read',
    read_from_start: 'Read from Start',
    continue_reading: 'Continue Reading',
    read_finished: 'Read',
    share: 'Share',
    share_msg: 'Share & Support',
    presented_by: 'Presented by',
    sponsored_by_msg: 'This content is brought to you by our sponsors',
    special_thanks: 'Special Thanks',
    sponsor_desc: 'Sponsors who supported this story',
    official_site: "Visit Website",
    author_note: "Author's Note",
    finished_reading: 'Finished Reading',
    back_to_detail: 'Back to Details',
    next_chapter: 'Next',
    prev_chapter: 'Prev',
    chapter_list: 'Chapters',
    work_detail: 'Details',
    support_title: 'Become a Sponsor',
    support_btn: 'Become a Sponsor',
    premium_plan: 'Premium Plan',
    premium_desc: 'Unlock AI Translation and enjoy manga in your language.',
    premium_price: '$5 / month',
    premium_benefit_1: 'Instant AI Translation',
    premium_benefit_2: 'No Ads (Planned)',
    premium_benefit_3: 'Higher support rate',
    subscribe_btn: 'Subscribe Now',
    subscribed: 'Premium Member',
    unlock_translate: 'Use Translate (Premium)',
    ai_translate: 'AI Translate',
    translating: 'AI is translating...',
    translation_error: 'Translation Failed',
    plan_episode_title: 'Episode Sponsor',
    plan_episode_desc: 'Your ad appears at the START & END of the episode. Premium branding.',
    plan_episode_price_display: '$200 / Ep',
    input_shopname: 'Display Name',
    input_url: 'Link URL',
    input_images: 'Logo Image',
    upload_logo: 'Upload Logo',
    select_chapter: 'Select Episode',
    sold_out: 'SOLD OUT',
    available: 'Available',
    purchase_confirm: 'Demo Payment: Confirm payment?',
    purchase_complete: 'Payment Complete',
    tab_latest: 'Latest',
    tab_ranking: 'Ranking',
    create_new_series: 'Apply for Serialization',
    upload_chapter: 'Upload Episode',
    title: 'Title',
    author: 'Author',
    desc: 'Description',
    upload_images: 'Manga Pages',
    create: 'Apply',
    publish: 'Publish',
    uploading: 'Uploading...',
    cancel: 'Cancel',
    admin_title: 'Creator Studio',
    tab_works: 'Works',
    tab_requests: 'Revenue',
    tab_dashboard: 'Dashboard',
    tab_studio: 'Studio',
    ep_sponsor_req: 'Episode Sponsor',
    hope_chapter: 'Hope: Ep ',
    tap_to_select: 'Tap to select images (Multiple)',
    no_requests: 'No requests yet',
    link_copied: 'Link copied!',
    copy_link: 'Copy Link',
    close: 'Close',
    share_this: 'Share this series',
    status_pending: 'In Review',
    status_approved: 'Serialized',
    apply_msg: 'Application submitted.',
    free_registration: 'Registration is free.',
    label_direction: 'Reading Direction',
    dir_rtl: 'Right to Left (JP)',
    dir_ltr: 'Left to Right (Global)',
    label_language: 'Language',
    lang_ja: 'Japanese',
    lang_en: 'English',
    studio_title: 'Manga X Studio',
    studio_subtitle: 'Turn your novel into professional Manga.',
    studio_desc: 'We provide one-stop support from text to manga creation using our proprietary tools.',
    input_script: 'Novel / Script',
    input_script_placeholder: 'Paste your story here...',
    style_shonen: 'Shonen Style',
    style_shojo: 'Shojo Style',
    style_seinen: 'Seinen / Realistic',
    style_webtoon: 'Webtoon (Full Color)',
    label_style: 'Art Style',
    label_pages: 'Number of Pages',
    cost_per_page: '$20 / page',
    total_cost: 'Estimated Cost',
    order_btn: 'Proceed to Contract',
    payment_btn: 'Agree & Pay',
    contract_title: 'Production Agreement & Rights',
    contract_agree: 'I agree to the terms and conditions above.',
    studio_step_1: 'Quote',
    studio_step_2: 'Contract',
    studio_step_3: 'Done',
    order_complete_title: 'Thank you for your order!',
    order_complete_msg:
      'Payment received. Production will start soon.\n\nOur editor will contact you via email for further details.\n(Estimated delivery: 2 weeks for 20 pages)',
    back_to_home: 'Back to Home',
    install_app: 'Install App',
    install_desc: 'Add to home screen for notifications!',
    seo_desc: 'MangaX is the cross-border platform for indie manga.',
    config_error: 'Config Error',
    config_error_msg: 'Please set REACT_APP_FIREBASE_API_KEY in Vercel.',
    monthly_views: 'Monthly Views',
    total_revenue: 'Total Revenue',
    global_readers: 'Global Readers',
    become_sponsor: 'Become a sponsor',
    latest_ep: 'Latest',
    future_ep: 'Upcoming',
  },
};

// --- Helper Functions ---
const saveHistory = (userId, seriesId, chapterId, chapterNumber, seriesTitle) => {
  const historyKey = `manga_history_${userId}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || '{}');
  history[seriesId] = { seriesId, seriesTitle, chapterId, chapterNumber, lastReadAt: new Date().toISOString() };
  localStorage.setItem(historyKey, JSON.stringify(history));
};
const getRecentHistory = (userId) => {
  const historyKey = `manga_history_${userId}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || '{}');
  return Object.values(history).sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
};
const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        const scale = MAX / img.width;
        const w = Math.min(MAX, img.width);
        const h = img.height * (scale < 1 ? scale : 1);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });

const translateImageWithGemini = async (base64Image, targetLang, isPremium) => {
  if (!isPremium) throw new Error('PREMIUM_REQUIRED');

  if (!GEMINI_API_KEY) {
    await new Promise((r) => setTimeout(r, 1000));
    return [
      { original: 'APIキー未設定', translated: 'API Key Missing' },
      { original: 'Vercelで設定してください', translated: 'Set REACT_APP_GEMINI_API_KEY in Vercel' },
    ];
  }

  try {
    const inlineDataPart = base64Image.split(',')[1];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    'Extract all text bubbles from this manga page. Return a JSON array where each object has "original" (Japanese text found) and "translated" (English translation). Only return the JSON array, no markdown.',
                },
                { inlineData: { mimeType: 'image/jpeg', data: inlineDataPart } },
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// --- SEO Component ---
const SEO = ({ title, description, image, url, t }) => {
  const siteTitle = t('app_name');
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const desc = description || t('seo_desc');
  const siteUrl = url || window.location.href;
  const ogImage = image || 'https://placehold.co/1200x630/orange/white?text=MangaX+by+FOMUS';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

// --- Components ---
const InstallPrompt = ({ t }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 flex justify-between items-center px-4 sticky top-[54px] z-20 animate-fade-in-down shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-white p-1 rounded-md">
          <Smartphone size={20} className="text-orange-600" />
        </div>
        <div>
          <div className="text-xs font-bold">{t('install_app')}</div>
          <div className="text-[10px] text-white/90">{t('install_desc')}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('Browser install prompt')}
          className="bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-100"
        >
          GET
        </button>
        <button onClick={() => setShow(false)}>
          <X size={16} className="text-white/70 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

const CreatorDashboard = ({ requests, seriesList, t }) => {
  const totalRevenue = requests.reduce((sum, req) => sum + (req.price || 0), 0);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-bold uppercase">
            <DollarSign size={14} /> {t('total_revenue')}
          </div>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] opacity-80 mt-1">+ $200 (Pending)</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-bold uppercase">
            <Globe size={14} /> {t('global_readers')}
          </div>
          <div className="text-2xl font-bold">42%</div>
          <div className="text-[10px] opacity-80 mt-1">Top: USA, France</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Trophy size={18} /> {t('monthly_views')}
          </h3>
          <span className="text-xl font-bold text-gray-900">12,540</span>
        </div>
        <div className="h-32 flex items-end justify-between gap-1">
          {[40, 60, 45, 70, 90, 80, 100].map((h, i) => (
            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
              <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MangaStudioView = ({ t }) => {
  const [step, setStep] = useState(1);
  const [script, setScript] = useState('');
  const [style, setStyle] = useState('shonen');
  const [pages, setPages] = useState(10);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const price = pages * 20;
  const handlePayment = () => {
    if (!agreed) return alert('Agree to contract.');
    if (confirm(t('purchase_confirm'))) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 2000);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in">
      <div className="bg-black text-white p-6 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl"></div>
        <h2 className="text-2xl font-bold flex items-center gap-2 relative z-10">
          <Wand2 className="text-orange-400" /> {t('studio_title')}
        </h2>
        <p className="text-sm text-gray-400 mt-2 relative z-10">{t('studio_subtitle')}</p>
      </div>
      <div className="px-4 -mt-6 relative z-10 space-y-4">
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <p className="text-xs text-gray-500 mb-4 bg-orange-50 p-3 rounded leading-relaxed">
                <AlertCircle size={14} className="inline mr-1 mb-0.5 text-orange-500" />
                {t('studio_desc')}
              </p>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2 flex items-center gap-1">
                  <FileText size={14} /> {t('input_script')}
                </label>
                <textarea
                  className="w-full border p-3 rounded-lg text-sm h-32 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder={t('input_script_placeholder')}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-700 block mb-2 flex items-center gap-1">
                    <Palette size={14} /> {t('label_style')}
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg text-sm bg-white"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="shonen">{t('style_shonen')}</option>
                    <option value="shojo">{t('style_shojo')}</option>
                    <option value="seinen">{t('style_seinen')}</option>
                    <option value="webtoon">{t('style_webtoon')}</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-gray-700 block mb-2">{t('label_pages')}</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full border p-2 rounded-lg text-sm"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-500">{t('cost_per_page')}</span>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{t('total_cost')}</div>
                    <div className="text-2xl font-bold text-orange-600">${price}</div>
                  </div>
                </div>
                <button
                  onClick={() => (script ? setStep(2) : alert('Please input script'))}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  {t('order_btn')} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <FileCheck size={18} className="text-green-500" /> {t('contract_title')}
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 h-48 overflow-y-auto border border-gray-200 leading-relaxed">
                <p className="mb-2">
                  <strong>1. Rights</strong>
                  <br />
                  You retain all copyrights.
                </p>
                <p className="mb-2">
                  <strong>2. Delivery</strong>
                  <br />
                  ~2 weeks for 20 pages.
                </p>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-4 h-4 text-orange-600 rounded"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree" className="text-sm font-bold text-gray-800 cursor-pointer">
                  {t('contract_agree')}
                </label>
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <div className="text-right w-full">
                  <div className="text-xs text-gray-400">Total</div>
                  <div className="text-2xl font-bold text-gray-900 mb-4">${price}</div>
                  <button
                    onClick={handlePayment}
                    disabled={loading || !agreed}
                    className={`w-full text-white font-bold py-3 rounded-lg shadow-md flex justify-center items-center gap-2 ${
                      agreed ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    {loading ? <Loader className="animate-spin" /> : <DollarSign size={18} />}
                    {t('payment_btn')}
                  </button>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-gray-400 w-full text-center mt-2 underline">
                {t('cancel')}
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-8 animate-slide-up">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('order_complete_title')}</h3>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap mb-8">{t('order_complete_msg')}</p>
              <button
                onClick={() => setStep(1)}
                className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg"
              >
                {t('back_to_home')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlatformSponsorView = ({ onBack, t }) => {
  const handleApply = (tier) => {
    if (confirm(`${tier}: ${t('purchase_confirm')}`)) alert(t('purchase_complete'));
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-24 animate-fade-in">
      <div className="bg-gray-900 text-white p-8 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Handshake className="text-orange-400" /> Official Partners
          </h2>
          <p className="text-orange-200 text-sm font-bold mb-4">Support the Creators.</p>
        </div>
      </div>
      <div className="px-4 -mt-8 relative z-20 space-y-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-slate-200">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Crown className="text-slate-300" fill="currentColor" /> Platinum
            </div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">$10,000</div>
            <button onClick={() => handleApply('Platinum')} className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg shadow-md">
              {t('become_sponsor')}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-100">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold">
              <Star className="text-white" fill="currentColor" /> Gold
            </div>
          </div>
          <div className="p-5 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">$5,000</div>
            <button onClick={() => handleApply('Gold')} className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg shadow">
              {t('become_sponsor')}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <button onClick={onBack} className="w-full bg-gray-200 py-3 rounded font-bold text-gray-600">
          {t('close')}
        </button>
      </div>
    </div>
  );
};

const PremiumModal = ({ isOpen, onClose, onSubscribe, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl w-full max-w-sm p-6 relative overflow-hidden shadow-2xl border border-yellow-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold text-center mb-2 mt-4">{t('premium_plan')}</h3>
        <p className="text-center text-gray-400 text-sm mb-6">{t('premium_desc')}</p>
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-yellow-400">{t('premium_price')}</span>
        </div>
        <button
          onClick={onSubscribe}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <Crown size={20} fill="black" />
          {t('subscribe_btn')}
        </button>
      </div>
    </div>
  );
};

const ShareModal = ({ isOpen, onClose, title, text, url = window.location.href, t }) => {
  if (!isOpen) return null;
  const shareText = `${text}\n${title} #MangaX`;
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${url}`);
    } else {
      const ta = document.createElement('textarea');
      ta.value = `${shareText} ${url}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    alert(t('link_copied'));
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-sm p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-center mb-6 text-gray-800">{t('share_this')}</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:bg-gray-200 transition-colors">
              <LinkIcon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-600">{t('copy_link')}</span>
          </button>
        </div>
        <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-full font-bold text-gray-700 transition-colors">
          {t('close')}
        </button>
      </div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, t }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-40 text-xs text-gray-500 pb-safe safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    {['home', 'free', 'partners', 'mypage'].map((k) => (
      <button
        key={k}
        onClick={() => setActiveTab(k)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === k ? 'text-orange-600 font-bold' : 'hover:text-gray-900'
        }`}
      >
        {k === 'home' ? (
          <Home size={24} />
        ) : k === 'free' ? (
          <Calendar size={24} />
        ) : k === 'partners' ? (
          <Handshake size={24} />
        ) : (
          <User size={24} />
        )}
        <span>{t(`nav_${k}`)}</span>
      </button>
    ))}
  </div>
);

const SeriesCard = ({ series, onClick, t, rank }) => (
  <div
    onClick={() => onClick(series)}
    className="flex gap-3 p-3 bg-white border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors hover:bg-gray-50 relative"
  >
    {rank && (
      <div
        className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center text-white font-bold text-xs rounded-br-lg z-10 ${
          rank === 1 ? 'bg-yellow-500 shadow-md' : rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-orange-400' : 'bg-gray-800'
        }`}
      >
        {rank}
      </div>
    )}
    <div className="w-24 h-32 flex-shrink-0 bg-gray-200 rounded overflow-hidden relative shadow-sm group">
      {series.coverUrl ? (
        <img
          src={series.coverUrl}
          alt={series.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ImageIcon size={24} />
        </div>
      )}
      {series.status !== 'approved' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
          {t('status_pending')}
        </div>
      )}
      {!rank && series.isNew && series.status === 'approved' && (
        <span className="absolute top-0 left-0 bg-orange-600 text-white text-[10px] px-1 py-0.5 font-bold shadow-md">
          {t('new_badge')}
        </span>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-between py-1">
      <div>
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 text-[15px]">{series.title}</h3>
        <p className="text-xs text-gray-500 mb-2">{series.author}</p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
          <Globe size={10} /> {t(series.language ? `lang_${series.language}` : 'lang_ja')} •{' '}
          {t(series.direction === 'ltr' ? 'dir_ltr' : 'dir_rtl')}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="bg-orange-50 text-orange-600 text-[10px] px-2 py-0.5 rounded font-medium border border-orange-100">
          {t('free_first')}
        </span>
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-0.5">
            <Heart size={14} /> {series.totalLikes || 0}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const SupportStoreView = ({ series, onBack, userId, chapters, t }) => {
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopLink, setShopLink] = useState('');
  const [targetChapter, setTargetChapter] = useState(null);
  const [images, setImages] = useState([]);
  const [takenChapters, setTakenChapters] = useState([]);
  const latestChapterNum = chapters.length > 0 ? Math.max(...chapters.map((c) => c.number)) : 0;
  const sponsorableRange = [0, 1, 2, 3, 4].map((i) => latestChapterNum + i).filter((n) => n > 0);
  useEffect(() => {
    const q = query(
      collection(db, 'artifacts', APP_ID, 'public', 'data', 'requests'),
      where('seriesId', '==', series.id),
      where('type', '==', 'episode')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setTakenChapters(snapshot.docs.map((d) => d.data().targetChapterNumber));
    });
    return unsub;
  }, [series.id]);
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setLoading(true);
    const processed = [];
    for (const file of files) {
      processed.push(await compressImage(file));
    }
    setImages([...images, ...processed]);
    setLoading(false);
  };
  const handlePurchase = async () => {
    if (!shopName || !shopLink || images.length < 1 || !targetChapter) return alert('Required');
    if (!confirm(t('purchase_confirm'))) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'requests'), {
        type: 'episode',
        seriesId: series.id,
        seriesTitle: series.title,
        userId: userId,
        status: 'pending',
        createdAt: serverTimestamp(),
        price: 200,
        shopName,
        shopLink,
        targetChapterNumber: Number(targetChapter),
        images,
      });
      alert(t('purchase_complete'));
      onBack();
    } catch (e) {
      alert('Error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-20">
        <button onClick={onBack}>
          <ChevronLeft />
        </button>
        <h2 className="font-bold text-gray-800 ml-2">{t('support_title')}</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in-up border-2 border-yellow-400">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2 text-lg text-gray-800">
              <Crown className="text-yellow-500" /> {t('plan_episode_title')}
            </h3>
            <span className="font-bold text-xl text-red-500">{t('plan_episode_price_display')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t('plan_episode_desc')}</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">{t('select_chapter')}</label>
              <div className="grid grid-cols-1 gap-2">
                {sponsorableRange.length > 0 ? (
                  sponsorableRange.map((num) => {
                    const isTaken = takenChapters.includes(num);
                    const isLatest = num === latestChapterNum;
                    return (
                      <button
                        key={num}
                        onClick={() => !isTaken && setTargetChapter(num)}
                        disabled={isTaken}
                        className={`flex items-center justify-between p-3 rounded border text-sm transition-colors ${
                          targetChapter === num
                            ? 'bg-yellow-50 border-yellow-500 text-yellow-800 ring-1 ring-yellow-500'
                            : isTaken
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">#{num}</span>
                          {isLatest && (
                            <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
                              {t('latest_ep')}
                            </span>
                          )}
                          {num > latestChapterNum && (
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
                              {t('future_ep')}
                            </span>
                          )}
                        </div>
                        {isTaken ? (
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <Lock size={10} /> {t('sold_out')}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-yellow-600">{t('available')}</span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 text-xs py-4">N/A</div>
                )}
              </div>
            </div>
            {targetChapter && (
              <div className="space-y-3 pt-4 border-t border-gray-100 animate-fade-in">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t('input_shopname')}</label>
                  <input className="w-full border bg-gray-50 p-3 rounded" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t('input_url')}</label>
                  <input className="w-full border bg-gray-50 p-3 rounded" value={shopLink} onChange={(e) => setShopLink(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">{t('input_images')}</label>
                  <div className="flex gap-2 mb-2">
                    {images.map((img, i) => (
                      <div key={i} className="w-full h-32 bg-gray-900 rounded overflow-hidden relative border border-gray-200">
                        <img src={img} className="w-full h-full object-contain" />
                        <button onClick={() => setImages([])} className="absolute top-2 right-2 bg-white/20 text-white p-1 rounded-full">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <label className="w-full h-32 bg-gray-50 rounded border-2 border-dashed flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                        <Upload size={24} />
                        <span className="text-xs mt-2">{t('upload_logo')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                      </label>
                    )}
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg shadow-md mt-4 flex justify-center items-center gap-2 transform active:scale-95 transition-all"
                >
                  {loading ? <Loader className="animate-spin" /> : <DollarSign size={20} />} Sponsor Ep {targetChapter}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReaderView = ({ chapter, series, onBack, t, isPremium, onOpenPremium }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [translationData, setTranslationData] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [showTranslateSheet, setShowTranslateSheet] = useState(false);
  const [episodeSponsor, setEpisodeSponsor] = useState(null);
  const [reactions, setReactions] = useState({ like: 0, fire: 0 });
  const [showShare, setShowShare] = useState(false);
  const scrollContainerRef = useRef(null);
  const direction = series.direction === 'ltr' ? 'ltr' : 'rtl';
  useEffect(() => {
    if (chapter.usePageCollection) {
      const q = query(
        collection(db, 'artifacts', APP_ID, 'public', 'data', 'pages'),
        where('chapterId', '==', chapter.id),
        orderBy('index')
      );
      onSnapshot(q, (snapshot) => {
        setPages(snapshot.docs.map((doc) => doc.data().imageUrl));
        setLoading(false);
      });
      const qEp = query(
        collection(db, 'artifacts', APP_ID, 'public', 'data', 'requests'),
        where('seriesId', '==', series.id),
        where('type', '==', 'episode'),
        where('targetChapterNumber', '==', chapter.number),
        orderBy('createdAt', 'desc')
      );
      onSnapshot(qEp, (snap) => setEpisodeSponsor(!snap.empty ? snap.docs[0].data() : null));
      setReactions({ like: chapter.likes || 0, fire: chapter.fires || 0 });
    } else {
      setLoading(false);
    }
  }, [chapter, series.id]);
  const handleTranslate = async () => {
    if (!isPremium) {
      onOpenPremium();
      return;
    }
    setTranslating(true);
    setShowTranslateSheet(true);
    try {
      const result = await translateImageWithGemini(pages[0], 'en', isPremium);
      setTranslationData(result);
    } catch (e) {
      alert(t('translation_error'));
    } finally {
      setTranslating(false);
    }
  };
  const handleReaction = async (type) => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    const chapterRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'chapters', chapter.id);
    const field = type === 'like' ? 'likes' : 'fires';
    await updateDoc(chapterRef, { [field]: increment(1) });
    const seriesRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'series', series.id);
    await updateDoc(seriesRef, { totalLikes: increment(1) });
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: series.title,
          text: `${series.title} #MangaX`,
          url: window.location.href,
        });
      } catch (error) {}
    } else {
      setShowShare(true);
    }
  };
  const hasSponsor = !!episodeSponsor;
  if (loading)
    return <div className="fixed inset-0 bg-black text-white flex items-center justify-center">Loading...</div>;
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col h-full w-full">
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title={series.title}
        text={`Read ep ${chapter.number}`}
        t={t}
      />
      <div
        className={`absolute top-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent text-white flex justify-between z-50 transition-transform ${
          showUI ? '' : ' -translate-y-full'
        }`}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold drop-shadow-md">#{chapter.number}</span>
      </div>
      {showTranslateSheet && (
        <div className="absolute bottom-20 left-4 right-4 z-[60] bg-black/90 border border-yellow-500/30 rounded-xl p-4 text-white max-h-[40vh] overflow-y-auto animate-slide-up">
          <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Sparkles size={16} /> {t('ai_translate')}
            </div>
            <button onClick={() => setShowTranslateSheet(false)}>
              <X size={16} />
            </button>
          </div>
          {translating ? (
            <div className="py-4 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
              <Loader className="animate-spin text-yellow-500" />
              {t('translating')}
            </div>
          ) : (
            <div className="space-y-3">
              {translationData &&
                translationData.map((d, i) => (
                  <div key={i} className="bg-white/10 p-2 rounded text-sm">
                    <div className="text-xs text-gray-400">{d.original}</div>
                    <div className="font-bold text-yellow-100">{d.translated}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      <div
        ref={scrollContainerRef}
        dir={direction}
        className="flex-1 w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex items-center scroll-smooth no-scrollbar"
        onClick={() => setShowUI(!showUI)}
      >
        {hasSponsor && (
          <div className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center bg-black relative text-white">
            <div className="text-xs tracking-[0.5em] text-gray-400 mb-8 uppercase">{t('presented_by')}</div>
            <div className="w-64 h-64 bg-white/5 rounded-full flex items-center justify-center p-8 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8">
              <img src={episodeSponsor.images[0]} className="w-full h-full object-contain filter drop-shadow-lg" />
            </div>
            <h2 className="text-xl font-bold tracking-widest">{episodeSponsor.shopName}</h2>
            <div className="absolute bottom-10 text-[10px] text-gray-600">{t('sponsored_by_msg')}</div>
          </div>
        )}
        {pages.map((url, i) => (
          <div key={i} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center relative bg-black">
            <img src={url} className="max-h-full max-w-full object-contain shadow-2xl" />
          </div>
        ))}
        {hasSponsor && (
          <div className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center bg-zinc-900 relative text-white">
            <div className="text-2xl font-bold mb-2">{t('special_thanks')}</div>
            <p className="text-sm text-gray-400 mb-8">{t('sponsor_desc')}</p>
            <div className="bg-white text-black p-6 rounded-xl w-[80%] max-w-sm shadow-2xl">
              <div className="w-full h-32 mb-4 flex items-center justify-center bg-gray-50 rounded">
                <img src={episodeSponsor.images[0]} className="max-h-full max-w-full object-contain" />
              </div>
              <h3 className="font-bold text-lg mb-1">{episodeSponsor.shopName}</h3>
              <a
                href={episodeSponsor.shopLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-blue-600 text-white font-bold py-3 rounded text-center text-sm hover:bg-blue-700"
              >
                {t('official_site')} <ExternalLink size={12} className="inline ml-1" />
              </a>
            </div>
          </div>
        )}
        <div className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center bg-[#111] text-white p-4">
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="flex gap-6 mb-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction('like');
                }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shadow-lg group-hover:bg-pink-200">
                  <Heart size={32} fill="currentColor" />
                </div>
                <span className="text-pink-400 font-bold text-sm">{reactions.like}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction('fire');
                }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-lg group-hover:bg-orange-200">
                  <Flame size={32} fill="currentColor" />
                </div>
                <span className="text-orange-400 font-bold text-sm">{reactions.fire}</span>
              </button>
            </div>
            <button
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-8 rounded-full w-full transition-all flex items-center justify-center gap-2 mb-3"
            >
              <Share2 size={18} /> {t('share_msg')}
            </button>
            <button
              onClick={onBack}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full w-full"
            >
              {t('back_to_detail')}
            </button>
          </div>
        </div>
      </div>
      <div className={`absolute bottom-0 w-full z-50 transition-transform ${showUI ? '' : ' translate-y-full'}`}>
        <div className="absolute bottom-20 right-4 flex flex-col gap-3">
          <button
            onClick={handleTranslate}
            className={`p-3 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md border ${
              isPremium ? 'bg-black/50 text-yellow-400 border-yellow-500/50' : 'bg-gray-800/80 text-gray-400 border-gray-600'
            }`}
          >
            {isPremium ? <Languages size={24} /> : <Lock size={20} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction('like');
            }}
            className="bg-black/50 backdrop-blur-md p-3 rounded-full text-pink-500 border border-white/10 active:scale-90 transition-transform"
          >
            <Heart size={24} fill="currentColor" />
          </button>
        </div>
        <div className="bg-gradient-to-t from-black/90 to-transparent p-4 pb-8 text-white flex justify-between">
          <button className="text-gray-400 text-sm flex items-center gap-1">
            {direction === 'rtl' ? (
              <>
                <ChevronRight size={16} /> {t('next_chapter')}
              </>
            ) : (
              <>
                <ChevronLeft size={16} /> {t('prev_chapter')}
              </>
            )}
          </button>
          <button className="text-gray-400 text-sm flex items-center gap-1">
            {direction === 'rtl' ? (
              <>
                {t('prev_chapter')} <ChevronLeft size={16} />
              </>
            ) : (
              <>
                {t('next_chapter')} <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailView = ({ series, onBack, onRead, chapters, history, onOpenStore, t }) => {
  const [activeTab, setActiveTab] = useState('chapters');
  const [showShare, setShowShare] = useState(false);
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);
  const historyItem = history.find((h) => h.seriesId === series.id);
  const nextChapter = historyItem
    ? sortedChapters.find((c) => c.number > historyItem.chapterNumber) || sortedChapters[sortedChapters.length - 1]
    : sortedChapters[0];
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: series.title,
          text: `${series.title} #MangaX`,
          url: window.location.href,
        });
      } catch (error) {}
    } else {
      setShowShare(true);
    }
  };
  return (
    <div className="bg-white min-h-screen pb-20 animate-fade-in">
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} title={series.title} text="" t={t} />
      <div className="relative w-full h-48 md:h-72 bg-gray-900 overflow-hidden group">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        {series.coverUrl ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1]" />
            <img src={series.coverUrl} className="w-full h-full object-cover opacity-70 blur-sm scale-110" />
            <div className="absolute -bottom-6 left-4 z-10 flex items-end gap-3">
              <img src={series.coverUrl} className="w-24 h-36 object-cover rounded shadow-xl border-2 border-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
        )}
      </div>
      <div className="px-4 pt-8 pb-2">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-gray-900 flex-1 mr-2 mt-1">{series.title}</h1>
          <div className="flex gap-3 mt-1">
            <button className="flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors">
              <Heart size={20} />
              <span className="text-[10px]">{series.totalLikes || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Share2 size={20} />
              <span className="text-[10px]">{t('share')}</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{series.author}</p>
        <button
          onClick={onOpenStore}
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-transform"
        >
          <Crown size={18} className="text-yellow-300" />
          <span className="drop-shadow-sm">{t('support_btn')}</span>
        </button>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-3">{series.description || '...'}</p>
      </div>
      <div className="flex border-b border-gray-200 mt-4 sticky top-0 bg-white z-10 shadow-sm">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex-1 py-3 text-sm font-bold text-center relative transition-colors ${
            activeTab === 'chapters' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {t('chapter_list')}
          {activeTab === 'chapters' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />}
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-sm font-bold text-center relative transition-colors ${
            activeTab === 'info' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {t('work_detail')}
          {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />}
        </button>
      </div>
      {activeTab === 'chapters' && (
        <div className="p-0">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-xs text-gray-500">
            <span>Total {chapters.length}</span>
            <span className="text-orange-600 font-bold">
              {historyItem ? `${t('continue_reading')}: #${nextChapter?.number}` : ''}
            </span>
          </div>
          {sortedChapters.map((chapter) => {
            const isRead = historyItem && historyItem.chapterNumber >= chapter.number;
            return (
              <div
                key={chapter.id}
                className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  isRead ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => onRead(chapter)}
              >
                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative group">
                  <img
                    src={chapter.thumbnailUrl || series.coverUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isRead && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[10px] font-bold">
                      {t('read_finished')}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className={`text-sm font-bold ${isRead ? 'text-gray-500' : 'text-gray-800'}`}>#{chapter.number}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{chapter.publishDate || '2025/11/20'}</span>
                    <span className="text-[10px] text-red-400 bg-red-50 px-1 rounded flex items-center gap-0.5">
                      <Heart size={8} /> {chapter.likes || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 text-[10px] border border-blue-500 px-2 py-0.5 rounded font-medium">Free</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {nextChapter && (
        <div className="fixed bottom-20 left-0 right-0 px-4 flex justify-center z-20 pointer-events-none animate-slide-up">
          <button
            onClick={() => onRead(nextChapter)}
            className="bg-orange-600 text-white font-bold py-3 px-12 rounded-full shadow-lg shadow-orange-500/30 pointer-events-auto hover:bg-orange-700 active:scale-95 transition-all transform flex items-center gap-2"
          >
            <BookOpen size={18} />
            {historyItem ? t('continue_reading') : t('read_from_start')}
          </button>
        </div>
      )}
    </div>
  );
};

const AdminView = ({ onBack, userId, t }) => {
  const [seriesList, setSeriesList] = useState([]);
  const [mode, setMode] = useState('dashboard');
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [chapNumber, setChapNumber] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [readingDir, setReadingDir] = useState('rtl');
  const [language, setLanguage] = useState('ja');

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'series'), orderBy('updatedAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSeriesList(all.filter((s) => s.createdBy === userId));
    });
    const qReq = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'requests'), orderBy('createdAt', 'desc'));
    onSnapshot(qReq, (snap) => setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [userId]);

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const processed = [];
    for (const f of files) processed.push(await compressImage(f));
    setSelectedImages(processed);
  };
  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  const handleCreateSeries = async () => {
    if (!title) return;
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'series'), {
      title,
      author,
      coverUrl,
      description: desc,
      updatedAt: serverTimestamp(),
      createdBy: userId,
      isNew: true,
      totalLikes: 0,
      status: 'pending',
      direction: readingDir,
      language: language,
    });
    alert(t('apply_msg'));
    setMode('list');
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setDesc('');
  };
  const handleAddChapter = async () => {
    if (!selectedImages.length) return;
    const chapterRef = await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'chapters'), {
      seriesId: selectedSeriesId,
      number: Number(chapNumber),
      publishedAt: serverTimestamp(),
      title: `Ep ${chapNumber}`,
      usePageCollection: true,
      thumbnailUrl: selectedImages[0],
      authorNote: authorNote,
      likes: 0,
      fires: 0,
    });
    const batch = writeBatch(db);
    selectedImages.forEach((imgData, index) => {
      const pageRef = doc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'pages'));
      batch.set(pageRef, { chapterId: chapterRef.id, index: index, imageUrl: imgData });
    });
    await batch.commit();
    setMode('list');
    setChapNumber('');
    setSelectedImages([]);
    setAuthorNote('');
  };
  const demoApprove = async (id) => {
    await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'series', id), { status: 'approved' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <button onClick={onBack}>
          <ChevronLeft />
        </button>
        <h2 className="font-bold text-gray-800">{t('admin_title')}</h2>
      </div>
      <div className="flex bg-white border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setMode('dashboard')}
          className={`flex-1 py-3 text-xs font-bold whitespace-nowrap ${
            mode === 'dashboard' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
          }`}
        >
          {t('tab_dashboard')}
        </button>
        <button
          onClick={() => setMode('list')}
          className={`flex-1 py-3 text-xs font-bold whitespace-nowrap ${
            mode === 'list' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
          }`}
        >
          {t('tab_works')}
        </button>
        <button
          onClick={() => setMode('requests')}
          className={`flex-1 py-3 text-xs font-bold whitespace-nowrap ${
            mode === 'requests' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
          }`}
        >
          {t('tab_requests')}
        </button>
        <button
          onClick={() => setMode('studio')}
          className={`flex-1 py-3 text-xs font-bold whitespace-nowrap ${
            mode === 'studio' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'
          }`}
        >
          {t('tab_studio')}
        </button>
      </div>
      <div className="p-4">
        {mode === 'dashboard' && <CreatorDashboard requests={requests} seriesList={seriesList} t={t} />}
        {mode === 'list' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5" />
              {t('free_registration')}
            </div>
            <button
              onClick={() => setMode('newSeries')}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} /> {t('create_new_series')}
            </button>
            <div className="space-y-2">
              {seriesList.map((s) => (
                <div key={s.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3">
                  <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                    <img src={s.coverUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-bold text-sm">{s.title}</div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded h-fit ${
                          s.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {s.status === 'approved' ? t('status_approved') : t('status_pending')}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedSeriesId(s.id);
                          setMode('newChapter');
                        }}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded font-bold"
                      >
                        + Ep
                      </button>
                      {s.status !== 'approved' && (
                        <button
                          onClick={() => demoApprove(s.id)}
                          className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded"
                        >
                          Demo: Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {mode === 'requests' && (
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="bg-white p-3 rounded shadow">
                <div className="font-bold">${r.price}</div>
                <div className="text-xs text-gray-500">{r.shopName}</div>
              </div>
            ))}
          </div>
        )}
        {mode === 'studio' && <MangaStudioView t={t} />}
        {(mode === 'newSeries' || mode === 'newChapter') && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">{mode === 'newSeries' ? t('create_new_series') : t('upload_chapter')}</h3>
            {mode === 'newSeries' && (
              <>
                <input
                  className="border p-2 w-full mb-2"
                  placeholder={t('title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="border p-2 w-full mb-2"
                  placeholder={t('author')}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="flex gap-2 mb-2">
                  <select
                    className="border p-2 w-1/2 rounded"
                    value={readingDir}
                    onChange={(e) => setReadingDir(e.target.value)}
                  >
                    <option value="rtl">{t('dir_rtl')}</option>
                    <option value="ltr">{t('dir_ltr')}</option>
                  </select>
                  <select
                    className="border p-2 w-1/2 rounded"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="ja">{t('lang_ja')}</option>
                    <option value="en">{t('lang_en')}</option>
                  </select>
                </div>
                <input
                  className="border p-2 w-full mb-2"
                  placeholder={t('cover_url')}
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
                <textarea
                  className="border p-2 w-full mb-2 h-20"
                  placeholder={t('desc')}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </>
            )}
            {mode === 'newChapter' && (
              <>
                <input
                  className="border p-2 w-full mb-2"
                  placeholder={t('chapter_num')}
                  value={chapNumber}
                  onChange={(e) => setChapNumber(e.target.value)}
                />
                <textarea
                  className="border p-2 w-full mb-2 h-20"
                  placeholder={t('author_note')}
                  value={authorNote}
                  onChange={(e) => setAuthorNote(e.target.value)}
                />
              </>
            )}
            <div className="border-2 dashed p-4 text-center relative">
              <input type="file" multiple className="absolute inset-0 opacity-0" onChange={handleImageSelect} />
              <Upload className="mx-auto" />
            </div>
            <button
              onClick={mode === 'newSeries' ? handleCreateSeries : handleAddChapter}
              className="w-full bg-orange-600 text-white py-2 mt-2 font-bold"
            >
              {t('create')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [view, setView] = useState('home');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [homeTab, setHomeTab] = useState('latest');
  const [seriesData, setSeriesData] = useState([]);
  const [chaptersData, setChaptersData] = useState([]);
  const [history, setHistory] = useState([]);
  const [lang, setLang] = useState('ja');
  const t = (key) => RESOURCES[lang][key] || key;
  const toggleLang = () => setLang((prev) => (prev === 'ja' ? 'en' : 'ja'));

  useEffect(() => {
    if (!isConfigured) {
      console.error(RESOURCES.ja.config_error_msg);
      return;
    }
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setHistory(getRecentHistory(u.uid));
        const userRef = doc(db, 'artifacts', APP_ID, 'users', u.uid, 'profile', 'status');
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().isPremium) {
          setIsPremium(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    if (!user) return;
    const userRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'profile', 'status');
    await setDoc(userRef, { isPremium: true }, { merge: true });
    setIsPremium(true);
    setShowPremiumModal(false);
    alert('Premium activated.');
  };
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'series'), orderBy('updatedAt', 'desc'));
    onSnapshot(q, (snap) => setSeriesData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [user]);
  useEffect(() => {
    if (!user || !selectedSeries) return;
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'chapters'));
    onSnapshot(q, (snap) =>
      setChaptersData(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => c.seriesId === selectedSeries.id))
    );
  }, [user, selectedSeries]);
  const goDetail = (series) => {
    setSelectedSeries(series);
    setView('detail');
  };
  const goReader = (chapter) => {
    saveHistory(user.uid, selectedSeries.id, chapter.id, chapter.number, selectedSeries.title);
    setHistory(getRecentHistory(user.uid));
    setSelectedChapter(chapter);
    setView('reader');
  };
  const publicSeries = seriesData.filter((s) => s.status === 'approved');
  const rankingData = [...publicSeries].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
  const displayData = homeTab === 'ranking' ? rankingData : publicSeries;

  if (!isConfigured)
    return (
      <div className="flex h-screen items-center justify-center text-red-600 font-bold p-4 text-center">
        設定未完了
        <br />
        <span className="text-xs font-normal text-gray-600">コード内の FIREBASE_CONFIG にキーを設定してください</span>
      </div>
    );
  if (!user) return <div className="flex h-screen items-center justify-center text-orange-600 font-bold animate-pulse">Loading...</div>;

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-100">
      <HelmetProvider>
        <SEO t={t} />
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
          t={t}
        />
        {view === 'admin' ? (
          <AdminView onBack={() => setView('home')} userId={user.uid} t={t} />
        ) : view === 'reader' && selectedChapter ? (
          <ReaderView
            chapter={selectedChapter}
            series={selectedSeries}
            onBack={() => setView('detail')}
            t={t}
            isPremium={isPremium}
            onOpenPremium={() => setShowPremiumModal(true)}
          />
        ) : view === 'store' && selectedSeries ? (
          <SupportStoreView series={selectedSeries} onBack={() => setView('detail')} userId={user.uid} chapters={chaptersData} t={t} />
        ) : view === 'partners' ? (
          <PlatformSponsorView onBack={() => setView('home')} t={t} />
        ) : view === 'detail' && selectedSeries ? (
          <DetailView
            series={selectedSeries}
            chapters={chaptersData}
            onBack={() => setView('home')}
            onRead={goReader}
            history={history}
            onOpenStore={() => setView('store')}
            t={t}
          />
        ) : (
          <div className="pb-20">
            <header className="bg-white text-gray-900 px-4 py-3 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100/80 backdrop-blur-md bg-white/90">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isPremium ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isPremium ? <Crown size={16} /> : <User size={16} />}
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">{isPremium ? t('subscribed') : t('guest_label')}</div>
                  <div className="text-xs font-bold">{t('guest_name')}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200"
                >
                  <Globe size={14} /> {lang === 'ja' ? 'EN' : 'JP'}
                </button>
                {!isPremium && (
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"
                  >
                    <Crown size={12} /> UPGRADE
                  </button>
                )}
                <button onClick={() => setView('admin')} className="text-gray-400 p-1">
                  <Settings size={20} />
                </button>
              </div>
            </header>
            <div className="p-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 h-36 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden mb-4">
                <div className="z-10 text-center">
                  <div className="text-3xl italic tracking-tighter">{t('app_name')}</div>
                  <div className="text-[10px] bg-black/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm mt-1">{t('app_tagline')}</div>
                </div>
              </div>
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setHomeTab('latest')}
                  className={`flex-1 pb-3 text-sm font-bold text-center relative ${
                    homeTab === 'latest' ? 'text-orange-600' : 'text-gray-400'
                  }`}
                >
                  {t('tab_latest')}
                  {homeTab === 'latest' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />}
                </button>
                <button
                  onClick={() => setHomeTab('ranking')}
                  className={`flex-1 pb-3 text-sm font-bold text-center relative ${
                    homeTab === 'ranking' ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  {t('tab_ranking')}
                  {homeTab === 'ranking' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500" />}
                </button>
              </div>
              {displayData.map((series, idx) => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  onClick={goDetail}
                  t={t}
                  rank={homeTab === 'ranking' ? idx + 1 : null}
                />
              ))}
              {displayData.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No series found</div>}
              <InstallPrompt t={t} />
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
          </div>
        )}
      </HelmetProvider>
    </div>
  );
}
