import { useState } from "react";
import { UI, GENERAL_CAT, findCat, FONT_BODY } from "./data.js";
import Landing from "./screens/Landing.jsx";
import CategorySelect from "./screens/CategorySelect.jsx";
import ScenarioSelect from "./screens/ScenarioSelect.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";
import SavedPanel from "./screens/SavedPanel.jsx";

export default function NyayTak() {
  const [screen,setScreen]=useState("landing");
  const [cat,setCat]=useState(null);
  const [scenario,setScenario]=useState(null);
  const [scenarioIdx,setScenarioIdx]=useState(-1);
  const [custom,setCustom]=useState(false);
  const [lang,setLang]=useState("hinglish");
  const [theme,setTheme]=useState("dark");
  const [fontScale,setFontScale]=useState(1);
  const [state,setState]=useState("All India");
  const [saved,setSaved]=useState([]);
  const [showSaved,setShowSaved]=useState(false);
  const t=UI[lang];
  const settings={ theme, setTheme, fontScale, setFontScale, state, setState };

  const toggleSave=(item)=>setSaved(s=> s.some(x=>x.key===item.key) ? s.filter(x=>x.key!==item.key) : [item,...s]);
  const removeSave=(key)=>setSaved(s=>s.filter(x=>x.key!==key));
  const goChat=(c,scn,idx)=>{ setCat(c); setScenario(scn); setScenarioIdx(idx); setCustom(idx===-1); setScreen("chat"); };

  return (
    <div className={`ns-app ns-${theme}`} style={{ fontFamily:FONT_BODY, "--fs":fontScale }}>

      <div className="ns-frame">
        <div key={screen} className="ns-screen" style={{ animation:"nsScreen 0.32s ease both" }}>
          {screen==="landing"  && <Landing t={t} lang={lang} setLang={setLang} settings={settings} savedCount={saved.length} onShowSaved={()=>setShowSaved(true)} onStart={()=>setScreen("category")} onQuick={(cid,idx)=>{ const c=findCat(cid); goChat(c, c.tr[lang].sc[idx], idx); }} />}
          {screen==="category" && <CategorySelect t={t} lang={lang} setLang={setLang} settings={settings} onSelect={(c)=>{ setCat(c); setScreen("scenario"); }} onGeneral={()=>{ setCat(GENERAL_CAT); setScreen("scenario"); }} onBack={()=>setScreen("landing")} />}
          {screen==="scenario" && <ScenarioSelect t={t} lang={lang} setLang={setLang} settings={settings} fontScale={fontScale} cat={cat} onSelect={(s,idx)=>goChat(cat,s,idx)} onBack={()=>setScreen("category")} />}
          {screen==="chat"     && <ChatScreen t={t} lang={lang} setLang={setLang} settings={settings} fontScale={fontScale} state={state} cat={cat} scenario={scenario} scenarioIdx={scenarioIdx} custom={custom} saved={saved} onToggleSave={toggleSave} onShowSaved={()=>setShowSaved(true)} onBack={()=>setScreen("scenario")} />}
        </div>
        {showSaved && <SavedPanel saved={saved} onClose={()=>setShowSaved(false)} onRemove={removeSave} t={t}/>}
      </div>
    </div>
  );
}
