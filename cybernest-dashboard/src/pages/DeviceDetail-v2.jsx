import React, { useState } from 'react';
import {
  Shield, Smartphone, Settings, LogOut, Menu, BarChart3, AlertTriangle,
  MapPin, Wifi, Settings2, Lock, RefreshCw, Camera, Package,
  Navigation, CheckCircle2, Trash2, RotateCw,
} from 'lucide-react';

const C = {
  bg950:'#020817',bg900:'#0f172a',bg800:'#1e293b',bg700:'#334155',bg600:'#475569',
  text50:'#f8fafc',text300:'#cbd5e1',text400:'#94a3b8',text500:'#64748b',
  cyan400:'#22d3ee',cyan600:'#0891b2',
  emerald400:'#34d399',emerald600:'#059669',
  red400:'#f87171',red600:'#dc2626',red700:'#b91c1c',
  yellow400:'#facc15',yellow600:'#ca8a04',
  border800:'#1e293b',border700:'#334155',
};

const sidebarBtnStyle=(active)=>({
  width:'100%',display:'flex',alignItems:'center',gap:'0.75rem',
  padding:'0.625rem 1rem',borderRadius:'0.375rem',
  border:active?`1px solid ${C.border700}`:'1px solid transparent',
  backgroundColor:active?C.bg800:'transparent',color:active?C.cyan400:C.text400,
  fontSize:'0.875rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s',
});

const device = {
  id:'SM-A725F-001',model:'Samsung Galaxy A72',owner:'John Doe',
  osVersion:'Android 13',osLevel:'January 2024',ipAddress:'192.168.1.45',
  imei:'351234567890123',serialNumber:'R38K800Y4QZ',
  battery:85,batteryHealth:'Good',storage:128,storageUsed:92,
  ram:6,ramUsed:4.2,lastSeen:'2 minutes ago',status:'online',
  enrolled:'2023-12-15',latitude:40.7128,longitude:-74.006,locationName:'New York, USA',
};

export default function CyberNestDeviceDetail() {
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [activeNav,setActiveNav]=useState('devices');
  const [toggleStates,setToggleStates]=useState({
    disableCamera:false,blockAppInstall:false,forceLocation:true,
    disableBluetooth:false,blockUSBDebug:true,restrictDownloads:false,
  });

  const togglePolicy=(key)=>setToggleStates(p=>({...p,[key]:!p[key]}));

  const navItems=[
    {id:'dashboard',label:'Dashboard',Icon:BarChart3},
    {id:'devices',label:'Devices',Icon:Smartphone},
    {id:'commands',label:'Commands',Icon:AlertTriangle},
    {id:'settings',label:'Settings',Icon:Settings},
  ];

  const policyItems=[
    {id:'disableCamera',label:'Disable Camera',desc:'Prevent device camera access',Icon:Camera},
    {id:'blockAppInstall',label:'Block App Installs',desc:'Prevent installation of new applications',Icon:Package},
    {id:'forceLocation',label:'Force Location Tracking',desc:'Continuously track device location',Icon:Navigation},
    {id:'disableBluetooth',label:'Disable Bluetooth',desc:'Disable Bluetooth connectivity',Icon:Wifi},
    {id:'blockUSBDebug',label:'Block USB Debugging',desc:'Prevent USB debugging access',Icon:Settings2},
  ];

  const InfoRow=({label,value,mono=false})=>(
    <div>
      <p style={{fontSize:'0.75rem',color:C.text500,margin:'0 0 0.25rem'}}>{label}</p>
      <p style={{fontSize:'0.875rem',color:C.text50,margin:0,fontFamily:mono?'monospace':'inherit'}}>{value}</p>
    </div>
  );

  const Card=({children,style={}})=>(
    <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem',...style}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.border700;e.currentTarget.style.backgroundColor='rgba(30,41,59,0.3)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border800;e.currentTarget.style.backgroundColor=C.bg900;}}
    >{children}</div>
  );

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
                <div>
                  <h2 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:0}}>Device Details: {device.id}</h2>
                  <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{device.model}</p>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.5rem 0.75rem',borderRadius:'0.375rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`}}>
                <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:C.emerald400,animation:'pulse 2s infinite'}}/>
                <span style={{fontSize:'0.75rem',color:C.text300,fontFamily:'monospace'}}>Backend: Online</span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflow:'auto',padding:'2rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1.5rem'}}>
              {/* LEFT COLUMN */}
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                {/* Device Info */}
                <Card>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <Smartphone size={16} color={C.cyan400}/>Device Information
                  </h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                    <InfoRow label="Device ID" value={device.id} mono/>
                    <InfoRow label="Model" value={device.model}/>
                    <InfoRow label="Owner" value={device.owner}/>
                    <InfoRow label="OS Version" value={device.osVersion}/>
                    <InfoRow label="Security Patch" value={device.osLevel}/>
                    <InfoRow label="IMEI" value={device.imei} mono/>
                    <InfoRow label="Serial Number" value={device.serialNumber} mono/>
                  </div>
                </Card>

                {/* Storage */}
                <Card>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem'}}>Storage & Memory</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                    {[
                      {label:'Storage',used:device.storageUsed,total:device.storage,unit:'GB'},
                      {label:'RAM',used:device.ramUsed,total:device.ram,unit:'GB'},
                    ].map(({label,used,total,unit})=>(
                      <div key={label}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                          <span style={{fontSize:'0.75rem',color:C.text500}}>{label}</span>
                          <span style={{fontSize:'0.75rem',fontFamily:'monospace',color:C.text400}}>{used}/{total} {unit}</span>
                        </div>
                        <div style={{height:8,backgroundColor:C.bg700,borderRadius:9999,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${(used/total)*100}%`,backgroundColor:C.cyan600,borderRadius:9999}}/>
                        </div>
                      </div>
                    ))}
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                        <span style={{fontSize:'0.75rem',color:C.text500}}>Battery</span>
                        <span style={{fontSize:'0.75rem',fontFamily:'monospace',color:C.text400}}>{device.battery}%</span>
                      </div>
                      <div style={{height:8,backgroundColor:C.bg700,borderRadius:9999,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${device.battery}%`,backgroundColor:device.battery>60?C.emerald600:device.battery>30?C.yellow600:C.red600,borderRadius:9999}}/>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* MIDDLE COLUMN */}
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                {/* Network */}
                <Card>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <Wifi size={16} color={C.cyan400}/>Network Information
                  </h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                    <InfoRow label="IP Address" value={device.ipAddress} mono/>
                    <InfoRow label="Last Seen" value={device.lastSeen}/>
                    <InfoRow label="Enrolled" value={device.enrolled}/>
                  </div>
                </Card>

                {/* GPS Map */}
                <div style={{backgroundColor:C.bg900,border:`2px solid rgba(34,211,238,0.5)`,borderRadius:'0.5rem',overflow:'hidden',height:320,position:'relative',cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.cyan400}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(34,211,238,0.5)'}
                >
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1e293b,#0f172a)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{position:'absolute',inset:0,opacity:0.3}}>
                      <div style={{position:'absolute',top:80,left:80,width:160,height:160,border:`1px solid ${C.border700}`,borderRadius:'50%'}}/>
                      <div style={{position:'absolute',bottom:40,right:40,width:128,height:128,border:`1px solid ${C.border700}`,borderRadius:'50%'}}/>
                    </div>
                  </div>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{position:'relative'}}>
                      <div style={{position:'absolute',width:32,height:32,backgroundColor:C.cyan400,borderRadius:'50%',opacity:0.3,top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'pulse 2s infinite'}}/>
                      <MapPin size={32} color={C.cyan400}/>
                    </div>
                  </div>
                  <div style={{position:'absolute',bottom:16,left:16,right:16,zIndex:20}}>
                    <div style={{backgroundColor:'rgba(2,8,23,0.9)',backdropFilter:'blur(4px)',padding:'0.5rem 0.75rem',borderRadius:'0.5rem',border:`1px solid ${C.border700}`}}>
                      <p style={{fontSize:'0.75rem',fontWeight:500,color:C.cyan400,margin:'0 0 0.25rem'}}>📍 {device.locationName}</p>
                      <p style={{fontSize:'0.75rem',color:C.text500,fontFamily:'monospace',margin:0}}>{device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',maxHeight:'calc(100vh - 200px)',overflowY:'auto'}}>
                {/* Quick Actions */}
                <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem'}}>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem'}}>Quick Actions</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    {[
                      {label:'Force Lock',Icon:Lock,bg:C.red600,hover:C.red700},
                      {label:'Sync Data',Icon:RefreshCw,bg:C.cyan600,hover:'#0e7490'},
                      {label:'Wipe Device',Icon:Trash2,bg:C.red600,hover:C.red700},
                      {label:'Reboot',Icon:RotateCw,bg:C.yellow600,hover:'#a16207'},
                    ].map(({label,Icon,bg,hover})=>(
                      <button key={label} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',padding:'0.75rem 1rem',backgroundColor:bg,color:'#fff',border:'none',borderRadius:'0.5rem',fontSize:'0.875rem',fontWeight:500,cursor:'pointer',transition:'background-color 0.2s'}}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor=hover}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor=bg}
                      >
                        <Icon size={16}/><span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Policy Enforcement */}
                <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem'}}>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem'}}>Policy Enforcement</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                    {policyItems.map(({id,label,desc,Icon})=>{
                      const enabled=toggleStates[id];
                      return (
                        <div key={id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem',backgroundColor:'rgba(30,41,59,0.5)',border:`1px solid ${C.border700}`,borderRadius:'0.5rem',transition:'border-color 0.2s'}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=C.border700}
                        >
                          <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',flex:1}}>
                            <Icon size={16} color={C.text400} style={{flexShrink:0,marginTop:2}}/>
                            <div>
                              <p style={{fontSize:'0.875rem',fontWeight:500,color:C.text50,margin:'0 0 0.25rem'}}>{label}</p>
                              <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{desc}</p>
                            </div>
                          </div>
                          <button onClick={()=>togglePolicy(id)} style={{position:'relative',marginLeft:'1rem',width:48,height:24,borderRadius:9999,backgroundColor:enabled?C.emerald600:C.bg700,border:'none',cursor:'pointer',flexShrink:0,transition:'background-color 0.2s'}}>
                            <div style={{position:'absolute',top:4,left:enabled?28:4,width:16,height:16,backgroundColor:'#fff',borderRadius:'50%',transition:'left 0.2s'}}/>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compliance */}
                <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem'}}>
                  <h3 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem'}}>Compliance Status</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {[
                      {label:'Encryption Status',status:'Enabled',ok:true},
                      {label:'Firewall Status',status:'Active',ok:true},
                      {label:'Malware Detection',status:'Clean',ok:true},
                      {label:'Policy Compliance',status:'5 Violations',ok:false},
                    ].map(({label,status,ok})=>(
                      <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem',backgroundColor:'rgba(30,41,59,0.5)',borderRadius:'0.5rem'}}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor=C.bg800}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='rgba(30,41,59,0.5)'}
                      >
                        <span style={{fontSize:'0.875rem',color:C.text400}}>{label}</span>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                          {ok?<CheckCircle2 size={16} color={C.emerald400}/>:<AlertTriangle size={16} color={C.yellow400}/>}
                          <span style={{fontSize:'0.75rem',fontWeight:500,color:ok?C.emerald400:C.yellow400}}>{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}