import {aiResultSchema} from './schema.mjs';

export function shortPronunciation(value='') {
 const ipa=value.match(/\/([^/\n]{1,90})\//);
 if(ipa)return `/${ipa[1]}/`;
 const bracket=value.match(/\[([^\]\n]{1,90})\]/);
 if(bracket)return bracket[1];
 return value.replace(/^[^:]+:\s*/,'').split(/\s+[—–·]|\n/)[0].trim().slice(0,90);
}

export function combineMeanings(result,source,word){
 const {meanings}=aiResultSchema.parse(result);
 const numbered=fn=>meanings.map((m,i)=>`${i+1}. ${fn(m)}`).join('\n\n');
 return {
  en:source==='en'?word.trim():meanings[0].en,
  idn:[...new Set(meanings.map(m=>m.idn))].join('; '),
  explanation:numbered(m=>`${m.en} — ${m.idn}\n${m.explanation}`),
  example:numbered(m=>`${m.idn}: ${m.example}`),
  translation:numbered(m=>m.translation),
  phonetic:shortPronunciation(meanings[0].phonetic),
 };
}
