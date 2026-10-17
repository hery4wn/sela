'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {getSupabase} from '../lib/supabase.mjs';
import {readAccount,appendOperations,acknowledge,commitOperation} from '../lib/storage.mjs';
import {syncBatches} from '../lib/sync-batches.mjs';
import {newOp} from '../lib/engine.mjs';

const EMPTY={operations:[],acked:[],lastSync:null};
export function useWorkspace(notify){
 const [session,setSession]=useState(null),[account,setAccount]=useState(null),[record,setRecord]=useState(EMPTY),[ready,setReady]=useState(false),[online,setOnline]=useState(true),[syncState,setSyncState]=useState('local'),[error,setError]=useState(''),[services,setServices]=useState({}),[recovery,setRecovery]=useState(false);
 const current=useRef(null),recordRef=useRef(EMPTY),channel=useRef(null),syncing=useRef(false),sb=getSupabase();
 const update=useCallback(value=>{recordRef.current=value;setRecord(value)},[]);
 useEffect(()=>{const refresh=()=>setOnline(navigator.onLine);refresh();window.addEventListener('online',refresh);window.addEventListener('offline',refresh);fetch('/api/status').then(r=>r.json()).then(setServices).catch(()=>{});
 let alive=true;const load=s=>{if(alive){setSession(s);setAccount(s?.user?.id||'local')}};
 if(sb){sb.auth.getSession().then(({data})=>load(data.session));var {data:listener}=sb.auth.onAuthStateChange((event,s)=>{if(event==='PASSWORD_RECOVERY')setRecovery(true);load(s)});}else load(null);
 return()=>{alive=false;listener?.subscription.unsubscribe();window.removeEventListener('online',refresh);window.removeEventListener('offline',refresh)};
 },[sb]);
 useEffect(()=>{if(!account)return;current.current=account;setReady(false);update(EMPTY);setError('');setSyncState(account==='local'?'local':'pending');
 let active=true;readAccount(account).then(v=>{if(active){update(v);setReady(true)}}).catch(()=>{if(active){setError('Penyimpanan perangkat tidak tersedia. Izinkan penyimpanan browser sebelum melanjutkan.');setReady(false)}});
 if('BroadcastChannel'in window){channel.current=new BroadcastChannel('sela-workspace');channel.current.onmessage=e=>{if(e.data===account)readAccount(account).then(v=>{if(active)update(v)}).catch(()=>{})};}
 return()=>{active=false;current.current=null;channel.current?.close()};
 },[account,update]);
 const commit=useCallback(async(type,entity,fields={})=>{
  const owner=account;if(!owner||!ready||current.current!==owner)throw new Error('Akun berubah. Buka kembali kartu sebelum menyimpan.');
  const {op,next}=await commitOperation(owner,type,entity,fields);
  if(current.current===owner){update(next);channel.current?.postMessage(owner)}return op;
 },[ready,account,update]);
 const append=useCallback(async ops=>{const owner=account;if(!owner||current.current!==owner)throw new Error('Akun berubah. Coba kembali.');const next=await appendOperations(owner,ops);if(current.current===owner){update(next);channel.current?.postMessage(owner)}},[account,update]);
 const api=useCallback(async(path,options={})=>{
  const expected=account,auth=(await sb?.auth.getSession())?.data?.session;
  if(expected!==current.current||(auth?.user?.id||'local')!==expected)throw new Error('Akun berubah. Permintaan dibatalkan.');
  const token=auth?.access_token;
  const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||'Permintaan gagal. Periksa koneksi lalu coba lagi.')}return response;
 },[sb,account]);
 const sync=useCallback(async()=>{
  const owner=current.current;if(!owner||owner==='local'||!online||syncing.current)return;
  syncing.current=true;setSyncState('syncing');setError('');
  try{
   const local=await readAccount(owner),acked=new Set(local.acked),pending=local.operations.filter(o=>!acked.has(o.id));
   for(const batch of syncBatches(pending)){if(current.current!==owner)return;await api('/api/sync',{method:'POST',body:JSON.stringify({operations:batch})});}
   const remote=[];let after=null;do{if(current.current!==owner)return;const data=await (await api('/api/sync'+(after?'?after='+after:''))).json();remote.push(...data.operations);after=data.next;}while(after);
   if(current.current!==owner)return;const next=await acknowledge(owner,remote);update(next);channel.current?.postMessage(owner);setSyncState(next.operations.some(o=>!next.acked.includes(o.id))?'pending':'synced');
  }catch(e){if(current.current===owner){setSyncState('error');setError(e.message)}}finally{syncing.current=false;}
 },[api,online,update]);
 useEffect(()=>{if(!ready||!session)return;const timer=setTimeout(sync,900);return()=>clearTimeout(timer)},[ready,session,record.operations.length,online,sync]);
 useEffect(()=>{const focus=()=>{if(current.current&&current.current!=='local')sync()};window.addEventListener('focus',focus);return()=>window.removeEventListener('focus',focus)},[sync]);
 useEffect(()=>{if(!session)return;const timer=setInterval(()=>{if(document.visibilityState==='visible')sync()},60000);return()=>clearInterval(timer)},[session,sync]);
 return {session,account,record,ready:ready&&current.current===account,online,syncState,error,services,recovery,setRecovery,commit,append,api,sync,sb,notify};
}
