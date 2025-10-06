'use client';
import React,{useState} from 'react';
import { signInWithEmailAndPassword,getIdToken } from 'firebase/auth';
import { auth,db } from '@/lib/firebaseClient';
import { doc,getDoc } from 'firebase/firestore';
function toDashboard(role?:string){switch((role||'warga').toLowerCase()){case 'rt':return '/(dashboard)/dashboard-rt';case 'pkk':return '/(dashboard)/dashboard-pkk';case 'karang':return '/(dashboard)/dashboard-karang';default:return '/(dashboard)/dashboard-warga';}}
export default function LoginPage(){const[form,setForm]=useState({email:'',password:''});const[loading,setLoading]=useState(false);const[msg,setMsg]=useState<string|null>(null);
async function onSubmit(e:React.FormEvent){e.preventDefault();setLoading(true);setMsg(null);
  try{const cred=await signInWithEmailAndPassword(auth,form.email,form.password);
    const idToken=await getIdToken(cred.user,true);
    await fetch('/api/sessionLogin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})});
    const snap=await getDoc(doc(db,'users',cred.user.uid));const role=snap.exists()?(snap.data() as any).role:'warga';
    window.location.href=toDashboard(role);
  }catch(err:any){setMsg(err?.message||'Gagal login')}finally{setLoading(false);}}
return(<main className="container"><nav><a href="/">← Beranda</a></nav><div className="card" style={{marginTop:16}}><h2>Login</h2><form className="row" onSubmit={onSubmit}><input className="input" type="email" placeholder="Email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input className="input" type="password" placeholder="Password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="btn" disabled={loading}>{loading?'Memproses...':'Masuk'}</button></form>{msg&&<p style={{color:'#fca5a5'}}>{msg}</p>}<p style={{marginTop:8}}>Belum punya akun? <a href="/(auth)/register">Daftar</a></p></div></main>);}
