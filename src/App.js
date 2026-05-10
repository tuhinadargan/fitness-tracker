import React, { useState, useEffect } from 'react';

const STEP_TARGETS = { strength:6000, walk:9000, rest:null, mobility:null };

const WARMUP = ["Neck rolls — 30 sec","Shoulder circles — 30 sec each way","Cat-cow on mat — 1 min","Hip circles standing — 1 min","March in place — 2 min"];
const COOLDOWN = ["Child's pose — 1 min","Figure-4 hip stretch — 1 min each side","Chest opener against wall — 1 min","4-7-8 breathing — 2 min (non-negotiable)"];

const MOBILITY = [
  {id:"m1",name:"Cat-cow",dur:"1 min slow",tip:"Feel every vertebra. Don't rush."},
  {id:"m2",name:"Thread-the-needle",dur:"1 min each side",tip:"Opens upper back + rear shoulders."},
  {id:"m3",name:"Hip flexor stretch (low lunge)",dur:"1 min each side",tip:"Tight hip flexors switch off glutes."},
  {id:"m4",name:"Figure-4 glute stretch",dur:"1 min each side",tip:"Ankle over knee, gently press knee away."},
  {id:"m5",name:"Doorway chest opener",dur:"1 min",tip:"Arms at 90°, lean through doorframe."},
  {id:"m6",name:"Seated forward fold",dur:"1 min",tip:"Hamstrings + lower back. No bouncing."},
  {id:"m7",name:"4-7-8 breathing",dur:"3 min",tip:"In 4 counts, hold 7, out 8. Drops cortisol."},
];

const WALK_TIPS = [
  {icon:"🌅",text:"Morning preferred — sunlight supports thyroid function and cortisol rhythm"},
  {icon:"🌳",text:"Outdoor always beats treadmill — lowers cortisol and speeds mitochondrial recovery"},
  {icon:"💬",text:"Conversational pace only — 50–60% HR max. If you can't speak, slow down."},
  {icon:"🚫",text:"Don't use walk days to compensate for missed strength sessions"},
  {icon:"🦶",text:"No headphones for at least half — being present is part of the protocol"},
];

const STRENGTH = {
  p1: {
    label:"Phase 1 — Restore", subtitle:"Weeks 1–4 · 3 strength days · 25–30 min", tagline:"Build the habit. Test your tolerance. Minimum effective dose.", weeks:4,
    days:[
      {id:"A",label:"Session A",focus:"Upper Body + Core",exercises:[
        {id:"p1a1",name:"Knee Push-ups",sets:3,reps:"10",startWeight:"Bodyweight",tip:"Progress to incline push-up when easy."},
        {id:"p1a2",name:"Incline Bench Press",sets:3,reps:"10",startWeight:"5.5kg each",tip:"Bench at 45°. Your established starting point.",star:true},
        {id:"p1a3",name:"Single Arm DB Row",sets:3,reps:"10 each",startWeight:"5.5kg",tip:"Knee + hand on bench. Squeeze shoulder blade at top."},
        {id:"p1a4",name:"DB Bicep Curl",sets:2,reps:"10",startWeight:"5.5kg",tip:"No swinging. Slow on the way down."},
        {id:"p1a5",name:"Tricep Extension",sets:3,reps:"10",startWeight:"5.5kg",tip:"Elbows pointing forward — don't flare."},
        {id:"p1a6",name:"Dead Bug",sets:3,reps:"6 each side",startWeight:"Bodyweight",tip:"Exhale fully. Lower back flat on mat."},
      ]},
      {id:"B",label:"Session B",focus:"Glutes + Hamstrings",exercises:[
        {id:"p1b1",name:"Hip Thrust off Bench",sets:3,reps:"12",startWeight:"Bodyweight",tip:"Your #1 exercise. 2-sec squeeze at top.",star:true},
        {id:"p1b2",name:"Romanian Deadlift",sets:3,reps:"10",startWeight:"6–8kg",tip:"Hinge at hips, soft knees. Hamstring stretch not lower back."},
        {id:"p1b3",name:"Band Clam (side-lying)",sets:3,reps:"15 each",startWeight:"Band",tip:"Glute med focus. Don't let hip rock backward."},
        {id:"p1b4",name:"Band Kickback",sets:3,reps:"12 each",startWeight:"Band",tip:"Slow. Feel the glute not the lower back."},
        {id:"p1b5",name:"Glute Bridge",sets:2,reps:"15",startWeight:"Bodyweight",tip:"Heels into floor. Hold 2 sec at top."},
      ]},
      {id:"C",label:"Session C",focus:"Full Body",exercises:[
        {id:"p1c1",name:"Goblet Squat",sets:3,reps:"12",startWeight:"6–8kg",tip:"Sit back not down. Chest tall, heels down."},
        {id:"p1c2",name:"Flat Bench DB Press",sets:3,reps:"10",startWeight:"5.5kg each",tip:"Elbows 45° from body — not flared wide."},
        {id:"p1c3",name:"Bent Over Row (both)",sets:3,reps:"10",startWeight:"5.5kg each",tip:"Hinge 45°. Squeeze both shoulder blades together."},
        {id:"p1c4",name:"Lateral Raise (seated)",sets:3,reps:"12",startWeight:"2–3kg",tip:"Don't shrug. Critical for balancing your frame.",star:true},
        {id:"p1c5",name:"Shoulder Shrug",sets:3,reps:"10",startWeight:"5.5kg each",tip:"Pause at top. Slow controlled release."},
        {id:"p1c6",name:"Plank",sets:3,reps:"25 sec",startWeight:"Bodyweight",tip:"From knees is fine. Straight line head to hip."},
      ]},
    ]
  },
  p2: {
    label:"Phase 2 — Build", subtitle:"Weeks 5–10 · 4 strength days · 35–40 min", tagline:"Add load. Add a day. Stay consistent.", weeks:6,
    days:[
      {id:"1",label:"Session 1",focus:"Shoulders + Arms",exercises:[
        {id:"p2d1",name:"Seated DB Shoulder Press",sets:4,reps:"10",startWeight:"6–8kg",tip:"Core tight. Don't arch lower back."},
        {id:"p2d2",name:"Lateral Raise (standing)",sets:4,reps:"12",startWeight:"3–4kg",tip:"Most important for your frame — builds shoulder width.",star:true},
        {id:"p2d3",name:"Arnold Press",sets:3,reps:"10",startWeight:"5–6kg",tip:"Rotate palms inward as you lower, outward as you press."},
        {id:"p2d4",name:"Band Face Pull",sets:4,reps:"15",startWeight:"Band",tip:"Pull to eye level. Rear delts + posture."},
        {id:"p2d5",name:"Hammer Curl",sets:3,reps:"10",startWeight:"5–6kg",tip:"Neutral grip. No swinging."},
        {id:"p2d6",name:"Tricep Overhead Extension",sets:3,reps:"12",startWeight:"6–8kg",tip:"Elbows close to head. Don't flare."},
      ]},
      {id:"2",label:"Session 2",focus:"Glutes + Hamstrings",exercises:[
        {id:"p2e1",name:"Hip Thrust off Bench",sets:4,reps:"12",startWeight:"10–14kg",tip:"DB on lap. Your heaviest lift. 2-sec hold at top.",star:true},
        {id:"p2e2",name:"Romanian Deadlift",sets:4,reps:"10",startWeight:"10–14kg",tip:"3 sec descent. Controlled lowering is the stimulus."},
        {id:"p2e3",name:"Band Kickback",sets:3,reps:"15 each",startWeight:"Band",tip:"Hip stays still. Only leg moves."},
        {id:"p2e4",name:"Band Clam",sets:3,reps:"15 each",startWeight:"Band",tip:""},
        {id:"p2e5",name:"Single Leg Glute Bridge",sets:3,reps:"10 each",startWeight:"Bodyweight",tip:"Squeeze hard at top."},
      ]},
      {id:"3",label:"Session 3",focus:"Back + Chest",exercises:[
        {id:"p2f1",name:"Incline DB Press",sets:4,reps:"10",startWeight:"8–10kg each",tip:"Upper chest focus. Controlled squeeze at top."},
        {id:"p2f2",name:"Single Arm Bench Row",sets:4,reps:"10 each",startWeight:"10–12kg",tip:"Full range. Slow deliberate return."},
        {id:"p2f3",name:"Flat DB Chest Fly",sets:3,reps:"12",startWeight:"5–6kg each",tip:"Slight elbow bend. Feel the stretch at bottom."},
        {id:"p2f4",name:"Bent Over Row (both)",sets:3,reps:"12",startWeight:"8–10kg each",tip:"Hinge 45°. Both shoulder blades squeeze."},
        {id:"p2f5",name:"Band Pull-Apart",sets:3,reps:"20",startWeight:"Band",tip:"Arms straight. Rear delts + posture."},
      ]},
      {id:"4",label:"Session 4",focus:"Quads + Core",exercises:[
        {id:"p2g1",name:"Goblet Squat",sets:4,reps:"12",startWeight:"10–14kg",tip:"Heavier now. Brace core hard on descent."},
        {id:"p2g2",name:"Walking Lunge",sets:3,reps:"10 each",startWeight:"4–6kg each",tip:"If HR spikes, reduce weight or skip."},
        {id:"p2g3",name:"Dead Bug",sets:3,reps:"8 each",startWeight:"Bodyweight",tip:"Exhale. Lower back flat."},
        {id:"p2g4",name:"Plank",sets:3,reps:"35 sec",startWeight:"Bodyweight",tip:"Drop to knees if lower back dips."},
        {id:"p2g5",name:"Band Pull-Apart",sets:3,reps:"15",startWeight:"Band",tip:""},
      ]},
    ]
  }
};

const TEMPLATE = {
  p1:[
    {dayNum:1,type:"walk"},
    {dayNum:2,type:"strength",sessionId:"A"},
    {dayNum:3,type:"walk"},
    {dayNum:4,type:"strength",sessionId:"B"},
    {dayNum:5,type:"rest"},
    {dayNum:6,type:"strength",sessionId:"C"},
    {dayNum:7,type:"mobility"},
  ],
  p2:[
    {dayNum:1,type:"strength",sessionId:"1"},
    {dayNum:2,type:"strength",sessionId:"2"},
    {dayNum:3,type:"walk"},
    {dayNum:4,type:"strength",sessionId:"3"},
    {dayNum:5,type:"rest"},
    {dayNum:6,type:"strength",sessionId:"4"},
    {dayNum:7,type:"mobility"},
  ]
};

const TYPE_META = {
  strength:{icon:"🏋🏽",label:"Strength",color:"#1C4030"},
  walk:    {icon:"🚶🏽‍♀️",label:"Walk",    color:"#B87333"},
  mobility:{icon:"🧘🏽",label:"Mobility",color:"#6E9E78"},
  rest:    {icon:"🌿", label:"Rest",    color:"#6B7280"},
};

const ENERGY_OPTS = [
  {val:1,emoji:"😴",label:"Wiped"},
  {val:2,emoji:"😓",label:"Hard"},
  {val:3,emoji:"😊",label:"Good"},
  {val:4,emoji:"💪",label:"Strong"},
  {val:5,emoji:"🔥",label:"Best!"},
];

const PROGRESS = [
  {ex:"Hip Thrust",    w12:"BW",    w34:"6kg",  w56:"10kg", w78:"14kg", w910:"18kg"},
  {ex:"Romanian DL",  w12:"6kg",   w34:"8kg",  w56:"10kg", w78:"14kg", w910:"18kg"},
  {ex:"Lateral Raise",w12:"2kg",   w34:"3kg",  w56:"3–4kg",w78:"4kg",  w910:"5kg"},
  {ex:"Bench Press",  w12:"5.5kg", w34:"6kg",  w56:"8kg",  w78:"10kg", w910:"12kg"},
  {ex:"Shoulder Press",w12:"—",    w34:"—",    w56:"6kg",  w78:"8kg",  w910:"10kg"},
];

const STORAGE_KEY = "fitness-tracker-data";

export default function App() {
  const [phase,  setPhase]  = useState("p1");
  const [week,   setWeek]   = useState(1);
  const [selDay, setSelDay] = useState(null);
  const [logs,   setLogs]   = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLogs(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const lk     = (p,w,di) => `${p}-w${w}-d${di}`;
  const getLog = (p,w,di) => logs[lk(p,w,di)] || {};
  const curLog = selDay !== null ? getLog(phase,week,selDay) : {};

  const upd = (p,w,di,fn) => {
    setLogs(prev => {
      const k=lk(p,w,di);
      const next={...prev,[k]:fn(prev[k]||{})};
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  };

  const isDone = (p,w,di) => {
    const t=TEMPLATE[p][di]; const l=getLog(p,w,di);
    if (t.type==="rest")     return !!(l.rested||Object.values(l.restChecks||{}).some(Boolean));
    if (t.type==="walk")     return !!l.duration;
    if (t.type==="mobility") return Object.values(l.mobDone||{}).filter(Boolean).length>=MOBILITY.length-1;
    if (t.type==="strength") {
      const day=STRENGTH[p].days.find(d=>d.id===t.sessionId);
      if (!day||!l.sets) return false;
      return day.exercises.every(ex=>(l.sets[ex.id]||[]).filter(Boolean).length>=ex.sets);
    }
    return false;
  };

  const phaseData = STRENGTH[phase];
  const template  = TEMPLATE[phase];

  const styles = {
    cream:"#F6F1E8", creamDark:"#EDE6D8", forest:"#1C4030", forestMid:"#2A5C44",
    sage:"#6E9E78", sagePale:"#EAF2E9", sageLight:"#C2D9C0",
    amber:"#B87333", amberPale:"#FDF3E3", amberMid:"#E8C88A",
    slate:"#6B7280", slatePale:"#F1F2F4",
    border:"#D9D3C7", text:"#1A1A12", textMuted:"#6B6856", white:"#FFFFFF", redPale:"#FDEAEA"
  };
  const s = styles;

  const card = (extra={}) => ({background:s.white,borderRadius:16,padding:"18px 20px",border:`1.5px solid ${s.border}`,marginBottom:10,...extra});
  const labelSm = {fontSize:10,color:s.textMuted,textTransform:"uppercase",letterSpacing:"0.9px",marginBottom:10,fontWeight:600};

  const StepsWidget = ({type}) => {
    const target = STEP_TARGETS[type];
    const steps  = parseInt(curLog.steps)||0;
    const pct    = target ? Math.min((steps/target)*100,100) : 0;
    const hit    = target && steps>=target;
    const close  = target && steps>=target*0.8 && !hit;
    return (
      <div style={{...card(),marginTop:11}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>Steps today</div>
            <div style={{fontSize:12,color:s.textMuted,marginTop:2}}>{target?"Log your total steps":"No target today — just move naturally"}</div>
          </div>
          {target&&<div style={{background:s.creamDark,padding:"4px 10px",borderRadius:40,fontFamily:"monospace",fontSize:12,color:s.textMuted,whiteSpace:"nowrap"}}>Target: {target.toLocaleString()}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <input type="number" placeholder="0" value={curLog.steps||""} onChange={e=>upd(phase,week,selDay,p=>({...p,steps:e.target.value}))}
            style={{width:120,padding:"9px 13px",border:`1.5px solid ${s.border}`,borderRadius:10,fontFamily:"monospace",fontSize:18,fontWeight:500,background:s.cream,color:s.text,outline:"none",textAlign:"center"}}/>
          <span style={{fontSize:13,color:s.textMuted}}>steps</span>
          {steps>0&&target&&<span style={{fontSize:13,fontWeight:600,color:hit?s.forest:s.amber}}>{hit?"✓ Target hit!":`${(target-steps).toLocaleString()} to go`}</span>}
          {steps>0&&!target&&<span style={{fontSize:13,color:s.sage}}>✓ Logged</span>}
        </div>
        {target&&steps>0&&(
          <div style={{marginTop:12}}>
            <div style={{height:8,background:s.creamDark,borderRadius:40,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:40,background:hit?s.forest:close?s.sage:s.amber,width:`${pct}%`,transition:"width 0.4s"}}/>
            </div>
            <div style={{marginTop:8,fontSize:12,color:hit?s.forest:s.amber}}>
              {hit&&"Great — step target done."}
              {close&&"Almost there — a short walk will close the gap."}
              {!hit&&!close&&type==="strength"&&"6K on strength days. Chai walk, calls standing, post-meal stroll each add 500–1000 steps."}
              {!hit&&!close&&type==="walk"&&"9K on walk days. Your dedicated walk does most of it — add post-meal strolls."}
            </div>
          </div>
        )}
      </div>
    );
  };

  const EnergyWidget = ({label="How did it feel?"}) => (
    <div style={{...card(),marginTop:11}}>
      <div style={{fontWeight:600,fontSize:14}}>{label}</div>
      <div style={{fontSize:12,color:s.textMuted,marginTop:3}}>This data matters more than the reps.</div>
      <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
        {ENERGY_OPTS.map(o=>(
          <button key={o.val} onClick={()=>upd(phase,week,selDay,p=>({...p,energy:o.val}))}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 11px",borderRadius:12,border:`1.5px solid ${curLog.energy===o.val?s.forest:s.border}`,background:curLog.energy===o.val?s.sagePale:s.cream,cursor:"pointer"}}>
            <span style={{fontSize:19}}>{o.emoji}</span>
            <span style={{fontSize:10,color:s.textMuted,fontWeight:500}}>{o.label}</span>
          </button>
        ))}
      </div>
      {curLog.energy&&(
        <div style={{marginTop:9,fontSize:12,padding:"8px 11px",borderRadius:8,lineHeight:1.5,background:curLog.energy<=2?s.redPale:curLog.energy===3?s.amberPale:s.sagePale,color:curLog.energy<=2?"#7A1818":curLog.energy===3?"#7A5018":s.forest}}>
          {curLog.energy<=2&&"⚠️ Take an extra rest day before next session."}
          {curLog.energy===3&&"✓ Solid. Stay at this weight before going heavier."}
          {curLog.energy===4&&"💪 Strong. Try +1kg on one exercise next time."}
          {curLog.energy===5&&"🔥 Best session! Consider a small increase next week."}
        </div>
      )}
      <textarea placeholder="Notes — soreness, energy 2h later, sleep..." value={curLog.notes||""} onChange={e=>upd(phase,week,selDay,p=>({...p,notes:e.target.value}))}
        style={{width:"100%",marginTop:11,padding:"10px 13px",border:`1.5px solid ${s.border}`,borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:13,resize:"vertical",minHeight:70,background:s.cream,outline:"none",color:s.text,lineHeight:1.5}}/>
    </div>
  );

  if (selDay !== null) {
    const t = template[selDay];
    const phaseDay = t.type==="strength" ? phaseData.days.find(d=>d.id===t.sessionId) : null;
    const done = isDone(phase,week,selDay);

    return (
      <div style={{maxWidth:740,margin:"0 auto",padding:"28px 18px 100px",background:s.cream,minHeight:"100vh",fontFamily:"DM Sans,sans-serif"}}>
        <button onClick={()=>setSelDay(null)} style={{background:"none",border:"none",cursor:"pointer",color:s.textMuted,fontSize:13,display:"flex",alignItems:"center",gap:6,marginBottom:20,padding:0}}>← Week {week} overview</button>

        {t.type==="strength" && phaseDay && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:40,fontSize:12,fontWeight:600,marginBottom:10,background:s.sagePale,color:s.forest}}>🏋🏽 Strength · Day {t.dayNum}</div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:600,color:s.forest}}>{phaseDay.label} — {phaseDay.focus}</h2>
                {done&&<span style={{background:s.sagePale,color:s.forest,padding:"3px 11px",borderRadius:40,fontSize:12,fontWeight:500}}>✓ Done</span>}
              </div>
              <p style={{fontSize:13,color:s.textMuted,marginTop:4}}>{phaseData.label} · Week {week}</p>
            </div>

            <div style={{background:s.amberPale,border:`1.5px solid ${s.amberMid}`,borderRadius:14,padding:"13px 17px",marginBottom:9}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",color:s.amber,marginBottom:7}}>⚡ Warm-up — 5 min, always</div>
              {WARMUP.map((w,i)=><div key={i} style={{fontSize:12,color:"#7A5018",marginBottom:3,display:"flex",gap:8}}><span style={{opacity:0.4}}>—</span>{w}</div>)}
            </div>

            <div style={{...labelSm,marginTop:16,marginBottom:6}}>Exercises · Rest 90 sec between sets</div>

            {phaseDay.exercises.map(ex=>{
              const sets=curLog.sets?.[ex.id]||Array(ex.sets).fill(false);
              const wt=curLog.weights?.[ex.id]!==undefined?curLog.weights[ex.id]:ex.startWeight;
              const allDone=sets.filter(Boolean).length>=ex.sets;
              return (
                <div key={ex.id} style={{...card(),borderColor:allDone?s.sage:s.border,background:allDone?s.sagePale:s.white}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:500}}>{ex.name}</div>
                      <div style={{display:"flex",gap:9,marginTop:5,fontFamily:"monospace",fontSize:11,color:s.textMuted,flexWrap:"wrap"}}>
                        <span>{ex.sets} sets</span><span>×</span><span>{ex.reps} reps</span>
                        <span style={{color:s.border}}>|</span><span>Guide: {ex.startWeight}</span>
                      </div>
                      {ex.tip&&<div style={{fontSize:12,color:ex.star?s.amber:s.forestMid,marginTop:6,fontStyle:"italic",lineHeight:1.5}}>{ex.star?"★ ":""}{ex.tip}</div>}
                    </div>
                    {allDone&&<span style={{fontSize:17,marginLeft:8}}>✅</span>}
                  </div>
                  <div style={{display:"flex",gap:14,alignItems:"flex-end",marginTop:13,flexWrap:"wrap"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.8px",color:s.textMuted,fontWeight:600}}>Today's weight</div>
                      <input value={wt} onChange={e=>upd(phase,week,selDay,p=>({...p,weights:{...(p.weights||{}),[ex.id]:e.target.value}}))} placeholder="e.g. 6kg"
                        style={{width:93,padding:"6px 10px",border:`1.5px solid ${s.border}`,borderRadius:9,fontFamily:"monospace",fontSize:13,background:s.cream,color:s.text,outline:"none"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.8px",color:s.textMuted,fontWeight:600}}>Sets done</div>
                      <div style={{display:"flex",gap:6}}>
                        {Array(ex.sets).fill(0).map((_,i)=>(
                          <div key={i} onClick={()=>upd(phase,week,selDay,p=>{const a=[...(p.sets?.[ex.id]||Array(ex.sets).fill(false))];a[i]=!a[i];return{...p,sets:{...(p.sets||{}),[ex.id]:a}};})}
                            style={{width:31,height:31,borderRadius:"50%",border:`2px solid ${sets[i]?s.forest:s.border}`,background:sets[i]?s.forest:s.cream,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sets[i]?12:11,color:sets[i]?s.white:s.textMuted,fontFamily:"monospace",userSelect:"none"}}>
                            {sets[i]?"✓":i+1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{background:s.sagePale,border:`1.5px solid ${s.sageLight}`,borderRadius:14,padding:"13px 17px",marginTop:9}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",color:s.forestMid,marginBottom:7}}>🌿 Cool-down — 5 min, always</div>
              {COOLDOWN.map((c,i)=><div key={i} style={{fontSize:12,color:s.forest,marginBottom:3,display:"flex",gap:8}}><span style={{opacity:0.4}}>—</span>{c}</div>)}
            </div>

            <StepsWidget type="strength"/>
            <EnergyWidget label="Post-session check-in"/>
          </div>
        )}

        {t.type==="walk" && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:40,fontSize:12,fontWeight:600,marginBottom:10,background:s.amberPale,color:s.amber}}>🚶🏽‍♀️ Walk · Day {t.dayNum}</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:600,color:s.forest}}>Your Walk</h2>
              <p style={{fontSize:13,color:s.textMuted,marginTop:4}}>Week {week} · Target: 20–30 min · Outdoor preferred</p>
            </div>
            <div style={{...card(),background:s.amberPale,borderColor:s.amberMid}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",color:s.amber,marginBottom:7}}>Why this matters for your recovery</div>
              {WALK_TIPS.map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:11,padding:"9px 0",borderBottom:i<WALK_TIPS.length-1?`1px solid ${s.creamDark}`:"none",fontSize:13,color:s.text,lineHeight:1.5,alignItems:"flex-start"}}>
                  <span style={{fontSize:15,flexShrink:0}}>{tip.icon}</span><span>{tip.text}</span>
                </div>
              ))}
            </div>
            <div style={{...card(),marginTop:10}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Log your walk</div>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.8px",color:s.textMuted,fontWeight:600,marginBottom:7}}>Duration</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["15 min","20 min","25 min","30 min","35+ min"].map(d=>(
                  <button key={d} onClick={()=>upd(phase,week,selDay,p=>({...p,duration:d}))}
                    style={{padding:"7px 15px",borderRadius:40,border:`1.5px solid ${curLog.duration===d?s.amber:s.border}`,background:curLog.duration===d?s.amber:s.white,cursor:"pointer",fontFamily:"monospace",fontSize:12,color:curLog.duration===d?s.white:s.textMuted}}>
                    {d}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:13}}>
                <div onClick={()=>upd(phase,week,selDay,p=>({...p,outdoor:!(p.outdoor!==false)}))}
                  style={{width:38,height:21,borderRadius:11,background:curLog.outdoor!==false?s.forest:s.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                  <div style={{width:17,height:17,borderRadius:"50%",background:"white",position:"absolute",top:2,left:curLog.outdoor!==false?19:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </div>
                <span style={{fontSize:13}}>{curLog.outdoor!==false?"Went outdoors ✓":"Indoors / treadmill"}</span>
              </div>
            </div>
            <StepsWidget type="walk"/>
            <EnergyWidget label="How did the walk feel?"/>
          </div>
        )}

        {t.type==="mobility" && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:40,fontSize:12,fontWeight:600,marginBottom:10,background:s.sagePale,color:s.forestMid}}>🧘🏽 Mobility · Day {t.dayNum}</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:600,color:s.forest}}>Recovery & Mobility</h2>
              <p style={{fontSize:13,color:s.textMuted,marginTop:4}}>Week {week} · 10–15 min · Mat or bed</p>
            </div>
            <div style={{...card(),background:s.sagePale,borderColor:s.sageLight}}>
              <p style={{fontSize:13,color:s.forest,lineHeight:1.6}}>Tight hip flexors switch off your glutes. A stiff upper back limits your shoulder press. This directly supports your strength work.</p>
              <p style={{fontSize:12,color:s.textMuted,marginTop:8,fontStyle:"italic"}}>{Object.values(curLog.mobDone||{}).filter(Boolean).length} of {MOBILITY.length} done</p>
            </div>
            <div style={card()}>
              <div style={{...labelSm,marginBottom:4}}>Tap each exercise as you finish it</div>
              {MOBILITY.map(m=>{
                const done=curLog.mobDone?.[m.id];
                return (
                  <div key={m.id} onClick={()=>upd(phase,week,selDay,p=>({...p,mobDone:{...(p.mobDone||{}),[m.id]:!p.mobDone?.[m.id]}}))}
                    style={{display:"flex",alignItems:"flex-start",gap:11,padding:"11px 0",borderBottom:`1px solid ${s.creamDark}`,cursor:"pointer"}}>
                    <div style={{width:25,height:25,borderRadius:"50%",border:`2px solid ${done?s.sage:s.border}`,background:done?s.sage:s.cream,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:done?s.white:"transparent",marginTop:1}}>{done?"✓":""}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:500,textDecoration:done?"line-through":"none",opacity:done?0.5:1}}>{m.name}</div>
                      <div style={{fontSize:11,color:s.textMuted,marginTop:2,fontFamily:"monospace"}}>{m.dur}</div>
                      {m.tip&&<div style={{fontSize:11,color:s.textMuted,marginTop:3,fontStyle:"italic"}}>{m.tip}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <StepsWidget type="mobility"/>
            <EnergyWidget label="How's your body feeling today?"/>
          </div>
        )}

        {t.type==="rest" && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 13px",borderRadius:40,fontSize:12,fontWeight:600,marginBottom:10,background:s.slatePale,color:s.slate}}>🌿 Rest · Day {t.dayNum}</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:600,color:s.forest}}>Full Rest</h2>
              <p style={{fontSize:13,color:s.textMuted,marginTop:4}}>Week {week} · No exercise · Let your body rebuild</p>
            </div>
            <div style={{...card(),background:s.slatePale,borderColor:"#D1D5DB"}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:9}}>This is where the gains happen</div>
              <p style={{fontSize:13,color:"#4B5563",lineHeight:1.7}}>Muscle is built on rest days. Your mitochondria need this window to repair. Skipping rest is the fastest route to a fatigue crash.</p>
              <p style={{fontSize:13,color:"#4B5563",lineHeight:1.7,marginTop:10}}>If you feel great: a slow 15-min stroll is the absolute maximum.</p>
            </div>
            <div style={card()}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Rest day checklist</div>
              {[{id:"r1",text:"8+ hours of sleep last night"},{id:"r2",text:"Ate enough protein today"},{id:"r3",text:"Magnesium glycinate taken"},{id:"r4",text:"Stayed off feet where possible"}].map(item=>{
                const checked=curLog.restChecks?.[item.id];
                return (
                  <div key={item.id} onClick={()=>upd(phase,week,selDay,p=>({...p,rested:true,restChecks:{...(p.restChecks||{}),[item.id]:!checked}}))}
                    style={{display:"flex",alignItems:"flex-start",gap:11,padding:"11px 0",borderBottom:`1px solid ${s.creamDark}`,cursor:"pointer"}}>
                    <div style={{width:25,height:25,borderRadius:"50%",border:`2px solid ${checked?s.sage:s.border}`,background:checked?s.sage:s.cream,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:checked?s.white:"transparent",marginTop:1}}>{checked?"✓":""}</div>
                    <div style={{fontSize:14,fontWeight:500,textDecoration:checked?"line-through":"none",opacity:checked?0.5:1}}>{item.text}</div>
                  </div>
                );
              })}
              <textarea placeholder="Notes — energy, soreness, sleep quality..." value={curLog.notes||""} onChange={e=>upd(phase,week,selDay,p=>({...p,notes:e.target.value}))}
                style={{width:"100%",marginTop:11,padding:"10px 13px",border:`1.5px solid ${s.border}`,borderRadius:10,fontFamily:"DM Sans,sans-serif",fontSize:13,resize:"vertical",minHeight:70,background:s.cream,outline:"none",color:s.text,lineHeight:1.5}}/>
            </div>
            <StepsWidget type="rest"/>
          </div>
        )}

        <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
          <button onClick={()=>setSelDay(null)} style={{padding:"10px 22px",borderRadius:40,border:`1.5px solid ${s.border}`,background:"transparent",color:s.textMuted,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500}}>← Back to week</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:740,margin:"0 auto",padding:"28px 18px 100px",background:s.cream,minHeight:"100vh",fontFamily:"DM Sans,sans-serif"}}>
      <div style={{marginBottom:26}}>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:600,color:s.forest,lineHeight:1.1}}>Your Weekly Plan</h1>
        <p style={{fontSize:13,color:s.textMuted,marginTop:5,lineHeight:1.6}}>Post-mold recovery · Hashimoto's aware · All 7 days</p>
      </div>

      <div style={{background:s.amberPale,border:`1.5px solid ${s.amberMid}`,borderRadius:14,padding:"13px 17px",marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.8px",color:s.amber,marginBottom:7}}>Every strength day — without exception</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 14px"}}>
          {["Eat 45 min before — never fasted","90 sec rest between every single set","Protein within 30 min of finishing","Log steps + energy at end of day"].map((r,i)=>(
            <div key={i} style={{fontSize:12,color:"#7A5018",marginBottom:3,display:"flex",gap:8}}><span style={{opacity:0.4}}>—</span>{r}</div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {[["p1","Phase 1 — Restore"],["p2","Phase 2 — Build"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setPhase(k);setWeek(1);setSelDay(null);}}
            style={{padding:"8px 20px",borderRadius:40,border:`1.5px solid ${phase===k?s.forest:s.border}`,background:phase===k?s.forest:"transparent",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,color:phase===k?s.white:s.textMuted}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,color:s.textMuted}}>{phaseData.subtitle}</div>
        <div style={{fontSize:12,color:s.sage,marginTop:4,fontStyle:"italic"}}>{phaseData.tagline}</div>
      </div>

      <div style={labelSm}>Select week</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
        {Array.from({length:phaseData.weeks},(_,i)=>i+1).map(w=>{
          const allDone=template.every((_,di)=>isDone(phase,w,di));
          const someDone=template.some((_,di)=>isDone(phase,w,di));
          return (
            <button key={w} onClick={()=>setWeek(w)}
              style={{width:44,height:44,borderRadius:"50%",border:`1.5px solid ${week===w?s.forest:allDone?s.sage:s.border}`,background:week===w?s.forest:allDone?s.sagePale:s.white,cursor:"pointer",fontFamily:"monospace",fontSize:12,color:week===w?s.white:allDone?s.forest:s.textMuted,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:1}}>
              <span>W{w}</span>
              {allDone&&<span style={{fontSize:9}}>✓</span>}
              {someDone&&!allDone&&<span style={{fontSize:9,opacity:0.6}}>·</span>}
            </button>
          );
        })}
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        {Object.entries(TYPE_META).map(([type,meta])=>(
          <div key={type} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:s.textMuted}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:meta.color}}/>
            {meta.icon} {meta.label}
          </div>
        ))}
      </div>

      <div style={labelSm}>Week {week} — tap any day to open</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:7,marginBottom:8}}>
        {template.map((t,di)=>{
          const done=isDone(phase,week,di);
          const meta=TYPE_META[t.type];
          const dayData=t.type==="strength"?phaseData.days.find(d=>d.id===t.sessionId):null;
          const target=STEP_TARGETS[t.type];
          const l=getLog(phase,week,di);
          const loggedSteps=parseInt(l.steps)||0;
          const stepsHit=loggedSteps>0&&target&&loggedSteps>=target;
          const stepsMiss=loggedSteps>0&&target&&loggedSteps<target;
          const cardBg = done ? (t.type==="strength"?s.sagePale:t.type==="walk"?s.amberPale:t.type==="mobility"?s.sagePale:s.slatePale) : s.white;
          const cardBorder = done ? (t.type==="strength"?s.sageLight:t.type==="walk"?s.amberMid:t.type==="mobility"?s.sageLight:"#D1D5DB") : s.border;
          return (
            <div key={di} onClick={()=>setSelDay(di)}
              style={{borderRadius:14,padding:"12px 7px 14px",border:`1.5px solid ${cardBorder}`,cursor:"pointer",background:cardBg,display:"flex",flexDirection:"column",alignItems:"center",gap:4,minHeight:116,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:meta.color}}/>
              <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.8px",color:s.textMuted,fontWeight:600}}>Day {t.dayNum}</div>
              <div style={{fontSize:19,lineHeight:1}}>{meta.icon}</div>
              <div style={{fontSize:9,fontWeight:600,textAlign:"center",lineHeight:1.3,color:meta.color}}>{t.type==="strength"?dayData?.label||"Strength":meta.label}</div>
              {t.type==="strength"&&dayData&&<div style={{fontSize:8,color:s.textMuted,textAlign:"center",lineHeight:1.3}}>{dayData.focus}</div>}
              {t.type==="walk"&&<div style={{fontSize:8,color:s.textMuted,textAlign:"center"}}>20–30 min</div>}
              {t.type==="mobility"&&<div style={{fontSize:8,color:s.textMuted,textAlign:"center"}}>10–15 min</div>}
              {target&&<div style={{fontSize:8,fontFamily:"monospace",color:s.textMuted,textAlign:"center",marginTop:1}}>🦶 {(target/1000).toFixed(0)}K steps</div>}
              {loggedSteps>0&&<div style={{fontSize:9,fontFamily:"monospace",fontWeight:600,textAlign:"center",color:stepsHit?s.forest:stepsMiss?s.amber:s.textMuted}}>{loggedSteps.toLocaleString()}{stepsHit?" ✓":""}</div>}
              {done&&!loggedSteps&&<div style={{fontSize:11,color:s.sage,fontWeight:600}}>✓</div>}
            </div>
          );
        })}
      </div>

      <p style={{fontSize:11,color:s.textMuted,fontStyle:"italic",marginTop:6,marginBottom:20}}>Day 1 = today. Do each day when it fits — never 3 strength days in a row.</p>

      <div style={{...card(),marginTop:18}}>
        <h3 style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:600}}>Progressive Load Guide</h3>
        <p style={{fontSize:12,color:s.textMuted,marginTop:6,lineHeight:1.5}}><strong>The 2-rep rule:</strong> 2 extra reps on all sets comfortably → increase by 1–2kg. One exercise at a time.</p>
        <table style={{width:"100%",borderCollapse:"collapse",marginTop:12}}>
          <thead><tr>{["Exercise","W1–2","W3–4","W5–6","W7–8","W9–10"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 8px",fontSize:10,textTransform:"uppercase",letterSpacing:"0.8px",color:s.textMuted,fontWeight:600,borderBottom:`1px solid ${s.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{PROGRESS.map(r=><tr key={r.ex}><td style={{padding:"7px 8px",borderBottom:`1px solid ${s.creamDark}`,fontWeight:500}}>{r.ex}</td>{[r.w12,r.w34,r.w56,r.w78,r.w910].map((v,i)=><td key={i} style={{padding:"7px 8px",borderBottom:`1px solid ${s.creamDark}`,fontFamily:"monospace",fontSize:11}}>{v}</td>)}</tr>)}</tbody>
        </table>
      </div>

      <div style={{...card(),marginTop:18}}>
        <h3 style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:600}}>Recovery Signals</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
          {[
            {title:"🟢 Green — continue",text:"Mild soreness gone in 48h · Energy stable · Sleeping normally"},
            {title:"🟡 Yellow — extra rest",text:"Fatigue >2 days · Brain fog AM · Craving heavy sleep"},
            {title:"🔴 Red — stop, rest",text:"Elevated resting HR · Joint pain · Anxiety spike · Mood crash"},
            {title:"💊 Always",text:"Protein 30 min after strength · Magnesium nightly · Walks separate"},
          ].map(item=>(
            <div key={item.title} style={{background:s.cream,padding:"10px 12px",borderRadius:10}}>
              <div style={{fontSize:11,fontWeight:600,marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:11,color:s.textMuted,lineHeight:1.4}}>{item.text}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,padding:"10px 13px",background:s.sagePale,borderRadius:10,fontSize:12,color:s.forest,lineHeight:1.6}}>
          <strong>Never:</strong> Step-ups · Split squats · HIIT · Fasted training · 3 strength days in a row · Abductor machine.
        </div>
      </div>
    </div>
  );
}
