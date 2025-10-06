import Link from 'next/link';
export default function Home(){
  return (<main className="container">
    <nav><b className="gold">Portal RT Cilosari Barat</b><span style={{flex:1}}/><Link href='/(auth)/login'>Login</Link><Link href='/(auth)/register'>Daftar</Link></nav>
    <section className="card" style={{marginTop:16}}>
      <h1>Selamat datang 👋</h1>
      <p>Next.js + Firebase Auth + Firestore + PWA. Tema <span className="gold">biru-emas</span>.</p>
      <p><Link href='/(auth)/register' className="btn">Mulai Daftar</Link></p>
    </section></main>);
}