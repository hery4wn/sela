'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {CircleHelp} from 'lucide-react';
export function confirmAction(message){return new Promise(resolve=>window.dispatchEvent(new CustomEvent('sela-confirm',{detail:{message,resolve}})))}
export default function ConfirmDialog(){
 const [request,setRequest]=useState(null),pending=useRef(),dialog=useRef();
 useEffect(()=>{const handler=e=>{pending.current?.resolve(false);pending.current=e.detail;setRequest(e.detail)};window.addEventListener('sela-confirm',handler);return()=>{window.removeEventListener('sela-confirm',handler);pending.current?.resolve(false)}},[]);
 useEffect(()=>{if(request)dialog.current?.showModal()},[request]);
 function finish(value){dialog.current?.close();pending.current?.resolve(value);pending.current=null;setRequest(null)}
 if(!request)return null;
 const ending=request.message.startsWith('Akhiri sesi'),deleting=request.message.startsWith('Hapus');
 return createPortal(<dialog ref={dialog} className="confirm-dialog" aria-labelledby="confirmation-title" aria-describedby="confirmation-message" onCancel={e=>{e.preventDefault();finish(false)}} onClick={e=>{if(e.target===dialog.current)finish(false)}}><span className="confirm-symbol"><CircleHelp size={26}/></span><h2 id="confirmation-title">{ending?'Selesai untuk sekarang?':deleting?'Hapus kosakata ini?':'Buat ulang dengan AI?'}</h2><p id="confirmation-message">{request.message}</p><div className="form-actions"><button autoFocus type="button" className="button secondary" onClick={()=>finish(false)}>{ending?'Lanjut belajar':'Batal'}</button><button type="button" className={`button ${deleting?'danger':'primary'}`} onClick={()=>finish(true)}>{ending?'Akhiri sesi':deleting?'Hapus kosakata':'Buat ulang'}</button></div></dialog>,document.body);
}
