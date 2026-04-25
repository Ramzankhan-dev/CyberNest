import React, { useState } from 'react';
import {
  Shield, Smartphone, Settings, LogOut, Menu, BarChart3, AlertTriangle,
  Search, ChevronDown, CheckCircle2, Lock, Package, Download, Zap,
} from 'lucide-react';

const C = {
  bg950:'#020817',bg900:'#0f172a',bg800:'#1e293b',bg700:'#334155',bg600:'#475569',
  text50:'#f8fafc',text300:'#cbd5e1',text400:'#94a3b8',text500:'#64748b',
  cyan400:'#22d3ee',cyan600:'#0891b2',cyan700:'#0e7490',
  emerald400:'#34d399',emerald600:'#059669',
  red400:'#f87171',red600:'#dc2626',
  border800:'#1e293b',border700:'#334155',
};

const sidebarBtnStyle=(active)=>({
  width:'100%',display:'flex',alignItems:'center',gap:'0.75rem',
  padding:'0.625rem 1rem',borderRadius:'0.375rem',
  border:active?`1px solid ${C.border700}`:'1px solid transparent',
  backgroundColor:active?C.bg800:'transparent',color:active?C.cyan400:C.text400,
  fontSize:'0.875rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s',
});

const availableApps = [
  {id:'com.google.android.calculator',name:'Calculator',category:'Productivity',icon:'🧮'},
  {id:'com.google.android.apps.chrome',name:'Chrome',category:'Browser',icon:'🌐'},
  {id:'com.android.calendar',name:'Calendar',category:'Productivity',icon:'📅'},
  {id:'com.android.email',name:'Email',category:'Communication',icon:'📧'},
  {id:'com.android.systemui',name:'System UI',category:'System',icon:'⚙️'},
  {id:'com.android.messaging',name:'Messages',category:'Communication',icon:'💬'},
  {id:'com.spotify.music',name:'Spotify',category:'Media',icon:'🎵'},
  {id:'com.whatsapp',name:'WhatsApp',category:'Communication',icon:'💬'},
  {id:'com.facebook.katana',name:'Facebook',category:'Social',icon:'f'},
  {id:'com.instagram.android',name:'Instagram',category:'Social',icon:'📷'},
  {id:'com.twitter.android',name:'Twitter',category:'Social',icon:'𝕏'},
  {id:'com.android.youtube',name:'YouTube',category:'Media',icon:'▶️'},
];

export default function CyberNestPolicies() {
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [activeNav,setActiveNav]=useState('settings');
  const [kioskModeEnabled,setKioskModeEnabled]=useState(false);
  const [appSearchTerm,setAppSearchTerm]=useState('');
  const [selectedApps,setSelectedApps]=useState(new Set(['com.google.android.calculator','com.google.android.apps.chrome']));
  const [whitelistMode,setWhitelistMode]=useState(true);

  const filteredApps=availableApps.filter(a=>a.name.toLowerCase().includes(appSearchTerm.toLowerCase())||a.category.toLowerCase().includes(appSearchTerm.toLowerCase()));

  const toggleApp=(id)=>{
    const n=new Set(selectedApps);
    n.has(id)?n.delete(id):n.add(id);
    setSelectedApps(n);
  };

  const navItems=[
    {id:'dashboard',label:'Dashboard',Icon:BarChart3},
    {id:'devices',label:'Devices',Icon:Smartphone},
    {id:'commands',label:'Commands',Icon:AlertTriangle},
    {id:'settings',label:'Settings',Icon:Settings},
  ];

  return (
    <div style={{minHeight:'100vh',backgroundColor:C.bg950,color:C.text50,fontFamily:'sans-serif'}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',opacity:0.02,backgroundImage:`linear-gradient(0deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%)`,backgroundSize:'60px 60px'}}/>

      <div style={{position:'relative',display:'flex',height:'100vh',overflow:'hidden'}}>
        {/* SIDEBAR */}
        <div style={{position:'fixed',top:0,left:0,bottom:0,zIndex:40,width:sidebarOpen?224:80,backgroundColor:C.bg900,borderRight:`1px solid ${C.border800}`,display:'flex',flexDirection:'column',transition:'width 0.3s'}}>
          <div style={{padding:'1rem',borderBottom:`1px solid ${C.border800}`}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{padding:'0.5rem',borderRadius:'0.5rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,display:'flex'}}><Shield size={20} color={C.cyan400}/></div>
              {sidebarOpen&&<div><p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,margin:0}}>CyberNest</p><p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>MDM Platform</p></div>}
            </div>
          </div>
          <nav style={{flex:1,padding:'1rem',display:'flex',flexDirection:'column',gap:'0.25rem'}}>
            {navItems.map(({id,label,Icon})=>(
              <button key={id} onClick={()=>setActiveNav(id)} style={sidebarBtnStyle(activeNav===id)}>
                <Icon size={16} style={{flexShrink:0}}/>{sidebarOpen&&<span>{label}</span>}
              </button>
            ))}
          </nav>
          {sidebarOpen&&(
            <div style={{padding:'1rem',borderTop:`1px solid ${C.border800}`}}>
              <button style={{width:'100%',display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.625rem 1rem',borderRadius:'0.375rem',border:'none',backgroundColor:'transparent',color:C.text400,fontSize:'0.875rem',fontWeight:500,cursor:'pointer'}}>
                <LogOut size={16}/><span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:'flex',flexDirection:'column',marginLeft:sidebarOpen?224:80,transition:'margin-left 0.3s'}}>
          {/* TOPBAR */}
          <div style={{borderBottom:`1px solid ${C.border800}`,backgroundColor:'rgba(15,23,42,0.5)',backdropFilter:'blur(8px)',position:'sticky',top:0,zIndex:30}}>
            <div style={{padding:'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                {!sidebarOpen&&<button onClick={()=>setSidebarOpen(true)} style={{padding:'0.5rem',background:'none',border:'none',cursor:'pointer',color:C.text400}}><Menu size={20}/></button>}
                <h2 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:0}}>Policies & Settings</h2>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.5rem 0.75rem',borderRadius:'0.375rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`}}>
                  <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:C.emerald400,animation:'pulse 2s infinite'}}/>
                  <span style={{fontSize:'0.75rem',color:C.text300,fontFamily:'monospace'}}>Backend: Online</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',paddingLeft:'1.5rem',borderLeft:`1px solid ${C.border800}`}}>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'0.875rem',fontWeight:500,color:C.text50,margin:0}}>Admin</p>
                    <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>Level: ADMIN</p>
                  </div>
                  <div style={{width:32,height:32,borderRadius:'0.375rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,display:'flex',alignItems:'center',justifyContent:'center',color:C.text400,fontWeight:600,fontSize:'0.75rem'}}>AD</div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflow:'auto',padding:'2rem'}}>
            {/* KIOSK MODE */}
            <div style={{marginBottom:'2rem'}}>
              <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem',marginBottom:'1rem'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
                  <div>
                    <h3 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:'0 0 0.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <Package size={20} color={C.cyan400}/>Kiosk Mode
                    </h3>
                    <p style={{fontSize:'0.875rem',color:C.text500,margin:0}}>Lock devices to specific apps and restrict access</p>
                  </div>
                  <button onClick={()=>setKioskModeEnabled(k=>!k)} style={{position:'relative',width:48,height:24,borderRadius:9999,backgroundColor:kioskModeEnabled?C.emerald600:C.bg700,border:'none',cursor:'pointer',flexShrink:0,transition:'background-color 0.2s'}}>
                    <div style={{position:'absolute',top:4,left:kioskModeEnabled?28:4,width:16,height:16,backgroundColor:'#fff',borderRadius:'50%',transition:'left 0.2s'}}/>
                  </button>
                </div>
              </div>

              {kioskModeEnabled&&(
                <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem'}}>
                  {/* Whitelist/Blacklist toggle */}
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
                    <div>
                      <p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,margin:'0 0 0.25rem'}}>App Control Mode</p>
                      <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{whitelistMode?'Only selected apps allowed':'Selected apps are blocked'}</p>
                    </div>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button onClick={()=>setWhitelistMode(true)} style={{padding:'0.5rem 1rem',borderRadius:'0.375rem',border:'none',backgroundColor:whitelistMode?C.cyan600:C.bg700,color:whitelistMode?'#fff':C.text400,fontSize:'0.875rem',fontWeight:500,cursor:'pointer'}}>Whitelist</button>
                      <button onClick={()=>setWhitelistMode(false)} style={{padding:'0.5rem 1rem',borderRadius:'0.375rem',border:'none',backgroundColor:!whitelistMode?C.red600:C.bg700,color:!whitelistMode?'#fff':C.text400,fontSize:'0.875rem',fontWeight:500,cursor:'pointer'}}>Blacklist</button>
                    </div>
                  </div>

                  {/* Search */}
                  <div style={{position:'relative',marginBottom:'1.5rem'}}>
                    <Search size={16} color={C.text500} style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)'}}/>
                    <input type="text" placeholder="Search apps by name or category..." value={appSearchTerm} onChange={e=>setAppSearchTerm(e.target.value)}
                      style={{width:'100%',paddingLeft:'2.25rem',paddingRight:'0.75rem',paddingTop:'0.625rem',paddingBottom:'0.625rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',color:C.text50,outline:'none',boxSizing:'border-box'}}/>
                  </div>

                  {/* Selected apps */}
                  <div style={{marginBottom:'1.5rem',padding:'1rem',backgroundColor:'rgba(30,41,59,0.5)',border:`1px solid ${C.border700}`,borderRadius:'0.5rem'}}>
                    <p style={{fontSize:'0.75rem',color:C.text400,marginBottom:'0.75rem',fontWeight:500,textTransform:'uppercase'}}>
                      {whitelistMode?'✓ Allowed':'✗ Blocked'} Apps ({selectedApps.size})
                    </p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                      {Array.from(selectedApps).map(id=>{
                        const app=availableApps.find(a=>a.id===id);
                        return app?(
                          <span key={id} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.25rem 0.75rem',backgroundColor:C.bg700,border:`1px solid ${C.border700}`,borderRadius:9999,fontSize:'0.75rem',color:C.text300}}>
                            <span>{app.icon}</span><span>{app.name}</span>
                            <button onClick={()=>toggleApp(id)} style={{background:'none',border:'none',cursor:'pointer',color:C.text500,fontSize:'1rem',padding:0,lineHeight:1}}>×</button>
                          </span>
                        ):null;
                      })}
                    </div>
                  </div>

                  {/* Apps grid */}
                  <div>
                    <p style={{fontSize:'0.75rem',color:C.text400,fontWeight:500,textTransform:'uppercase',marginBottom:'1rem'}}>Available Apps</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
                      {filteredApps.map(app=>{
                        const selected=selectedApps.has(app.id);
                        return (
                          <button key={app.id} onClick={()=>toggleApp(app.id)} style={{padding:'1rem',borderRadius:'0.5rem',border:`2px solid ${selected?C.cyan400:C.border700}`,backgroundColor:selected?'rgba(8,56,63,0.2)':C.bg800,cursor:'pointer',textAlign:'left',transition:'all 0.2s'}}
                            onMouseEnter={e=>{if(!selected)e.currentTarget.style.borderColor=C.border700;}}
                          >
                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
                              <div>
                                <p style={{fontSize:'0.875rem',fontWeight:500,color:C.text50,margin:'0 0 0.25rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                  <span style={{fontSize:'1.125rem'}}>{app.icon}</span>{app.name}
                                </p>
                                <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{app.category}</p>
                              </div>
                              <div style={{width:20,height:20,borderRadius:'0.25rem',border:`2px solid ${selected?C.cyan400:C.border700}`,backgroundColor:selected?C.cyan600:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                {selected&&<CheckCircle2 size={16} color="#fff"/>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {filteredApps.length===0&&<p style={{textAlign:'center',color:C.text500,padding:'2rem'}}>No apps found matching your search</p>}
                  </div>

                  <div style={{marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:`1px solid ${C.border800}`}}>
                    <button style={{padding:'0.625rem 1.5rem',backgroundColor:C.cyan600,color:'#fff',border:'none',borderRadius:'0.5rem',fontWeight:500,fontSize:'0.875rem',cursor:'pointer'}}>Save Configuration</button>
                  </div>
                </div>
              )}

              {!kioskModeEnabled&&(
                <div style={{backgroundColor:'rgba(30,41,59,0.3)',border:`1px solid ${C.border700}`,borderRadius:'0.5rem',padding:'2rem',textAlign:'center'}}>
                  <Lock size={48} color={C.bg600} style={{margin:'0 auto 1rem'}}/>
                  <p style={{color:C.text400,fontWeight:500,margin:'0 0 0.5rem'}}>Kiosk Mode is currently disabled</p>
                  <p style={{color:C.text500,fontSize:'0.875rem',margin:0}}>Enable Kiosk Mode above to manage app restrictions</p>
                </div>
              )}
            </div>

            {/* OTHER POLICIES */}
            <div>
              <h3 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <Zap size={20} color={C.cyan400}/>Other Policy Settings
              </h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                {[
                  {title:'Screen Lock',desc:'Enforce minimum screen lock requirements',icon:'🔒'},
                  {title:'Update Policy',desc:'Control automatic app and OS updates',icon:'⬆️'},
                  {title:'VPN Configuration',desc:'Force VPN connection for all traffic',icon:'🔐'},
                  {title:'WiFi Restrictions',desc:'Restrict WiFi to enterprise networks only',icon:'📡'},
                ].map((p,i)=>(
                  <div key={i} style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem',cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.border700;e.currentTarget.style.backgroundColor='rgba(30,41,59,0.3)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border800;e.currentTarget.style.backgroundColor=C.bg900;}}
                  >
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'0.75rem'}}>
                      <span style={{fontSize:'1.5rem'}}>{p.icon}</span>
                      <ChevronDown size={16} color={C.bg600}/>
                    </div>
                    <h4 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,margin:'0 0 0.5rem'}}>{p.title}</h4>
                    <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}