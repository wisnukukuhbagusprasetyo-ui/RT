'use client';
import React,{useEffect,useState} from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
export default function CrudKas({ collectionName, canWrite=false }:{ collectionName:string, canWrite?: boolean }){
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({keterangan:'',jumlah:0,tipo:'masuk'});
  const [editId,setEditId]=useState<string|null>(null);

  useEffect(()=>{
    const q=query(collection(db,collectionName),orderBy('createdAt','desc'));
    const unsub=onSnapshot(q,(snap)=>setItems(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[collectionName]);

  async function onAdd(e:React.FormEvent){
    e.preventDefault(); if(!canWrite) return;
    await addDoc(collection(db,collectionName),{...form, createdAt: new Date().toISOString()});
    setForm({keterangan:'',jumlah:0,tipo:'masuk'});
  }
  async function onDel(id:string){ if(!canWrite) return; await deleteDoc(doc(db,collectionName,id)); }
  async function onEditStart(it:any){ setEditId(it.id); setForm({keterangan:it.keterangan||'',jumlah:it.jumlah||0,tipo:it.tipo||'masuk'}); }
  async function onSave(){ if(!editId) return; await updateDoc(doc(db,collectionName,editId),form); setEditId(null); setForm({keterangan:'',jumlah:0,tipo:'masuk'}); }

  return (<section className="card" style={{marginTop:16}}>
    <h3>Kas / Iuran</h3>
    {canWrite && <form className="row2" onSubmit={onAdd}>
      <input className="input" placeholder="Keterangan" value={form.keterangan} onChange={e=>setForm({...form,keterangan:e.target.value})}/>
      <input className="input" type="number" placeholder="Jumlah" value={form.jumlah} onChange={e=>setForm({...form,jumlah:Number(e.target.value)})}/>
      <select className="input" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
        <option value="masuk">Masuk</option>
        <option value="keluar">Keluar</option>
      </select>
      <button className="btn" type="submit">Tambah</button>
    </form>}
    <table className="table" style={{marginTop:12}}>
      <thead><tr><th>Keterangan</th><th>Jumlah</th><th>Tipe</th><th>Aksi</th></tr></thead>
      <tbody>{items.map(it=>(<tr key={it.id}>
        <td>{editId===it.id ? <input className="input" value={form.keterangan} onChange={e=>setForm({...form,keterangan:e.target.value})}/> : it.keterangan}</td>
        <td>{editId===it.id ? <input className="input" type="number" value={form.jumlah} onChange={e=>setForm({...form,jumlah:Number(e.target.value)})}/> : it.jumlah}</td>
        <td>{editId===it.id ? <select className="input" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option value="masuk">Masuk</option><option value="keluar">Keluar</option></select> : it.tipo}</td>
        <td style={{display:'flex',gap:8}}>
          {canWrite ? (editId===it.id ? <button className="btn" onClick={onSave} type="button">Simpan</button> : <><button className="btn" onClick={()=>onEditStart(it)} type="button">Edit</button><button className="btn" onClick={()=>onDel(it.id)} type="button">Hapus</button></>) : <span className="badge">Read-only</span>}
        </td>
      </tr>))}</tbody>
    </table>
  </section>);
}