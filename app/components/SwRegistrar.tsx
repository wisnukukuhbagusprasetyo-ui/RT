'use client';
import { useEffect } from 'react';
export default function SwRegistrar(){
  useEffect(()=>{ if('serviceWorker' in navigator){ window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js').catch(()=>{});});}},[]);
  return null;
}