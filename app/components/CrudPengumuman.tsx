'use client';
import React,{useEffect,useState} from 'react';
import { db, auth } from '@/lib/firebaseClient';
import { collection, addDoc, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
export default function CrudPengumuman({ canWrite=false }:{ canWrite?: boolean }){
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({judul:'',isi:''});
  const [editId,setEditId]=useState<string|null>(null);

  useEffect(()=>{
    const q=query(collection(db,'pengumuman'),orderBy('tanggal','desc'));
    const unsub=onSnapshot(q,(snap)=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return ()=>unsub();
  },[]);

  async function onAdd(e:React.FormEvent){
    e.preventDefault();
    if(!canWrite) return;
    await addDoc(collection(db,'pengumuman'),{
      judul: form.judul, isi: form.isi,
      tanggal: Timestamp.now(), dibuatOleh: auth.currentUser?.email || 'anon'
    });
    setForm({judul:'',isi:''});
  }

  async function onDelete(id:string){ if(!canWrite) return; await deleteDoc(doc(db,'pengumuman',id)); }
  async function onEditStart(it:any){ setEditId(it.id); setForm({judul:it.judul||'', isi:it.isi||''}); }
  async function onEditSave(){ if(!editId) return; await updateDoc(doc(db,'pengumuman',editId),{judul:form.judul, isi:form.isi}); setEditId(null); setForm({judul:'',isi:''}); }

  return (<section className="card" style={{marginTop:16}}>
    <h3>Pengumuman</h3>
    {canWrite && <form className="row2" onSubmit={onAdd}>
      <input className="input" placeholder="Judul" value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})}/>
      <input className="input" placeholder="Isi singkat" value={form.isi} onChange={e=>setForm({...form,isi:e.target.value})}/>
      <button className="btn" type="submit">Tambah</button>
    </form>}
    <table className="table" style={{marginTop:12}}>
      <thead><tr><th>Judul</th><th>Isi</th><th>Tanggal</th><th>Aksi</th></tr></thead>
      <tbody>
        {items.map(it=>(
          <tr key={it.id}>
            <td>{editId===it.id ? <input className="input" value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})}/> : it.judul}</td>
            <td>{editId===it.id ? <input className="input" value={form.isi} onChange={e=>setForm({...form,isi:e.target.value})}/> : it.isi}</td>
            <td>{it.tanggal?.toDate?.().toLocaleString?.('id-ID')||'-'}</td>
            <td style={{display:'flex',gap:8}}>
              {canWrite ? (
                editId===it.id
                  ? <button className="btn" onClick={onEditSave} type="button">Simpan</button>
                  : <><button className="btn" onClick={()=>onEditStart(it)} type="button">Edit</button><button className="btn" onClick={()=>onDelete(it.id)} type="button">Hapus</button></>
              ) : <span className="badge">Read-only</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>);
}