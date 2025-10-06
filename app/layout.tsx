import './globals.css';
import SwRegistrar from './components/SwRegistrar';
export const metadata = { title:'Portal RT Cilosari Barat', description:'Portal resmi RT01/RW08 – Login, Dashboard & PWA' };
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="id"><head><link rel="manifest" href="/manifest.json"/><link rel="icon" href="/icon-192.png"/><meta name="theme-color" content="#1E3A8A"/></head><body><SwRegistrar/>{children}</body></html>);
}