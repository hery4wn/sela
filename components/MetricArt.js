import {useId} from 'react';

// Decorative illustrations: the adjacent metric text carries the accessible name.
export default function MetricArt({kind}) {
 const id=useId().replaceAll(':',''),fill=`url(#${id})`;
 const colors=kind==='words'?['#a2e8db','#278f86']:kind==='review'?['#ffdbc4','#ea947b']:['#bcebd0','#4cae88'];
 return <svg className="metric-art" viewBox="0 0 80 72" fill="none" aria-hidden="true" focusable="false">
  <defs><linearGradient id={id} x1="20" y1="10" x2="61" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor={colors[0]}/><stop offset="1" stopColor={colors[1]}/></linearGradient></defs>
  <ellipse cx="40" cy="63" rx="25" ry="5" fill={colors[1]} opacity=".13"/>
  {kind==='words'?<>
   <path d="M12 23Q25 17 40 24Q55 17 68 23V57Q54 52 40 60Q26 52 12 57Z" fill={colors[1]}/>
   <path d="M15 18Q28 14 40 22V54Q27 47 15 52Z" fill="#fffaf0" stroke="#c6e3d6"/>
   <path d="M40 22Q53 14 65 18V52Q52 47 40 54Z" fill={fill}/>
   <path d="M40 23V55" stroke="#247e77" opacity=".3"/>
   <path d="M21 28Q27 27 33 30M21 35Q27 34 33 37M21 42L29 44" stroke="#9dbcb1" strokeWidth="2.5" strokeLinecap="round"/>
   <path d="M50 18V35L54 32L58 34V16" fill="#ffc291"/>
  </>:kind==='review'?<>
   <rect x="18" y="15" width="37" height="44" rx="10" transform="rotate(-13 18 15)" fill="#f5d8c5"/>
   <rect x="27" y="15" width="37" height="46" rx="10" transform="rotate(9 27 15)" fill={fill}/>
   <rect x="31" y="22" width="24" height="29" rx="6" transform="rotate(9 31 22)" fill="#fff5e9"/>
   <path d="M48 32A10 10 0 1 0 49 44" stroke="#c3755b" strokeWidth="3.5" strokeLinecap="round"/>
   <path d="M43 31L49 32L49 26" stroke="#c3755b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </>:<>
   <rect x="15" y="17" width="50" height="43" rx="12" fill={fill}/>
   <path d="M17 32H63V48Q63 58 53 58H27Q17 58 17 48Z" fill="#fff9ee"/>
   <path d="M28 13V23M52 13V23" stroke="#368d73" strokeWidth="5" strokeLinecap="round"/>
   <circle cx="28" cy="40" r="2.5" fill="#b9d9c9"/><circle cx="38" cy="40" r="2.5" fill="#b9d9c9"/><circle cx="28" cy="49" r="2.5" fill="#b9d9c9"/>
   <circle cx="54" cy="52" r="13" fill="#ffca94" stroke="#fff6e7" strokeWidth="3"/>
   <path d="M48 52L52 56L60 48" stroke="#8a633e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </>}
  <path d="M68 7L69.5 11.5L74 13L69.5 14.5L68 19L66.5 14.5L62 13L66.5 11.5Z" fill="#efbb75"/>
  <circle cx="11" cy="40" r="2" fill={colors[1]} opacity=".45"/>
 </svg>;
}
