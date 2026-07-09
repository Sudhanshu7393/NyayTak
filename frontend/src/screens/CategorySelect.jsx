import { useState, useEffect } from "react";
import { Laptop, Scale, ScrollText, Home, ShoppingCart, Users, Briefcase, Car, ClipboardList, Banknote, Stethoscope, HeartHandshake, Compass, FileText, ListChecks, Gauge, BookOpen, Phone, Mic, Volume2, Square, Share2, Globe, Settings, Bookmark, BookmarkCheck, ChevronDown, ArrowLeft, ArrowRight, X, Sun, Moon, LifeBuoy, MapPin, Check, RotateCw, Send, Sparkles } from "lucide-react";
import { FONT_HEAD, FONT_BODY, CATEGORIES, ICONS } from "../data.js";
import { JaliSVG, BackBtn, LangSelect, SettingsBtn, Stepper, Disclaimer } from "../components/ui.jsx";

function CategorySelect({ onSelect, onGeneral, onBack, t, lang, setLang, settings }) {
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),50);},[]);
  return (
    <div style={{ position:"relative",display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 30% at 50% 0%, var(--hero-glow) 0%, transparent 55%), linear-gradient(180deg,var(--bg2),var(--bg))",zIndex:0 }}/>
      <JaliSVG opacity={0.16}/>
      <div style={{ position:"relative",zIndex:40,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--border-soft)",flexShrink:0 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ flex:1 }}><span style={{ fontFamily:FONT_HEAD,fontSize:"calc(19px * var(--fs))",fontWeight:700,color:"var(--text)" }}>Nyay<span style={{ color:"#f0a500" }}>Tak</span></span><div style={{ fontSize:"calc(10px * var(--fs))",color:"var(--text-dim)" }}>{t.topicSub}</div></div>
        <LangSelect lang={lang} setLang={setLang}/><SettingsBtn t={t} {...settings}/>
      </div>
      <Stepper step={1} t={t}/>
      <div style={{ flex:1,overflowY:"auto",padding:"6px 13px 13px",position:"relative",zIndex:10 }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9 }}>
          {CATEGORIES.map((cat,i)=>{ const c=cat.tr[lang]; const I=ICONS[cat.id]; return (
            <button key={cat.id} onClick={()=>onSelect(cat)} style={{ padding:"14px 8px",borderRadius:14,textAlign:"center",background:cat.card,border:`1px solid ${cat.border}`,cursor:"pointer",fontFamily:FONT_BODY,boxShadow:"0 3px 12px rgba(0,0,0,0.12)",opacity:v?1:0,animation:v?`nsFadeUp 0.3s ease ${i*0.03}s both`:undefined,transition:"transform 0.2s,box-shadow 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 7px 22px ${cat.glow}`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.12)";}}>
              <div style={{ width:38,height:38,margin:"0 auto 8px",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",background:cat.card,border:`1px solid ${cat.border}` }}><I size={20} color={cat.color}/></div>
              <div style={{ fontSize:"calc(10.5px * var(--fs))",fontWeight:600,color:cat.color,marginBottom:2,lineHeight:1.3 }}>{c.t}</div>
              <div style={{ fontSize:"calc(9.5px * var(--fs))",color:"var(--text-dim)" }}>{c.s}</div>
            </button>
          );})}
        </div>
        <button onClick={onGeneral} style={{ marginTop:11,width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,textAlign:"left",cursor:"pointer",background:"linear-gradient(135deg,rgba(240,165,0,0.13),rgba(240,165,0,0.04))",border:"1px dashed rgba(240,165,0,0.45)",fontFamily:"inherit",opacity:v?1:0,animation:v?"nsFadeUp 0.4s ease 0.4s both":undefined }}>
          <Compass size={24} color="#f0a500"/>
          <div style={{ flex:1 }}><div style={{ fontSize:"calc(13px * var(--fs))",fontWeight:700,color:"#f0a500" }}>{t.smartTitle}</div><div style={{ fontSize:"calc(11px * var(--fs))",color:"var(--text-dim)",marginTop:2 }}>{t.smartDesc}</div></div>
          <ArrowRight size={17} color="#f0a500"/>
        </button>
      </div>
    </div>
  );
}

export default CategorySelect;
