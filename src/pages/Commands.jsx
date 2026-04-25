import React, { useState } from 'react';
import {
  Shield, Smartphone, Settings, LogOut, Menu, BarChart3, AlertTriangle,
  Search, ChevronDown, CheckCircle2, XCircle, Clock,
  Camera, Package, Navigation, Wifi, Settings2, Download,
} from 'lucide-react';

const C = {
  bg950:'#020817',bg900:'#0f172a',bg800:'#1e293b',bg700:'#334155',
  text50:'#f8fafc',text300:'#cbd5e1',text400:'#94a3b8',text500:'#64748b',text600:'#475569',
  cyan400:'#22d3ee',cyan600:'#0891b2',
  emerald400:'#34d399',emerald600:'#059669',
  red400:'#f87171',yellow400:'#facc15',
  border800:'#1e293b',border700:'#334155',
};

const sidebarBtnStyle = (active) => ({
  width:'100%',display:'flex',alignItems:'center',gap:'0.75rem',
  padding:'0.625rem 1rem',borderRadius:'0.375rem',
  border:active?`1px solid ${C.border700}`:'1px solid transparent',
  backgroundColor:active?C.bg800:'transparent',color:active?C.cyan400:C.text400,
  fontSize:'0.875rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s',
});

const commandLog = [
  {id:1,timestamp:'2024-01-15 14:45:32',device:'SM-A725F-001',command:'Force Lock Screen',status:'success',executedBy:'Admin User',result:'Device locked successfully'},
  {id:2,timestamp:'2024-01-15 14:35:18',device:'iPad-Gen7-002',command:'Sync Data',status:'success',executedBy:'Admin User',result:'Data synchronized - 2.4 GB transferred'},
  {id:3,timestamp:'2024-01-15 14:22:45',device:'Pixel-6Pro-003',command:'Policy Update',status:'success',executedBy:'System',result:'5 policies pushed, 3 enforced'},
  {id:4,timestamp:'2024-01-15 14:15:12',device:'iPhone-14-004',command:'Wipe Device',status:'pending',executedBy:'Admin User',result:'Awaiting device confirmation'},
  {id:5,timestamp:'2024-01-15 14:08:33',device:'Galaxy-S23-005',command:'Reboot Device',status:'success',executedBy:'System',result:'Device rebooted in 45 seconds'},
  {id:6,timestamp:'2024-01-15 13:58:19',device:'OnePlus-11-006',command:'Camera Restriction',status:'failed',executedBy:'Admin User',result:'Device offline - will retry when online'},
  {id:7,timestamp:'2024-01-15 13:45:01',device:'Moto-G52-007',command:'Location Tracking',status:'success',executedBy:'System',result:'Location tracking enabled'},
  {id:8,timestamp:'2024-01-15 13:30:22',device:'iPad-Air-008',command:'App Installation Block',status:'success',executedBy:'Admin User',result:'App store access blocked'},
  {id:9,timestamp:'2024-01-15 13:15:45',device:'Galaxy-Z-Fold-009',command:'Bluetooth Disable',status:'success',executedBy:'System',result:'Bluetooth disabled on device'},
  {id:10,timestamp:'2024-01-15 13:00:33',device:'iPhone-13-010',command:'USB Debugging Block',status:'success',executedBy:'Admin User',result:'USB debugging disabled'},
];

export default function CyberNestCommands() {
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [activeNav,setActiveNav]=useState('commands');
  const [activeTab,setActiveTab]=useState('audit');
  const [searchTerm,setSearchTerm]=useState('');
  const [statusFilter,setStatusFilter]=useState('all');
  const [globalPolicies,setGlobalPolicies]=useState([
    {id:1,name:'Disable Camera',description:'Prevent device camera access across all devices',Icon:Camera,enabled:false,deviceCount:45,enforced:42,category:'Hardware'},
    {id:2,name:'Block App Installation',description:'Prevent installation of new applications',Icon:Package,enabled:true,deviceCount:50,enforced:48,category:'Application'},
    {id:3,name:'Force Location Tracking',description:'Continuously track device location (requires GPS)',Icon:Navigation,enabled:true,deviceCount:50,enforced:47,category:'Location'},
    {id:4,name:'Disable Bluetooth',description:'Disable Bluetooth connectivity on all devices',Icon:Wifi,enabled:false,deviceCount:50,enforced:0,category:'Connectivity'},
    {id:5,name:'Block USB Debugging',description:'Prevent USB debugging access to devices',Icon:Settings2,enabled:true,deviceCount:50,enforced:50,category:'Security'},
    {id:6,name:'Restrict Downloads',description:'Limit file and app downloads to approved sources',Icon:Download,enabled:false,deviceCount:50,enforced:0,category:'Application'},
  ]);

  const togglePolicy=(id)=>setGlobalPolicies(prev=>prev.map(p=>p.id===id?{...p,enabled:!p.enabled}:p));

  const filteredCommands=commandLog.filter(cmd=>{
    const ms=cmd.device.toLowerCase().includes(searchTerm.toLowerCase())||cmd.command.toLowerCase().includes(searchTerm.toLowerCase());
    const mst=statusFilter==='all'||cmd.status===statusFilter;
    return ms&&mst;
  });

  const navItems=[
    {id:'dashboard',label:'Dashboard',Icon:BarChart3},
    {id:'devices',label:'Devices',Icon:Smartphone},
    {id:'commands',label:'Commands',Icon:AlertTriangle},
    {id:'settings',label:'Settings',Icon:Settings},
  ];

  const StatusBadge=({status})=>{
    const map={success:{Icon:CheckCircle2,color:C.emerald400,label:'Success'},failed:{Icon:XCircle,color:C.red400,label:'Failed'},pending:{Icon:Clock,color:C.yellow400,label:'Pending'}};
    const {Icon,color,label}=map[status]||{};
    if(!Icon) return null;
    return <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><Icon size={16} color={color}/><span style={{fontSize:'0.75rem',fontWeight:500,color}}>{label}</span></div>;
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:C.bg950,color:C.text50,fontFamily:'sans-serif'}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',opacity:0.02,backgroundImage:`linear-gradient(0deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(51,65,85,0.1) 25%,rgba(51,65,85,0.1) 26%,transparent 27%,transparent 74%,rgba(51,65,85,0.1) 75%,rgba(51,65,85,0.1) 76%,transparent 77%)`,backgroundSize:'60px 60px'}} />

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
                <h2 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,margin:0}}>Commands</h2>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.5rem 0.75rem',borderRadius:'0.375rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`}}>
                <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:C.emerald400}}/>
                <span style={{fontSize:'0.75rem',color:C.text300,fontFamily:'monospace'}}>Backend: Online</span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{flex:1,overflow:'auto',padding:'2rem'}}>
            {/* TABS */}
            <div style={{display:'flex',gap:'0.25rem',marginBottom:'1.5rem',backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'0.25rem',width:'fit-content'}}>
              {[{id:'audit',label:'Command Audit Log'},{id:'policies',label:'Enforce Policies'}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{padding:'0.5rem 1rem',borderRadius:'0.375rem',border:'none',backgroundColor:activeTab===tab.id?C.bg700:'transparent',color:activeTab===tab.id?C.text50:C.text400,fontSize:'0.875rem',fontWeight:500,cursor:'pointer'}}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* AUDIT TAB */}
            {activeTab==='audit'&&(
              <div>
                <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
                  <div style={{position:'relative',flex:1,minWidth:200}}>
                    <Search size={16} color={C.text500} style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)'}}/>
                    <input type="text" placeholder="Search device ID or command..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                      style={{width:'100%',paddingLeft:'2.25rem',paddingRight:'0.75rem',paddingTop:'0.625rem',paddingBottom:'0.625rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',color:C.text50,outline:'none',boxSizing:'border-box'}}/>
                  </div>
                  <div style={{position:'relative'}}>
                    <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:'0.625rem 2rem 0.625rem 0.75rem',backgroundColor:C.bg800,border:`1px solid ${C.border700}`,borderRadius:'0.5rem',fontSize:'0.875rem',color:C.text50,outline:'none',cursor:'pointer',appearance:'none'}}>
                      <option value="all">All Status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                    </select>
                    <ChevronDown size={14} color={C.text500} style={{position:'absolute',right:'0.5rem',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  </div>
                </div>

                <div style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',overflow:'hidden'}}>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead>
                        <tr style={{backgroundColor:'rgba(15,23,42,0.5)',borderBottom:`1px solid ${C.border800}`}}>
                          {['Timestamp','Device','Command','Status','Executed By','Result'].map(h=>(
                            <th key={h} style={{padding:'1rem',textAlign:'left',fontSize:'0.75rem',fontWeight:600,color:C.text400,textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCommands.map(cmd=>(
                          <tr key={cmd.id} style={{borderBottom:`1px solid ${C.border800}`}}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor='rgba(30,41,59,0.5)'}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                          >
                            <td style={{padding:'1rem'}}><span style={{fontSize:'0.75rem',fontFamily:'monospace',color:C.text500}}>{cmd.timestamp}</span></td>
                            <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',fontFamily:'monospace',color:C.cyan400}}>{cmd.device}</span></td>
                            <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',fontWeight:500,color:C.text300}}>{cmd.command}</span></td>
                            <td style={{padding:'1rem'}}><StatusBadge status={cmd.status}/></td>
                            <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',color:C.text400}}>{cmd.executedBy}</span></td>
                            <td style={{padding:'1rem'}}><span style={{fontSize:'0.875rem',color:C.text500}}>{cmd.result}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredCommands.length===0&&(
                    <div style={{padding:'2rem',textAlign:'center'}}>
                      <AlertTriangle size={48} color={C.bg700} style={{margin:'0 auto 1rem'}}/>
                      <p style={{color:C.text400,fontWeight:500}}>No commands found</p>
                      <p style={{color:C.text500,fontSize:'0.875rem'}}>Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* POLICIES TAB */}
            {activeTab==='policies'&&(
              <div>
                <h3 style={{fontSize:'1.125rem',fontWeight:600,color:C.text50,marginBottom:'1.5rem'}}>Enforce Policies Across {globalPolicies.length} Devices</h3>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {globalPolicies.map(({id,name,description,Icon,enabled,deviceCount,enforced,category})=>(
                    <div key={id} style={{backgroundColor:C.bg900,border:`1px solid ${C.border800}`,borderRadius:'0.5rem',padding:'1.5rem'}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.border700}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border800}
                    >
                      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem'}}>
                        <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',flex:1}}>
                          <Icon size={24} color={C.cyan400} style={{flexShrink:0,marginTop:2}}/>
                          <div style={{flex:1}}>
                            <h4 style={{fontSize:'0.875rem',fontWeight:600,color:C.text50,margin:'0 0 0.25rem'}}>{name}</h4>
                            <p style={{fontSize:'0.875rem',color:C.text500,margin:'0 0 0.75rem'}}>{description}</p>
                            <div style={{display:'flex',gap:'1.5rem'}}>
                              <div><p style={{fontSize:'0.75rem',color:C.text500,margin:'0 0 0.25rem'}}>Category</p><p style={{fontSize:'0.75rem',fontWeight:500,color:C.text400,margin:0}}>{category}</p></div>
                              <div><p style={{fontSize:'0.75rem',color:C.text500,margin:'0 0 0.25rem'}}>Enrollment</p><p style={{fontSize:'0.75rem',fontWeight:500,color:C.text400,margin:0}}>{enforced}/{deviceCount} devices</p></div>
                            </div>
                          </div>
                        </div>
                        <button onClick={()=>togglePolicy(id)} style={{position:'relative',width:48,height:24,borderRadius:9999,backgroundColor:enabled?C.emerald600:C.bg700,border:'none',cursor:'pointer',flexShrink:0,transition:'background-color 0.2s'}}>
                          <div style={{position:'absolute',top:4,left:enabled?28:4,width:16,height:16,backgroundColor:'#fff',borderRadius:'50%',transition:'left 0.2s'}}/>
                        </button>
                      </div>
                      <div style={{marginTop:'1rem',paddingTop:'1rem',borderTop:`1px solid ${C.border800}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                          <span style={{fontSize:'0.75rem',color:C.text500}}>Enforcement Progress</span>
                          <span style={{fontSize:'0.75rem',fontFamily:'monospace',color:C.text400}}>{Math.round((enforced/deviceCount)*100)}%</span>
                        </div>
                        <div style={{height:8,backgroundColor:C.bg700,borderRadius:9999,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${(enforced/deviceCount)*100}%`,backgroundColor:enabled?C.emerald600:C.bg600,borderRadius:9999,transition:'width 0.3s'}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}