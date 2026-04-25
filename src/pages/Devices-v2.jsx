import React, { useState, useMemo } from 'react';
import {
  Search, Shield, Smartphone, Settings, MoreVertical, ChevronDown,
  Battery, Signal, BarChart3, LogOut, Menu, CheckCircle2,
  AlertTriangle, XCircle, Plus, X, QrCode, Copy,
} from 'lucide-react';

const C = {
  bg950:'#020817',bg900:'#0f172a',bg800:'#1e293b',bg700:'#334155',bg600:'#475569',
  text50:'#f8fafc',text300:'#cbd5e1',text400:'#94a3b8',text500:'#64748b',
  cyan400:'#22d3ee',cyan600:'#0891b2',cyan700:'#0e7490',
  emerald400:'#34d399',emerald600:'#059669',
  red400:'#f87171',yellow400:'#facc15',
  border800:'#1e293b',border700:'#334155',
};

const shared = {
  iconBox:{ padding:'0.5rem',borderRadius:'0.5rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,display:'flex' },
  statusPill:{ display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.5rem 0.75rem',borderRadius:'0.375rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}` },
  sidebarBtn:(active)=>({
    width:'100%',display:'flex',alignItems:'center',gap:'0.75rem',
    padding:'0.625rem 1rem',borderRadius:'0.375rem',
    border:active?`1px solid ${C.border700}`:'1px solid transparent',
    backgroundColor:active?C.bg800:'transparent',color:active?C.cyan400:C.text400,
    fontSize:'0.875rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s',
  }),
};

const allDevices = [
  {id:'SM-A725F-001',model:'Samsung Galaxy A72',owner:'John Doe',battery:85,status:'online',lastSeen:'2 mins ago',group:'Staff Devices'},
  {id:'iPad-Gen7-002',model:'iPad (7th Gen)',owner:'Jane Smith',battery:12,status:'online',lastSeen:'1 min ago',group:'Kiosk Devices'},
  {id:'Pixel-6Pro-003',model:'Google Pixel 6 Pro',owner:'Mike Johnson',battery:45,status:'online',lastSeen:'5 mins ago',group:'Staff Devices'},
  {id:'iPhone-14-004',model:'iPhone 14 Pro',owner:'Sarah Williams',battery:92,status:'offline',lastSeen:'45 mins ago',group:'Staff Devices'},
  {id:'Galaxy-S23-005',model:'Samsung Galaxy S23',owner:'David Brown',battery:67,status:'online',lastSeen:'3 mins ago',group:'Kiosk Devices'},
  {id:'OnePlus-11-006',model:'OnePlus 11',owner:'Emily Davis',battery:38,status:'online',lastSeen:'8 mins ago',group:'Staff Devices'},
  {id:'Moto-G52-007',model:'Motorola G52',owner:'Chris Martinez',battery:71,status:'offline',lastSeen:'2 hours ago',group:'Kiosk Devices'},
  {id:'iPad-Air-008',model:'iPad Air (5th Gen)',owner:'Lisa Anderson',battery:56,status:'online',lastSeen:'4 mins ago',group:'Staff Devices'},
  {id:'Galaxy-Z-Fold-009',model:'Samsung Galaxy Z Fold 5',owner:'Robert Taylor',battery:28,status:'online',lastSeen:'6 mins ago',group:'Kiosk Devices'},
  {id:'iPhone-13-010',model:'iPhone 13 Mini',owner:'Jennifer Lee',battery:81,status:'online',lastSeen:'1 min ago',group:'Staff Devices'},
];

export default function CyberNestDevices() {
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [activeNav,setActiveNav]=useState('devices');
  const [searchTerm,setSearchTerm]=useState('');
  const [statusFilter,setStatusFilter]=useState('all');
  const [groupFilter,setGroupFilter]=useState('all');
  const [sortBy,setSortBy]=useState('name');
  const [selectedDevices,setSelectedDevices]=useState(new Set());
  const [showEnrollModal,setShowEnrollModal]=useState(false);
  const [showBulkActions,setShowBulkActions]=useState(false);

  const filteredDevices=useMemo(()=>{
    let f=allDevices.filter(d=>{
      const ms=d.id.toLowerCase().includes(searchTerm.toLowerCase())||d.model.toLowerCase().includes(searchTerm.toLowerCase())||d.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const mst=statusFilter==='all'||d.status===statusFilter;
      const mg=groupFilter==='all'||d.group===groupFilter;
      return ms&&mst&&mg;
    });
    if(sortBy==='battery') f.sort((a,b)=>b.battery-a.battery);
    else if(sortBy==='status') f.sort((a,b)=>a.status==='online'?-1:1);
    else f.sort((a,b)=>a.model.localeCompare(b.model));
    return f;
  },[searchTerm,statusFilter,groupFilter,sortBy]);

  const toggleDevice=(id)=>{
    const n=new Set(selectedDevices);
    n.has(id)?n.delete(id):n.add(id);
    setSelectedDevices(n);
    setShowBulkActions(n.size>0);
  };

  const toggleAll=()=>{
    if(selectedDevices.size===filteredDevices.length){setSelectedDevices(new Set());setShowBulkActions(false);}
    else{setSelectedDevices(new Set(filteredDevices.map(d=>d.id)));setShowBulkActions(true);}
  };

  const navItems=[
    {id:'dashboard',label:'Dashboard',Icon:BarChart3},
    {id:'devices',label:'Devices',Icon:Smartphone},
    {id:'commands',label:'Commands',Icon:AlertTriangle},
    {id:'settings',label:'Settings',Icon:Settings},
  ];

  const getBatteryColor=(b)=>b>60?C.emerald600:b>30?'#ca8a04':'#dc2626';

  return (
    <div style={{minHeight:'100vh',backgroundColor:C.bg950,color:C.text50,fontFamily:'sans-serif'}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',opacity:0.02,backgroundImage:`linear-gradient(0deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%)`,backgroundSize:'60px 60px'}} />

      <div style={{position:'relative',display:'flex',height:'100vh',overflow:'hidden'}}>
        {/* SIDEBAR */}
        <div style={{position:'fixed',top:0,left:0,bottom:0,zIndex:40,width:sidebarOpen?224:80,backgroundColor:C.bg900,borderRight:`1px solid ${C.border800}`,display:'flex',flexDirection:'column',transition:'width 0.3s'}}>
          <div style={{padding:'1rem',borderBottom:`1px solid ${C.border800}`}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={shared.iconBox}><Shield size={20} color={C.cyan400} /></div>
              {sidebarOpen&&<div><p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,margin:0}}>CyberNest</p><p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>MDM Platform</p></div>}
            </div>
          </div>
          <nav style={{flex:1,padding:'1rem',display:'flex',flexDirection:'column',gap:'0.25rem'}}>
            {navItems.map(({id,label,Icon})=>(
              <button key={id} onClick={()=>setActiveNav(id)} style={shared.sidebarBtn(activeNav===id)}>
                <Icon size={16} style={{flexShrink:0}} />{sidebarOpen&&<span>{label}</span>}
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
                <h2 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:0}}>Devices</h2>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
                <div style={shared.statusPill}>
                  <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:C.emerald400}} />
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
            {/* Header row */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <div>
                <h3 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:'0 0 0.25rem'}}>Device Fleet</h3>
                <p style={{fontSize:'0.75rem',color:C.text500,margin:0}}>{filteredDevices.length} of {allDevices.length} devices</p>
              </div>
              <button onClick={()=>setShowEnrollModal(true)} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.625rem 1rem',backgroundColor:C.cyan600,color:'#fff',border:'none',borderRadius:'0.5rem',fontSize:'0.875rem',fontWeight:500,cursor:'pointer'}}>
                <Plus size={16}/><span>Enroll Device</span>
              </button>
            </div>

            {/* Bulk actions bar */}
            {showBulkActions&&(
              <div style={{marginBottom:'1rem',padding:'0.75rem 1rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <span style={{fontSize:'0.875rem',color:C.text300}}>{selectedDevices.size} selected</span>
                {['Lock All','Sync All','Reboot All'].map(a=>(
                  <button key={a} onClick={()=>{alert(`Executing ${a} on ${selectedDevices.size} devices`);setSelectedDevices(new Set());setShowBulkActions(false);}} style={{padding:'0.375rem 0.75rem',backgroundColor:'transparent',border:`1px solid ${C.border700}`,borderRadius:'0.375rem',color:C.text300,fontSize:'0.75rem',cursor:'pointer'}}>{a}</button>
                ))}
              </div>
            )}

            {/* Filters */}
            <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
              <div style={{position:'relative',flex:'1',minWidth:200}}>
                <Search size={16} color={C.text500} style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)'}} />
                <input type="text" placeholder="Search devices..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                  style={{width:'100%',paddingLeft:'2.25rem',paddingRight:'0.75rem',paddingTop:'0.625rem',paddingBottom:'0.625rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',color:C.text50,outline:'none',boxSizing:'border-box'}} />
              </div>
              {[{val:statusFilter,set:setStatusFilter,opts:['all','online','offline'],placeholder:'Status'},
                {val:groupFilter,set:setGroupFilter,opts:['all','Staff Devices','Kiosk Devices'],placeholder:'Group'},
                {val:sortBy,set:setSortBy,opts:['name','battery','status'],placeholder:'Sort'}].map((sel,i)=>(
                <div key={i} style={{position:'relative'}}>
                  <select value={sel.val} onChange={e=>sel.set(e.target.value)} style={{padding:'0.625rem 2rem 0.625rem 0.75rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',color:C.text50,outline:'none',cursor:'pointer',appearance:'none'}}>
                    {sel.opts.map(o=><option key={o} value={o}>{o==='all'?sel.placeholder:o}</option>)}
                  </select>
                  <ChevronDown size={14} color={C.text500} style={{position:'absolute',right:'0.5rem',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} />
                </div>
              ))}
            </div>

            {/* TABLE */}
            <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor:'rgba(15,23,42,0.5)',borderBottom:`1px solid ${C.border800}`}}>
                      <th style={{padding:'1rem',textAlign:'left'}}>
                        <input type="checkbox" checked={selectedDevices.size===filteredDevices.length&&filteredDevices.length>0} onChange={toggleAll} style={{width:16,height:16,cursor:'pointer'}} />
                      </th>
                      {['Device ID','Model','Owner','Group','Battery','Status','Last Seen','Actions'].map(h=>(
                        <th key={h} style={{padding:'1rem',textAlign:'left',fontSize:'0.75rem',fontWeight:600,color:C.text400,textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.map(device=>(
                      <tr key={device.id} style={{borderBottom:`1px solid ${C.border800}`}}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(30,41,59,0.5)'}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                      >
                        <td style={{padding:'1rem'}}>
                          <input type="checkbox" checked={selectedDevices.has(device.id)} onChange={()=>toggleDevice(device.id)} style={{width:16,height:16,cursor:'pointer'}} />
                        </td>
                        <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',fontFamily:'monospace',color:C.cyan400}}>{device.id}</span></td>
                        <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',color:C.text300,fontWeight:500}}>{device.model}</span></td>
                        <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',color:C.text400}}>{device.owner}</span></td>
                        <td style={{padding:'1rem'}}><span style={{fontSize:'0.75rem',padding:'0.25rem 0.625rem',backgroundColor:C.bg800,color:C.text400,borderRadius:'9999px'}}>{device.group}</span></td>
                        <td style={{padding:'1rem'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                            <div style={{height:8,width:64,backgroundColor:C.bg700,borderRadius:9999,overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${device.battery}%`,backgroundColor:getBatteryColor(device.battery),borderRadius:9999}} />
                            </div>
                            <span style={{fontSize:'0.75rem',color:C.text400,fontFamily:'monospace'}}>{device.battery}%</span>
                          </div>
                        </td>
                        <td style={{padding:'1rem'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:device.status==='online'?C.emerald400:C.text500}} />
                            <span style={{fontSize:'0.75rem',fontWeight:500,color:device.status==='online'?C.emerald400:C.text400}}>{device.status==='online'?'Online':'Offline'}</span>
                          </div>
                        </td>
                        <td style={{padding:'1rem'}}><span style={{fontSize:'0.75rem',color:C.text500}}>{device.lastSeen}</span></td>
                        <td style={{padding:'1rem'}}>
                          <div style={{display:'flex',gap:'0.5rem'}}>
                            <button style={{padding:'0.5rem',background:'none',border:'none',cursor:'pointer',color:C.text400,borderRadius:'0.375rem'}}><Signal size={16}/></button>
                            <button style={{padding:'0.5rem',background:'none',border:'none',cursor:'pointer',color:C.text400,borderRadius:'0.375rem'}}><MoreVertical size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDevices.length===0&&(
                <div style={{padding:'2rem',textAlign:'center'}}>
                  <Smartphone size={48} color={C.bg700} style={{margin:'0 auto 1rem'}} />
                  <p style={{color:C.text400,fontWeight:500}}>No devices found</p>
                  <p style={{color:C.text500,fontSize:'0.875rem'}}>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ENROLL MODAL */}
      {showEnrollModal&&(
        <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'1rem'}}>
          <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'2rem',maxWidth:'42rem',width:'100%',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
              <div>
                <h2 style={{fontSize:'1.5rem',fontWeight:700,color:C.text50,margin:'0 0 0.25rem'}}>Enroll New Device</h2>
                <p style={{fontSize:'0.875rem',color:C.text500,margin:0}}>Add a device to your MDM fleet</p>
              </div>
              <button onClick={()=>setShowEnrollModal(false)} style={{padding:'0.5rem',background:'none',border:'none',cursor:'pointer',color:C.text400}}><X size={24}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'1rem'}}>Step 1: Scan QR Code</p>
                <div style={{width:256,height:256,backgroundColor:C.bg800,border:`2px solid ${C.border700}`,borderRadius:'0.5rem',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem'}}>
                  <div style={{textAlign:'center'}}>
                    <QrCode size={96} color={C.bg600} />
                    <p style={{color:C.text500,fontSize:'0.875rem',marginTop:'0.75rem'}}>Mock QR Code</p>
                  </div>
                </div>
                <p style={{fontSize:'0.75rem',color:C.text500,textAlign:'center'}}>Point your device camera at this QR code to start enrollment</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                <div>
                  <p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'0.75rem'}}>Step 2: Enrollment Token</p>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <input type="text" value="ABC123DEF456" readOnly style={{flex:1,padding:'0.75rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',fontFamily:'monospace',color:C.cyan400,outline:'none'}} />
                    <button style={{padding:'0.75rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',cursor:'pointer',color:C.text400}}><Copy size={16}/></button>
                  </div>
                  <p style={{fontSize:'0.75rem',color:C.text500,marginTop:'0.5rem'}}>6-digit token valid for 15 minutes</p>
                </div>
                <div>
                  <p style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,marginBottom:'0.75rem'}}>Step 3: Android Agent Setup</p>
                  <ol style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {['Install CyberNest Agent app','Open app and tap "Enroll Device"','Scan QR code or enter token','Accept device policies','Device enrolled successfully'].map((step,i)=>(
                      <li key={i} style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                        <span style={{flexShrink:0,width:24,height:24,borderRadius:'50%',backgroundColor:'rgba(8,56,63,0.8)',color:C.cyan400,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700}}>{i+1}</span>
                        <span style={{fontSize:'0.875rem',color:C.text400,paddingTop:'0.25rem'}}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <button onClick={()=>setShowEnrollModal(false)} style={{padding:'0.75rem 1rem',backgroundColor:C.cyan600,color:'#fff',border:'none',borderRadius:'0.5rem',fontWeight:500,fontSize:'0.875rem',cursor:'pointer'}}>Got It</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}