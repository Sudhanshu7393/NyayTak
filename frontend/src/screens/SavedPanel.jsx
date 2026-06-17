import { Laptop, Scale, ScrollText, Home, ShoppingCart, Users, Briefcase, Car, ClipboardList, Banknote, Stethoscope, HeartHandshake, Compass, FileText, ListChecks, Gauge, BookOpen, Phone, Mic, Volume2, Square, Share2, Globe, Settings, Bookmark, BookmarkCheck, ChevronDown, ArrowLeft, ArrowRight, X, Sun, Moon, LifeBuoy, MapPin, Check, RotateCw, Send, Sparkles } from "lucide-react";
import { FONT_HEAD } from "../data.js";
import { IconBtn } from "../components/ui.jsx";

function SavedPanel({ saved, onClose, onRemove, t }) {
  return (
    <div style={{ position:"absolute",inset:0,zIndex:95,background:"var(--overlay)",backdropFilter:"blur(4px)",display:"flex",flexDirection:"column",padding:"18px 14px" }}>
      <div style={{ flex:1,display:"flex",flexDirection:"column",background:"var(--modal-bg)",border:"1px solid rgba(240,165,0,0.28)",borderRadius:16,overflow:"hidden",boxShadow:"0 18px 50px rgba(0,0,0,0.4)" }}>
        <div style={{ padding:"13px 16px",borderBottom:"1px solid var(--border-soft)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ display:"flex",alignItems:"center",gap:8,fontFamily:FONT_HEAD,fontSize:"calc(18px * var(--fs))",fontWeight:700,color:"#f0a500" }}><Bookmark size={17}/> {t.savedTitle}</span>
          <IconBtn onClick={onClose} label="Close"><X size={16}/></IconBtn>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"16px" }}>
          {saved.length===0 ? (
            <div style={{ textAlign:"center",color:"var(--text-dim)",fontSize:"calc(13px * var(--fs))",marginTop:40,lineHeight:1.6 }}>{t.savedEmpty}</div>
          ) : saved.map(s=>(
            <div key={s.key} style={{ padding:"13px 14px",borderRadius:12,background:"var(--surface)",border:"1px solid var(--border)",marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6 }}>
                <span style={{ fontSize:"calc(11px * var(--fs))",fontWeight:700,color:"#f0a500" }}>{s.q}</span>
                <button onClick={()=>onRemove(s.key)} aria-label="Remove" style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-dim)",flexShrink:0 }}><X size={14}/></button>
              </div>
              <div style={{ fontSize:"calc(12.5px * var(--fs))",color:"var(--text-mid)",whiteSpace:"pre-wrap",lineHeight:1.55 }}>{s.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedPanel;
