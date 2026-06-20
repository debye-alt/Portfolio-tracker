import { useState, useEffect, useCallback } from "react";

// ── ETF 종목코드 매핑 (KRX 종목코드) ──
const ETF_CODES = {
  "KODEX 200":                        "069500",
  "KODEX 미국S&P500TR":               "379800",
  "RISE 미국빅테크TOP7Plus":          "479850",
  "KODEX 미국반도체MV":               "466920",
  "TIGER 미국필라델피아반도체나스닥":  "381180",
  "TIGER S&P500":                     "143850",
  "KODEX 미국나스닥100TR":            "379810",
  "TIGER 차이나항셍테크":             "371460",
  "KODEX 미국메타버스나스닥액티브":   "396500",
  "TIGER 미국테크TOP10INDXX":         "381170",
  "KODEX 미국AI테크TOP10+10%":        "475080",
  "KODEX 미국30년국채커버드콜(합성H)":"385560",
  "TIGER S&P500배당귀족(합성H)":      "287310",
  "KODEX 선진국MSCI World":           "251350",
  "TIGER 미국MSCI리츠(합성H)":        "182480",
  "KODEX 반도체":                     "091160",
  "TIGER 미국나스닥100":              "133690",
  "KODEX MSCI선진국":                 "251350",
  "KODEX 미국S&P500":                 "379800",
  "KODEX 미국반도체":                 "466920",
  "KODEX 로봇액티브":                 "441640",
  "TIGER 미국배당다우존스":           "458730",
};

const INITIAL_PORTFOLIO = {
  accounts: {
    acc2: {
      name:"주식 CMA (국내)", shortName:"주식CMA", icon:"📊", type:"ETF",
      holdings:[
        // Image 3 기준 최신 데이터
        {id:101, ticker:"KODEX 200",           shares:170,  costPrice:Math.round((24807590-4354253)/170), currentPrice:Math.round(24807590/170)  }, // +21.29%
        {id:102, ticker:"KODEX 반도체",        shares:69,   costPrice:Math.round((12337200-2324362)/69),  currentPrice:Math.round(12337200/69)   }, // +23.22%
        {id:103, ticker:"TIGER 미국나스닥100", shares:110,  costPrice:Math.round((22639100-699927)/110),  currentPrice:Math.round(22639100/110)  }, // +3.19%
        {id:104, ticker:"KODEX MSCI선진국",    shares:117,  costPrice:Math.round((4958460-49676)/117),    currentPrice:Math.round(4958460/117)   }, // +1.01%
        {id:105, ticker:"KODEX 미국S&P500",    shares:1857, costPrice:Math.round((48254145-228075)/1857), currentPrice:Math.round(48254145/1857) }, // +0.47%
        {id:106, ticker:"KODEX 미국반도체",    shares:231,  costPrice:Math.round((15856995-1806318)/231), currentPrice:Math.round(15856995/231)  }, // +12.84%
        {id:107, ticker:"KODEX 로봇액티브",    shares:151,  costPrice:Math.round((5805950+356862)/151),   currentPrice:Math.round(5805950/151)   }, // -5.79%
        {id:108, ticker:"TIGER 미국배당다우존스", shares:1265, costPrice:Math.round((19537925+463386)/1265), currentPrice:Math.round(19537925/1265) }, // -2.32%
      ]
    },
    acc3: {
      name:"변액유니버셜 II (미래에셋생명)", shortName:"변액①", icon:"🏛", type:"펀드",
      holdings:[
        // Image 1 기준
        {id:201, ticker:"A+차이나",                  shares:1, costPrice:84539,    currentPrice:90838    }, // +7.45%
        {id:202, ticker:"글로벌신성장액티브",         shares:1, costPrice:70443,    currentPrice:79848    }, // +13.35%
        {id:203, ticker:"글로벌성장주식형",           shares:1, costPrice:70448,    currentPrice:76448    }, // +8.52%
        {id:204, ticker:"아시아그레이트컨슈머주식형", shares:1, costPrice:56356,    currentPrice:63607    }, // +12.87%
        {id:205, ticker:"삼성그룹주플러스주식형",     shares:1, costPrice:28466627, currentPrice:43969638 }, // +54.46%
        {id:206, ticker:"배당주식형",                shares:1, costPrice:27888292, currentPrice:40441059 }, // +45.01%
      ]
    },
    acc4: {
      name:"변액유니버셜종신 II (매직)", shortName:"변액②", icon:"🏦", type:"펀드",
      holdings:[
        {id:301, ticker:"채권형",       shares:1, costPrice:2724093, currentPrice:2697300 }, // -0.98%
        {id:302, ticker:"코리아인덱스", shares:1, costPrice:1628068, currentPrice:2461455 }, // +51.19%
        {id:303, ticker:"해외성장형",   shares:1, costPrice:1067736, currentPrice:1211618 }, // +13.48%
      ]
    },
    acc5: {
      name:"우리은행 IRP", shortName:"IRP", icon:"🏧", type:"IRP",
      holdings:[
        {id:401, ticker:"KODEX 코리아밸류업",           shares:1, costPrice:8346150,  currentPrice:11241450 }, // +34.67%
        {id:402, ticker:"KODEX 200 (IRP)",              shares:1, costPrice:5310170,  currentPrice:9404480  }, // +77.09%
        {id:403, ticker:"KODEX 로봇액티브 (IRP)",       shares:1, costPrice:4565140,  currentPrice:7986865  }, // +74.95%
        {id:404, ticker:"PLUS 고배당주",                shares:1, costPrice:3055607,  currentPrice:3284820  }, // +7.42%
        {id:405, ticker:"IBK단기국공채공모주",          shares:1, costPrice:2850588,  currentPrice:3110233  }, // +9.10%
        {id:406, ticker:"키움TDF2030",                  shares:1, costPrice:2243410,  currentPrice:2967900  }, // +32.28%
        {id:407, ticker:"한화LIFEPLUS TDF2040",         shares:1, costPrice:1683964,  currentPrice:2529540  }, // +50.27%
        {id:408, ticker:"KB온국민 TDF2040",             shares:1, costPrice:1425293,  currentPrice:2201464  }, // +54.45%
        {id:409, ticker:"기업은행 정기예금 3년",        shares:1, costPrice:1681700,  currentPrice:1760443  }, // +4.66%
        {id:410, ticker:"우리반도체BIG2플러스",         shares:1, costPrice:823999,   currentPrice:954774   }, // +15.98%
        {id:411, ticker:"삼성글로벌다이나믹자산배분",   shares:1, costPrice:373733,   currentPrice:423238   }, // +13.17%
        {id:412, ticker:"KODEX 미국AI전력핵심인프라",   shares:1, costPrice:254729,   currentPrice:346970   }, // +36.16%
        {id:413, ticker:"미래에셋퇴직연금배당커버드콜", shares:1, costPrice:244510,   currentPrice:292566   }, // +19.65%
        {id:414, ticker:"현금성자산(고유계정대)",       shares:1, costPrice:198550,   currentPrice:262528   }, // +32.13%
        {id:415, ticker:"IBK플레인바닐라EMP",           shares:1, costPrice:133103,   currentPrice:154485   }, // +16.07%
      ]
    }
  }
};

const CATEGORY_COLORS = {
  "미국주식":"#6366f1","한국주식":"#22c55e","반도체":"#f59e0b",
  "채권/리츠":"#ec4899","중국/이머징":"#ef4444","배당":"#06b6d4",
  "글로벌":"#a78bfa","펀드(국내)":"#34d399","기타":"#64748b"
};
function getCategory(ticker, type) {
  if (type==="펀드"||type==="IRP") {
    if (ticker.includes("차이나")||ticker.includes("아시아")||ticker.includes("컨슈머")) return "중국/이머징";
    if (ticker.includes("글로벌")||ticker.includes("TDF")||ticker.includes("EMP")||ticker.includes("다이나믹")) return "글로벌";
    if (ticker.includes("배당")||ticker.includes("고배당")) return "배당";
    if (ticker.includes("채권")||ticker.includes("국채")||ticker.includes("예금")||ticker.includes("현금")||ticker.includes("커버드")||ticker.includes("단기")) return "채권/리츠";
    if (ticker.includes("반도체")||ticker.includes("로봇")||ticker.includes("AI")||ticker.includes("인프라")) return "반도체";
    if (ticker.includes("코리아")||ticker.includes("밸류업")||ticker.includes("KODEX 200")) return "한국주식";
    return "펀드(국내)";
  }
  if (ticker.includes("반도체")||ticker.includes("필라델피아")||ticker.includes("로봇")) return "반도체";
  if (ticker.includes("차이나")||ticker.includes("항셍")) return "중국/이머징";
  if (ticker.includes("국채")||ticker.includes("리츠")||ticker.includes("커버드")) return "채권/리츠";
  if (ticker.includes("배당")) return "배당";
  if (ticker==="KODEX 200"||ticker==="KODEX 반도체") return "한국주식";
  return "미국주식";
}

const TODAY = new Date().toISOString().slice(0,10);
const bg="#080d1a", sur="rgba(15,23,42,0.8)", brd="rgba(99,102,241,0.15)";
const green="#22c55e", red="#ef4444", purple="#6366f1", muted="#64748b";
const won     = n => { const a=Math.abs(n); if(a>=1e8) return `${(n/1e8).toFixed(2)}억`; if(a>=1e4) return `${Math.round(n/1e4).toLocaleString()}만`; return n.toLocaleString(); };
const wonFull = n => n.toLocaleString()+"원";
const fmt     = n => (n>=0?"+":"")+n.toFixed(2)+"%";
const fmtAmt  = n => (n>=0?"+":"-")+Math.abs(Math.round(n)).toLocaleString()+"원";

// ── KRX 종가 조회 (Claude AI 경유) ──
async function fetchKRXPrices(tickers) {
  const codes = tickers.map(t => `${t}(${ETF_CODES[t]||"?"})`).join(", ");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-6",
        max_tokens:1000,
        tools:[{ type:"web_search_20250305", name:"web_search" }],
        messages:[{
          role:"user",
          content:`다음 한국 ETF들의 오늘(${TODAY}) KRX 종가를 검색해서 JSON으로만 답해줘. 다른 말은 하지 말고 오직 JSON만.\n종목: ${codes}\n\n형식: {"KODEX 200":40500,"TIGER S&P500":18200,...}\n값은 숫자(원)만. 모르면 0.`
        }]
      })
    });
    const data = await res.json();
    // 모든 content 블록에서 텍스트 추출
    const texts = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
    const match = texts.match(/\{[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch(e) { console.error(e); }
  return {};
}

export default function PortfolioTracker() {
  const [portfolio, setPortfolio]   = useState(null);
  const [history, setHistory]       = useState({});
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [activeTab, setActiveTab]   = useState("overview");
  const [sortBy, setSortBy]         = useState("evalAmt");
  const [filterCat, setFilterCat]   = useState("전체");
  const [aiInsight, setAiInsight]   = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoStatus, setAutoStatus] = useState("");
  const [editMode, setEditMode]     = useState(false);
  const [editPrices, setEditPrices] = useState({});
  const [loading, setLoading]       = useState(true);

  // ── 스토리지 로드 ──
  useEffect(() => {
    (async () => {
      try {
        const pRes = await window.storage.get("portfolio_v9");
        // 저장된 데이터가 있으면 사용, 없으면 초기값
        setPortfolio(pRes ? JSON.parse(pRes.value) : INITIAL_PORTFOLIO);
      } catch { setPortfolio(INITIAL_PORTFOLIO); }
      try {
        const hRes = await window.storage.get("price_history_v9");
        if (hRes) setHistory(JSON.parse(hRes.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  // ── 스냅샷 저장 ──
  const saveSnapshot = async (p, hist) => {
    const allH = Object.values(p.accounts).flatMap(a=>a.holdings);
    const ev = allH.reduce((s,h)=>s+h.currentPrice*h.shares,0);
    const co = allH.reduce((s,h)=>s+h.costPrice*h.shares,0);
    const newHist = { ...hist, [TODAY]: { eval:ev, cost:co, profit:ev-co } };
    const keys = Object.keys(newHist).sort();
    if (keys.length>90) keys.slice(0,keys.length-90).forEach(k=>delete newHist[k]);
    await window.storage.set("price_history_v9", JSON.stringify(newHist));
    setHistory(newHist);
    return newHist;
  };

  const savePortfolio = async (p, hist) => {
    await window.storage.set("portfolio_v9", JSON.stringify(p));
    const newHist = await saveSnapshot(p, hist);
    return newHist;
  };

  const resetToInitial = async () => {
    if (!window.confirm("초기 데이터로 리셋하시겠어요? 기존 저장 데이터가 초기화됩니다.")) return;
    await window.storage.delete("portfolio_v9");
    await window.storage.delete("price_history_v9");
    setPortfolio(INITIAL_PORTFOLIO);
    setHistory({});
  };

  // ── 자동 시세 업데이트 (KRX 종가, 웹검색 경유) ──
  const autoUpdate = async () => {
    setAutoLoading(true);
    setAutoStatus("📡 KRX 종가 조회 중...");
    const etfTickers = [
      ...INITIAL_PORTFOLIO.accounts.acc2.holdings.map(h=>h.ticker),
    ].filter((v,i,a)=>a.indexOf(v)===i);

    const prices = await fetchKRXPrices(etfTickers);
    const updated = JSON.parse(JSON.stringify(portfolio));
    let updateCount = 0;

    ["acc2"].forEach(accKey => {
      updated.accounts[accKey].holdings.forEach(h => {
        if (prices[h.ticker] && prices[h.ticker] > 0) {
          h.currentPrice = prices[h.ticker];
          updateCount++;
        }
      });
    });

    if (updateCount > 0) {
      setPortfolio(updated);
      const newHist = await savePortfolio(updated, history);
      setAutoStatus(`✅ ${updateCount}개 종목 업데이트 완료 (${TODAY})`);
    } else {
      setAutoStatus("⚠️ 시세 조회 실패 — 장중이거나 휴장일일 수 있어요. 수동으로 입력해주세요.");
    }
    setAutoLoading(false);
    setTimeout(()=>setAutoStatus(""), 5000);
  };

  // ── 수동 편집 ──
  const startEdit = () => {
    const prices = {};
    Object.values(portfolio.accounts).forEach(acc=>acc.holdings.forEach(h=>{prices[h.id]=h.currentPrice;}));
    setEditPrices(prices);
    setEditMode(true);
  };
  const applyEdit = async () => {
    const updated = JSON.parse(JSON.stringify(portfolio));
    Object.values(updated.accounts).forEach(acc=>acc.holdings.forEach(h=>{
      if (editPrices[h.id]!==undefined) h.currentPrice=Number(editPrices[h.id]);
    }));
    setPortfolio(updated);
    setEditMode(false);
    await savePortfolio(updated, history);
  };

  if (loading||!portfolio) return (
    <div style={{minHeight:"100vh",background:bg,display:"flex",alignItems:"center",justifyContent:"center",color:muted,fontSize:14,flexDirection:"column",gap:12}}>
      <div style={{fontSize:32}}>⟳</div><div>데이터 로딩 중...</div>
    </div>
  );

  // ── 계산 ──
  const getHoldings = sel => {
    if (sel==="all") return Object.entries(portfolio.accounts).flatMap(([k,a])=>a.holdings.map(h=>({...h,accType:a.shortName,fundType:a.type,accKey:k})));
    return (portfolio.accounts[sel]?.holdings||[]).map(h=>({...h,accType:portfolio.accounts[sel].shortName,fundType:portfolio.accounts[sel].type,accKey:sel}));
  };
  const allH       = getHoldings(selectedAccount);
  const totalEval  = allH.reduce((s,h)=>s+h.currentPrice*h.shares,0);
  const totalCost  = allH.reduce((s,h)=>s+h.costPrice*h.shares,0);
  const totalProfit= totalEval-totalCost;
  const totalPct   = totalCost>0?(totalProfit/totalCost)*100:0;

  const histDays = Object.keys(history).sort().slice(-60);
  const histVals = histDays.map(d=>history[d].eval);
  const chartW=540, chartH=100;
  const hMin=histVals.length?Math.min(...histVals)*0.998:0;
  const hMax=histVals.length?Math.max(...histVals)*1.002:1;
  const toX=i=>(i/(histDays.length-1||1))*chartW;
  const toY=v=>chartH-((v-hMin)/(hMax-hMin||1))*chartH;
  const polyline=histVals.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const areaPath=histVals.length>1?`M${toX(0)},${chartH} `+histVals.map((v,i)=>`L${toX(i)},${toY(v)}`).join(" ")+` L${toX(histVals.length-1)},${chartH} Z`:"";

  const enriched = h => ({
    ...h,
    evalAmt:(h.currentPrice*h.shares),
    profitAmt:((h.currentPrice-h.costPrice)*h.shares),
    profitPct:((h.currentPrice-h.costPrice)/h.costPrice)*100,
  });
  const filtered = allH.map(enriched)
    .filter(h=>filterCat==="전체"||getCategory(h.ticker,h.fundType)===filterCat)
    .sort((a,b)=>sortBy==="evalAmt"?b.evalAmt-a.evalAmt:sortBy==="profitPct"?b.profitPct-a.profitPct:b.profitAmt-a.profitAmt);

  const acctCards = [
    {key:"all",label:"전체 합산",icon:"🗂"},
    ...Object.entries(portfolio.accounts).map(([k,a])=>({key:k,label:a.name,icon:a.icon}))
  ].map(a=>{
    const h=getHoldings(a.key);
    const ev=h.reduce((s,x)=>s+x.currentPrice*x.shares,0);
    const co=h.reduce((s,x)=>s+x.costPrice*x.shares,0);
    return {...a,eval:ev,cost:co,profit:ev-co,pct:co>0?(ev-co)/co*100:0};
  });

  const catBreak={};
  allH.forEach(h=>{const c=getCategory(h.ticker,h.fundType);catBreak[c]=(catBreak[c]||0)+h.currentPrice*h.shares;});
  const pieSlices=Object.entries(catBreak).map(([cat,val])=>({cat,val,pct:(val/totalEval)*100,color:CATEGORY_COLORS[cat]||"#64748b"})).sort((a,b)=>b.val-a.val);
  let cumA=0;
  const svgSlices=pieSlices.map(s=>{
    const start=cumA,sweep=(s.pct/100)*360;cumA+=sweep;
    const r=80,cx=100,cy=100,rad=a=>(a-90)*Math.PI/180;
    const x1=cx+r*Math.cos(rad(start)),y1=cy+r*Math.sin(rad(start));
    const x2=cx+r*Math.cos(rad(start+sweep)),y2=cy+r*Math.sin(rad(start+sweep));
    return {...s,d:`M${cx} ${cy}L${x1} ${y1}A${r} ${r} 0 ${sweep>180?1:0} 1 ${x2} ${y2}Z`};
  });

  const getAIInsight = async () => {
    setInsightLoading(true); setAiInsight("");
    const summary=getHoldings("all").map(h=>`[${h.accType}] ${h.ticker}: ${(((h.currentPrice-h.costPrice)/h.costPrice)*100).toFixed(2)}% (평가 ${wonFull(h.currentPrice*h.shares)})`).join("\n");
    const histTrend=histDays.slice(-7).map(d=>`${d.slice(5)}: ${won(history[d]?.eval)}원`).join(" → ");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,messages:[{role:"user",content:`ETF/펀드 포트폴리오 분석:\n${summary}\n\n최근 추이: ${histTrend}\n총 평가: ${wonFull(totalEval)}, 수익: ${fmtAmt(totalProfit)} (${fmt(totalPct)})\n\n한국어로 강점·리스크·리밸런싱 제안 5문장.`}]})});
      const data=await res.json();
      setAiInsight(data.content?.find(b=>b.type==="text")?.text||"분석 불가");
    } catch { setAiInsight("오류가 발생했습니다."); }
    setInsightLoading(false);
  };

  const categories=["전체",...Object.keys(CATEGORY_COLORS)];
  const acctColor={"주식CMA":"#22c55e","변액보험":"#f59e0b"};
  const lastUpdated = history[TODAY] ? `오늘 업데이트됨 ✓` : `오늘 미업데이트`;
  const lastUpdatedColor = history[TODAY] ? green : "#f59e0b";

  return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Pretendard','Noto Sans KR','Inter',sans-serif",color:"#e2e8f0"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0d1b3e,#1a1040)",borderBottom:"1px solid rgba(99,102,241,0.2)",padding:"0 20px"}}>
        <div style={{maxWidth:1080,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📈</div>
            <div>
              <div style={{fontWeight:700,fontSize:16}}>내 투자 포트폴리오</div>
              <div style={{fontSize:11,color:lastUpdatedColor}}>{TODAY} · {lastUpdated}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {autoStatus && <span style={{fontSize:11,color:"#94a3b8",maxWidth:200}}>{autoStatus}</span>}

            {/* 자동 업데이트 버튼 */}
            <button onClick={autoUpdate} disabled={autoLoading}
              style={{padding:"8px 14px",borderRadius:8,border:"none",background:autoLoading?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontSize:12,cursor:autoLoading?"not-allowed":"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
              {autoLoading?"⟳ 조회 중...":"🔄 ETF 자동 업데이트"}
            </button>

            {/* 수동 입력 버튼 */}
            <button onClick={startEdit}
              style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(99,102,241,0.4)",background:"rgba(99,102,241,0.1)",color:"#a5b4fc",fontSize:12,cursor:"pointer",fontWeight:600}}>
              ✏️ 수동 입력
            </button>

            {/* 데이터 초기화 버튼 */}
            <button onClick={resetToInitial}
              style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.07)",color:"#f87171",fontSize:12,cursor:"pointer",fontWeight:600}}>
              🔄 초기화
            </button>

            <div style={{textAlign:"right",marginLeft:4}}>
              <div style={{fontSize:19,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{won(totalEval)}원</div>
              <div style={{fontSize:12,color:totalPct>=0?green:red}}>{fmtAmt(totalProfit)} ({fmt(totalPct)})</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1080,margin:"0 auto",padding:"20px"}}>

        {/* 안내 배너 (오늘 미업데이트 시) */}
        {!history[TODAY] && (
          <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:13,color:"#fbbf24"}}>
              ⚠️ 오늘 시세가 아직 업데이트되지 않았어요. 장 마감(오후 4시) 이후 <b>ETF 자동 업데이트</b>를 눌러주세요.
            </div>
            <button onClick={autoUpdate} disabled={autoLoading}
              style={{padding:"6px 14px",borderRadius:7,border:"none",background:"#f59e0b",color:"#000",fontSize:12,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap",marginLeft:12}}>
              지금 업데이트
            </button>
          </div>
        )}

        {/* 수동 편집 모달 */}
        {editMode && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:"#0f172a",border:"1px solid rgba(99,102,241,0.3)",borderRadius:16,padding:24,width:"min(92vw,660px)",maxHeight:"82vh",overflow:"auto"}}>
              <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>✏️ 현재가 수동 입력</div>
              <div style={{fontSize:12,color:muted,marginBottom:18}}>ETF는 자동 업데이트를 먼저 시도하고, 실패한 종목이나 펀드/IRP는 여기서 입력하세요.</div>
              {Object.entries(portfolio.accounts).map(([accKey,acc])=>(
                <div key={accKey} style={{marginBottom:18}}>
                  <div style={{fontSize:12,color:"#a5b4fc",fontWeight:600,marginBottom:8,padding:"5px 10px",background:"rgba(99,102,241,0.1)",borderRadius:6}}>{acc.icon} {acc.name}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {acc.holdings.map(h=>(
                      <div key={h.id} style={{background:"rgba(30,41,59,0.6)",borderRadius:8,padding:"10px 12px"}}>
                        <div style={{fontSize:11,color:muted,marginBottom:4}}>{h.ticker}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <input type="number" value={editPrices[h.id]??h.currentPrice}
                            onChange={e=>setEditPrices(p=>({...p,[h.id]:e.target.value}))}
                            style={{flex:1,padding:"6px 8px",borderRadius:6,border:"1px solid rgba(99,102,241,0.3)",background:"#0f172a",color:"#e2e8f0",fontSize:12}}/>
                          <span style={{fontSize:11,color:muted}}>원</span>
                        </div>
                        <div style={{fontSize:10,color:muted,marginTop:3}}>
                          매입: {h.costPrice.toLocaleString()}원
                          {editPrices[h.id]&&Number(editPrices[h.id])>0&&(
                            <span style={{color:Number(editPrices[h.id])>=h.costPrice?green:red,marginLeft:6}}>
                              {fmt(((Number(editPrices[h.id])-h.costPrice)/h.costPrice)*100)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button onClick={applyEdit} style={{flex:1,padding:"11px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                  💾 저장 & 히스토리 기록
                </button>
                <button onClick={()=>setEditMode(false)} style={{padding:"11px 18px",borderRadius:8,border:"1px solid rgba(99,102,241,0.3)",background:"none",color:"#94a3b8",fontSize:13,cursor:"pointer"}}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 계좌 카드 */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:20}}>
          {acctCards.map(a=>{
            const active=selectedAccount===a.key;
            return (
              <button key={a.key} onClick={()=>setSelectedAccount(a.key)}
                style={{padding:"13px 12px",borderRadius:12,border:`1px solid ${active?"#6366f1":brd}`,background:active?"rgba(99,102,241,0.12)":sur,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                <div style={{fontSize:11,color:active?"#a5b4fc":muted,marginBottom:4,fontWeight:600}}>{a.icon} {a.label}</div>
                <div style={{fontSize:16,fontWeight:800,fontVariantNumeric:"tabular-nums"}}>{won(a.eval)}원</div>
                <div style={{fontSize:11,color:a.profit>=0?green:red,marginTop:2}}>{fmtAmt(a.profit)} ({fmt(a.pct)})</div>
              </button>
            );
          })}
        </div>

        {/* 탭 */}
        <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:`1px solid ${brd}`}}>
          {[["overview","📊 종목별"],["history","📅 일별 수익"],["chart","🥧 비중"],["insight","🤖 AI 분석"]].map(([tab,label])=>(
            <button key={tab} onClick={()=>{setActiveTab(tab);if(tab==="insight"&&!aiInsight)getAIInsight();}}
              style={{padding:"9px 16px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:activeTab===tab?"#a5b4fc":muted,borderBottom:activeTab===tab?"2px solid #6366f1":"2px solid transparent",marginBottom:-1}}>
              {label}
            </button>
          ))}
        </div>

        {/* ── 종목별 탭 ── */}
        {activeTab==="overview" && (
          <>
            <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
              {categories.map(cat=>(
                <button key={cat} onClick={()=>setFilterCat(cat)}
                  style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${filterCat===cat?(CATEGORY_COLORS[cat]||purple):"rgba(99,102,241,0.2)"}`,background:filterCat===cat?"rgba(99,102,241,0.1)":"none",color:filterCat===cat?"#e2e8f0":muted,fontSize:11,cursor:"pointer"}}>
                  {cat}
                </button>
              ))}
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{marginLeft:"auto",padding:"4px 10px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"#0f172a",color:"#e2e8f0",fontSize:12}}>
                <option value="evalAmt">평가금액순</option>
                <option value="profitPct">수익률순</option>
                <option value="profitAmt">수익금순</option>
              </select>
            </div>
            <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"rgba(99,102,241,0.08)"}}>
                    {["종목","계좌","카테고리","현재가","평가금액","수익금","수익률","비중"].map((h,i)=>(
                      <th key={i} style={{padding:"11px 12px",textAlign:i===0?"left":"right",fontSize:11,fontWeight:600,color:muted,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${brd}`}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h,idx)=>{
                    const cat=getCategory(h.ticker,h.fundType);
                    const col=CATEGORY_COLORS[cat]||muted;
                    const w=(h.evalAmt/totalEval*100).toFixed(1);
                    return (
                      <tr key={h.id} style={{borderBottom:idx<filtered.length-1?`1px solid rgba(99,102,241,0.06)`:"none"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.04)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"11px 12px"}}>
                          <div style={{fontWeight:600,fontSize:12,display:"flex",alignItems:"center",gap:5}}>
                            {h.fundType==="펀드"&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:8,background:"rgba(167,139,250,0.2)",color:"#a78bfa"}}>펀드</span>}
                            {h.ticker}
                          </div>
                          <div style={{fontSize:10,color:muted,marginTop:1}}>매입 {h.costPrice.toLocaleString()}원 · {h.shares}주</div>
                        </td>
                        <td style={{padding:"11px 12px",textAlign:"right"}}>
                          <span style={{fontSize:10,padding:"2px 6px",borderRadius:8,background:`${acctColor[h.accType]||purple}22`,color:acctColor[h.accType]||purple}}>{h.accType}</span>
                        </td>
                        <td style={{padding:"11px 12px",textAlign:"right"}}>
                          <span style={{padding:"2px 7px",borderRadius:10,background:`${col}18`,color:col,fontSize:10,fontWeight:600}}>{cat}</span>
                        </td>
                        <td style={{padding:"11px 12px",textAlign:"right",fontSize:12,fontVariantNumeric:"tabular-nums"}}>{h.currentPrice.toLocaleString()}</td>
                        <td style={{padding:"11px 12px",textAlign:"right",fontWeight:600,fontSize:12,fontVariantNumeric:"tabular-nums"}}>{h.evalAmt.toLocaleString()}</td>
                        <td style={{padding:"11px 12px",textAlign:"right",color:h.profitAmt>=0?green:red,fontSize:12,fontVariantNumeric:"tabular-nums"}}>{fmtAmt(h.profitAmt)}</td>
                        <td style={{padding:"11px 12px",textAlign:"right"}}>
                          <span style={{padding:"2px 8px",borderRadius:20,background:h.profitPct>=0?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:h.profitPct>=0?green:red,fontWeight:700,fontSize:11}}>
                            {fmt(h.profitPct)}
                          </span>
                        </td>
                        <td style={{padding:"11px 12px",textAlign:"right"}}>
                          <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                            <div style={{width:36,height:4,borderRadius:2,background:"rgba(99,102,241,0.15)",overflow:"hidden"}}>
                              <div style={{width:`${Math.min(parseFloat(w)*2,100)}%`,height:"100%",background:col,borderRadius:2}}/>
                            </div>
                            <span style={{fontSize:10,color:"#94a3b8",minWidth:28}}>{w}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── 일별 수익 탭 ── */}
        {activeTab==="history" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,padding:24}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:16}}>📈 평가금액 추이 (최근 {histDays.length}일)</div>
              {histDays.length<2?(
                <div style={{textAlign:"center",padding:40,color:muted}}>
                  <div style={{fontSize:32,marginBottom:12}}>📭</div>
                  <div style={{fontSize:14}}>아직 데이터가 쌓이지 않았어요.</div>
                  <div style={{fontSize:12,marginTop:8}}>매일 <b style={{color:"#a5b4fc"}}>🔄 ETF 자동 업데이트</b>를 누르면 그래프가 쌓입니다.</div>
                </div>
              ):(
                <svg viewBox={`-10 0 ${chartW+60} ${chartH+32}`} style={{width:"100%",height:150}}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  {areaPath&&<path d={areaPath} fill="url(#ag)"/>}
                  <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinejoin="round"/>
                  {histVals.map((v,i)=>(<circle key={i} cx={toX(i)} cy={toY(v)} r={2.5} fill="#6366f1" stroke={bg} strokeWidth={1.5}/>))}
                  {[0,0.5,1].map(t=>{
                    const yv=hMin+t*(hMax-hMin),yp=chartH-t*chartH;
                    return <text key={t} x={chartW+4} y={yp+4} fontSize={8} fill={muted} textAnchor="start">{won(yv)}원</text>;
                  })}
                  {[0,Math.floor((histDays.length-1)/2),histDays.length-1].filter((v,i,a)=>a.indexOf(v)===i).map(i=>(
                    <text key={i} x={toX(i)} y={chartH+18} fontSize={8} fill={muted} textAnchor="middle">{histDays[i]?.slice(5)}</text>
                  ))}
                </svg>
              )}
            </div>

            <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"rgba(99,102,241,0.08)"}}>
                    {["날짜","평가금액","일간 변화","누적 수익금","누적 수익률"].map((h,i)=>(
                      <th key={i} style={{padding:"11px 16px",textAlign:i===0?"left":"right",fontSize:11,fontWeight:600,color:muted,textTransform:"uppercase",borderBottom:`1px solid ${brd}`}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...histDays].reverse().map((d,idx)=>{
                    const cur=history[d];
                    const prevDay=histDays[histDays.length-2-idx];
                    const prev=prevDay?history[prevDay]:null;
                    const dayChange=prev?cur.eval-prev.eval:null;
                    const profitPct=cur.cost>0?((cur.eval-cur.cost)/cur.cost)*100:0;
                    const isToday=d===TODAY;
                    return (
                      <tr key={d} style={{borderBottom:idx<histDays.length-1?`1px solid rgba(99,102,241,0.06)`:"none",background:isToday?"rgba(99,102,241,0.06)":"transparent"}}>
                        <td style={{padding:"11px 16px",fontWeight:isToday?700:400}}>
                          {d} {isToday&&<span style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:"rgba(99,102,241,0.2)",color:"#a5b4fc",marginLeft:4}}>오늘</span>}
                        </td>
                        <td style={{padding:"11px 16px",textAlign:"right",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{wonFull(cur.eval)}</td>
                        <td style={{padding:"11px 16px",textAlign:"right",color:dayChange==null?muted:dayChange>=0?green:red,fontVariantNumeric:"tabular-nums"}}>
                          {dayChange==null?"첫 기록":fmtAmt(dayChange)}
                        </td>
                        <td style={{padding:"11px 16px",textAlign:"right",color:cur.profit>=0?green:red,fontVariantNumeric:"tabular-nums"}}>{fmtAmt(cur.profit)}</td>
                        <td style={{padding:"11px 16px",textAlign:"right"}}>
                          <span style={{padding:"2px 8px",borderRadius:20,background:profitPct>=0?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:profitPct>=0?green:red,fontWeight:700,fontSize:12}}>
                            {fmt(profitPct)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {histDays.length===0&&(
                    <tr><td colSpan={5} style={{padding:40,textAlign:"center",color:muted,fontSize:13}}>기록 없음</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 비중 탭 ── */}
        {activeTab==="chart" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,padding:24}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:16}}>자산 배분</div>
              <div style={{display:"flex",justifyContent:"center"}}>
                <svg viewBox="0 0 200 200" style={{width:160,height:160}}>
                  {svgSlices.map((s,i)=>(<path key={i} d={s.d} fill={s.color} opacity={0.85} stroke={bg} strokeWidth={1.5}/>))}
                  <circle cx={100} cy={100} r={40} fill={bg}/>
                  <text x={100} y={97} textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight={700}>{won(totalEval)}</text>
                  <text x={100} y={109} textAnchor="middle" fill={muted} fontSize={8}>총 평가</text>
                </svg>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:14}}>
                {pieSlices.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:10,height:10,borderRadius:2,background:s.color}}/><span style={{fontSize:12}}>{s.cat}</span></div>
                    <div style={{display:"flex",gap:10}}><span style={{fontSize:11,color:muted}}>{won(s.val)}원</span><span style={{fontSize:11,fontWeight:600,color:s.color,minWidth:36,textAlign:"right"}}>{s.pct.toFixed(1)}%</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,padding:24}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:16}}>TOP 10 종목 비중</div>
              {getHoldings("all").map(h=>({...h,ev:h.currentPrice*h.shares})).sort((a,b)=>b.ev-a.ev).slice(0,10).map(h=>{
                const w=(h.ev/totalEval*100);
                const col=CATEGORY_COLORS[getCategory(h.ticker,h.fundType)]||muted;
                return (
                  <div key={h.id} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:11,color:"#cbd5e1"}}>{h.ticker.length>14?h.ticker.slice(0,14)+"…":h.ticker}</span>
                      <span style={{fontSize:11,color:col,fontWeight:600}}>{w.toFixed(1)}%</span>
                    </div>
                    <div style={{height:4,borderRadius:2,background:"rgba(99,102,241,0.1)"}}>
                      <div style={{width:`${w}%`,height:"100%",background:col,borderRadius:2}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── AI 분석 탭 ── */}
        {activeTab==="insight" && (
          <div style={{background:sur,border:`1px solid ${brd}`,borderRadius:16,padding:28}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{fontSize:28}}>🤖</div>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>AI 포트폴리오 분석</div>
                <div style={{fontSize:12,color:muted}}>3계좌 · {getHoldings("all").length}종목 · 최근 히스토리 반영</div>
              </div>
            </div>
            {insightLoading?(
              <div style={{textAlign:"center",padding:40,color:muted}}>Claude가 분석 중입니다... ⟳</div>
            ):aiInsight?(
              <>
                <div style={{lineHeight:1.9,color:"#cbd5e1",fontSize:14,whiteSpace:"pre-wrap"}}>{aiInsight}</div>
                <button onClick={getAIInsight} style={{marginTop:20,padding:"9px 18px",borderRadius:8,border:"1px solid rgba(99,102,241,0.3)",background:"rgba(99,102,241,0.1)",color:"#a5b4fc",fontSize:13,cursor:"pointer"}}>↻ 재분석</button>
              </>
            ):(
              <button onClick={getAIInsight} style={{padding:"12px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",fontWeight:600,fontSize:14,cursor:"pointer"}}>🤖 AI 분석 시작</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
