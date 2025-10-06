'use client';
import React,{useEffect,useState} from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
export default function CrudAgenda({ collectionName, canWrite=false }:{ collectionName:string, canWrite?: boolean }){
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({kegiatan:'',waktu:'',lokasi:''});
  const [editId,setEditId]=useState<string|null>(null);

  useEffect(()=>{
    const q=query(collection(db,collectionName),orderBy('waktu','desc'));
    const unsub=onSnapshot(q,(snap)=>setItems(snap.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>unsub();
  },[collectionName]);

  async function onAdd(e:React.FormEvent){
    e.preventDefault(); if(!canWrite) return;
    await addDoc(collection(db,collectionName),form);
    setForm({kegiatan:'',waktu:'',lokasi:''});
  }
  async function onDel(id:string){ if(!canWrite) return; await deleteDoc(doc(db,collectionName,id)); }
  async function onEditStart(it:any){ setEditId(it.id); setForm({kegiatan:it.kegiatan||'',waktu:it.waktu||'',lokasi:it.lokasi||''}); }
  async function onSave(){ if(!editId) return; await updateDoc(doc(db,collectionName,editId),form); setEditId(null); setForm({kegiatan:'',waktu:'',lokasi:''}); }

  return (<section className="card" style={{marginTop:16}}>
    <h3>Agenda</h3>
    {canWrite && <form className="row2" onSubmit={onAdd}>
      <input className="input" placeholder="Kegiatan" value={form.kegiatan} onChange={e=>setForm({...form,kegiatan:e.target.value})}/>
      <input className="input" placeholder="Waktu (cth: 2025-10-15 19:30)" value={form.waktu} onChange={e=>setForm({...form,waktu:e.target.value})}/>
      <input className="input" placeholder="Lokasi" value={form.lokasi} onChange={e=>setForm({...form,lokasi:e.target.value})}/>
      <button className="btn" type="submit">Tambah</button>
    </form>}
    <table className="table" style={{marginTop:12}}>
      <thead><tr><th>Kegiatan</th><th>Waktu</th><th>Lokasi</th><th>Aksi</th></tr></thead>
      <tbody>{items.map(it=>(<tr key={it.id}>
        <td>{editId===it.id ? <input className="input" value={form.kegiatan} onChange={e=>setForm({...form,kegiatan:e.target.value})}/> : it.kegiatan}</td>
        <td>{editId===it.id ? <input className="input" value={form.waktu} onChange={e=>setForm({...form,waktu:e.target.value})}/> : it.waktu}</td>
        <td>{editId===it.id ? <input className="input" value={form.lokasi} onChange={e=>setForm({...form,lokasi:e.target.value})}/> : it.lokasi}</td>
        <td style={{display:'flex',gap:8}}>
          {canWrite ? (editId===it.id ? <button className="btn" onClick={onSave} type="button">Simpan</button> : <><button className="btn" onClick={()=>onEditStart(it)} type="button">Edit</button><button className="btn" onClick={()=>onDel(it.id)} type="button">Hapus</button></>) : <span className="badge">Read-only</span>}
        </td>
      </tr>))}</tbody>
    </table>
  </section>);
}