import './globals.css';
export const metadata={title:'Sela — Sedikit hari ini, lebih ingat besok',description:'Ruang kecil untuk kosakata Inggris dan Indonesia. Belajar dengan kartu, gambar, dan pengulangan terjadwal.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Sela',statusBarStyle:'default'},icons:{icon:'/icon.svg',apple:'/icon-192.png'}};
export const viewport={width:'device-width',initialScale:1,themeColor:'#087f7b'};
export default function RootLayout({children}) {return <html lang="id" suppressHydrationWarning><body>{children}</body></html>}
