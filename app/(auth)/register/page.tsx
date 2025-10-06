'use client';
import React,{useState} from 'react';
import { auth,db } from '@/lib/firebaseClient';
import { createUserWithEmailAndPassword,updateProfile,getIdToken } from 'firebase/auth';
import { doc,setDoc,serverTimestamp } from 'firebase/firestore';
function toDashboard(role?:string){switch((role||'warga').toLowerCase()){case 'rt':return '/(dashboard)/dashboard-rt';case 'pkk':return '/(dashboard)/dashboard-pkk';case 'karang':return '/(dashboard)/dashboard-karang';default:return '/(dashboard)/dashboard-warga';}}
export default function RegisterPage(){const[form,setForm]=useState({name:'',email:'',password:'',role:'warga'});const[loading,setLoading]=useState(false);const[msg,setMsg]=useState<string|null>(null);
async function onSubmit(e:React.FormEvent){e.preventDefault();setLoading(true);setMsg(null);
  try{const cred=await createUserWithEmailAndPassword(auth,form.email,form.password);
    await updateProfile(cred.user,{displayName:form.name});
    await setDoc(doc(db,'users',cred.user.uid),{name:form.name,email:form.email,role:form.role,createdAt:serverTimestamp()});
    const idToken=await getIdToken(cred.user,true);
    await fetch('/api/sessionLogin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})});
    window.location.href=toDashboard(form.role);
  }catch(err:any){setMsg(err?.message||'Gagal mendaftar')}finally{setLoading(false);}}
return(<main className="container"><nav><a href="/">← Beranda</a></nav><div className="card" style={{marginTop:16}}><h2>Daftar Akun</h2><form className="row" onSubmit={onSubmit}><input className="input" placeholder="Nama" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className="input" type="email" placeholder="Email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input className="input" type="password" placeholder="Password (min 6)" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="warga">Warga (default)</option><option value="rt">Admin RT</option><option value="pkk">PKK</option><option value="karang">Karang Taruna</option></select><button className="btn" disabled={loading}>{loading?'Memproses...':'Daftar'}</button></form>{msg&&<p style={{color:'#fca5a5'}}>{msg}</p>}<p style={{marginTop:8}}>Sudah punya akun? <a href="/(auth)/login">Login</a></p></div></main>);}
