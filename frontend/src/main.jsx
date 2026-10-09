import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  FileText,
  ShoppingCart,
  UsersRound,
  WalletCards,
  UserCog,
  LogOut,
  Pill,
  Plus,
  Search,
  Trash2,
  Printer,
  Bell,
  Settings,
  UserRound,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  TrendingUp,
  Boxes,
  ReceiptText,
  X,
  Menu,
  Palette,
  Building2,
  ShieldCheck,
  Sparkles,
  Activity,
  Send,
  MapPin,
  Siren,
  Sun,
  Moon,
  Camera,
  ImageOff,
} from "lucide-react";
import "./styles.css";
import "./creative.css";
import { LiveStatus, useLive, reportNet, announceChange } from "./live.jsx";
import { LiveValidation } from "./validation.jsx";
// apply saved theme before first paint (login page has no Layout)
document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";
const API = `http://${window.location.hostname}:5000/api`;
async function api(p, o = {}) {
  const t = localStorage.getItem("token");
  let r;
  try {
    r = await fetch(API + p, {
      ...o,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    });
  } catch {
    reportNet(false);
    throw Error(
      "Cannot connect to the backend. Make sure the API is running on port 5000.",
    );
  }
  reportNet(true);
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && p !== "/auth/login") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login")
      window.location.replace("/login");
    throw Error("Session expired. Please sign in again.");
  }
  if (!r.ok) throw Error(d.message || `Request failed (${r.status})`);
  if (o.method && o.method !== "GET") announceChange();
  return d;
}
const AC = createContext(),
  TC = createContext();
const useAuth = () => useContext(AC),
  useToast = () => useContext(TC);
function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  function toast(message, type = "success") {
    const id = Date.now();
    setItems((x) => [...x, { id, message, type }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3000);
  }
  return (
    <TC.Provider value={toast}>
      {children}
      <div className="toasts">
        {items.map((i) => (
          <div className={`toast ${i.type}`} key={i.id}>
            {i.type === "error" ? (
              <AlertTriangle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}
            <span>{i.message}</span>
          </div>
        ))}
      </div>
    </TC.Provider>
  );
}
function AuthProvider({ children }) {
  const [u, setU] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  async function login(email, password) {
    const d = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", d.token);
    localStorage.setItem("user", JSON.stringify(d.user));
    setU(d.user);
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setU(null);
  }
  function syncUser(x) {
    const nu = {
      ...u,
      name: x.full_name,
      email: x.email,
      profileImage: x.profile_image || null,
    };
    localStorage.setItem("user", JSON.stringify(nu));
    setU(nu);
  }
  return (
    <AC.Provider value={{ user: u, login, logout, syncUser }}>
      {children}
    </AC.Provider>
  );
}
const defaultBrand = {
  name: "Health Care",
  sub: "Pharmacy OS",
  tagline: "Smarter pharmacy. Safer dispensing.",
  logo: "HC",
};
function getBrand() {
  return {
    ...defaultBrand,
    ...JSON.parse(localStorage.getItem("brand") || "{}"),
  };
}
function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setE] = useState("manager@healthcare.lk"),
    [password, setP] = useState("password"),
    [busy, setBusy] = useState(false),
    brand = getBrand();
  async function go(e) {
    e.preventDefault();
    if (!email.includes("@")) return toast("Enter a valid email", "error");
    if (!password) return toast("Password is required", "error");
    try {
      setBusy(true);
      await login(email, password);
      toast("Welcome back");
      navigate("/");
    } catch (x) {
      toast(x.message, "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login">
      <section>
        <div className="logo3d">
          <Pill size={34} />
        </div>
        <span className="eyebrow">{brand.name.toUpperCase()}</span>
        <h1>
          {brand.tagline.split(".")[0]}.<br />
          <em>{brand.tagline.split(".")[1] || "Safer dispensing"}.</em>
        </h1>
        <p>
          Inventory, prescriptions, POS billing, purchasing, finance and
          branches in one premium workspace.
        </p>
        <div className="orb">
          <Pill size={64} />
        </div>
        <div className="login-float glass">
          <Sparkles size={20} />
          <b>Role-aware workspace</b>
          <span>Secure access for every pharmacy team.</span>
        </div>
      </section>
      <form className="glass" onSubmit={go} data-login>
        <div className="shield">
          <ShieldCheck />
        </div>
        <span className="eyebrow">SECURE STAFF ACCESS</span>
        <h2>Welcome back</h2>
        <p>Sign in with your assigned account.</p>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setE(e.target.value)}
            type="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setP(e.target.value)}
          />
        </label>
        <button disabled={busy}>
          {busy ? "Signing in..." : "Enter Dashboard"}
        </button>
        <button type="button" className="secondary" onClick={() => navigate("/register")}>
          Create Customer Account
        </button>
        <small>Demo: manager@healthcare.lk / password</small>
      </form>
    </div>
  );
}
function CustomerRegister() {
  const toast = useToast(), navigate = useNavigate();
  const [form, setForm] = useState({}), [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if ((form.password || "").length < 6) return toast("Password must contain at least 6 characters", "error");
    try {
      setBusy(true);
      await api("/auth/customer-register", { method: "POST", body: JSON.stringify(form) });
      toast("Customer account created. You can now sign in.");
      navigate("/login");
    } catch (x) { toast(x.message, "error"); } finally { setBusy(false); }
  }
  return <div className="login customer-register">
    <section><div className="logo3d"><UsersRound size={34}/></div><span className="eyebrow">CUSTOMER PORTAL</span><h1>Your pharmacy visits,<br/><em>in one place.</em></h1><p>Create an account to view your registered purchases, invoices and loyalty points securely.</p></section>
    <form className="glass" onSubmit={submit}><div className="shield"><ShieldCheck/></div><span className="eyebrow">NEW CUSTOMER</span><h2>Create account</h2>
      {[['full_name','Full name','text'],['email','Email','email'],['phone','Phone','tel'],['address','Address','text'],['password','Password','password']].map(([k,l,t])=><label key={k}>{l}<input required={['full_name','email','password'].includes(k)} type={t} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}
      <button disabled={busy}>{busy?'Creating...':'Create Customer Account'}</button><button type="button" className="secondary" onClick={()=>navigate('/login')}>Back to Login</button>
    </form>
  </div>;
}
const nav = [
  [
    "/",
    "Dashboard",
    LayoutDashboard,
    ["MANAGER", "PHARMACIST", "INVENTORY", "FINANCE", "CASHIER", "CUSTOMER"],
  ],
  [
    "/inventory",
    "Inventory",
    PackageSearch,
    ["MANAGER", "PHARMACIST", "INVENTORY", "CASHIER"],
  ],
  [
    "/suppliers",
    "Purchasing & Suppliers",
    Truck,
    ["MANAGER", "INVENTORY", "FINANCE"],
  ],
  ["/prescriptions", "Prescriptions", FileText, ["MANAGER", "PHARMACIST"]],
  ["/pos", "POS & Billing", ShoppingCart, ["MANAGER", "CASHIER", "PHARMACIST"]],
  ["/customers", "Customers", UsersRound, ["MANAGER", "CASHIER", "PHARMACIST"]],
  ["/finance", "Finance & Reports", WalletCards, ["MANAGER", "FINANCE"]],
  ["/users", "Users & Branches", UserCog, ["MANAGER"]],
  ["/operations", "Advanced Operations", Activity, ["MANAGER", "INVENTORY", "FINANCE", "PHARMACIST", "CASHIER"]],
  [
    "/settings",
    "Profile & Settings",
    Settings,
    ["MANAGER", "PHARMACIST", "INVENTORY", "FINANCE", "CASHIER", "CUSTOMER"],
  ],
];
function Layout({ children }) {
  const { user, logout } = useAuth(),
    [notes, setNotes] = useState([]),
    [noteOpen, setNoteOpen] = useState(false),
    [mobile, setMobile] = useState(false),
    [theme, setTheme] = useState(
      () => localStorage.getItem("theme") || "light",
    ),
    brand = getBrand(),
    loc = useLocation();
  const noteCount = useRef(null),
    liveToast = useToast();
  useLive(
    async () => {
      if (user.role === "CUSTOMER") return setNotes([]);
      const n = await api("/notifications");
      if (noteCount.current !== null && n.length > noteCount.current)
        liveToast(
          `${n.length - noteCount.current} new alert${n.length - noteCount.current > 1 ? "s" : ""}: ${n[0]?.title || n[0]?.message || "check notifications"}`,
          "error",
        );
      noteCount.current = n.length;
      setNotes(n);
    },
    [loc.pathname, user.role],
    15000,
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <div className="shell">
      <aside className={mobile ? "mobile-open" : ""}>
        <div className="brand">
          <div className="brandmark">{brand.logo}</div>
          <b>{brand.name}</b>
          <span>{brand.sub}</span>
        </div>
        <nav>
          {nav
            .filter((x) => x[3].includes(user.role))
            .map(([to, l, I]) => (
              <NavLink
                to={to}
                key={to}
                onClick={() => setMobile(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <I size={18} />
                {l}
              </NavLink>
            ))}
        </nav>
        <div className="role-chip">
          <ShieldCheck size={14} />
          {user.role}
        </div>
        <div className="profile">
          <div className="mini-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              user.name?.[0]
            )}
          </div>
          <div>
            {user.name}
            <small>{user.email}</small>
          </div>
          <button onClick={logout} title="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <main>
        <header>
          <button className="mobile-menu" onClick={() => setMobile(!mobile)}>
            {mobile ? <X /> : <Menu />}
          </button>
          <div>
            <span className="eyebrow">CENTRALIZED OPERATIONS</span>
            <h3>Good day, {user.name.split(" ")[0]}</h3>
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {user.role !== "CUSTOMER" && <button className="bell" onClick={() => setNoteOpen(!noteOpen)}>
              <Bell size={19} />
              {notes.length > 0 && <span>{notes.length}</span>}
            </button>}
            <LiveStatus />
          </div>
          {noteOpen && (
            <div className="notification-panel glass">
              <div className="notif-head">
                <b>Notifications</b>
                <span>{notes.length} alerts</span>
              </div>
              {notes.length ? (
                notes.map((n, i) => (
                  <div className="notification" key={i}>
                    {n.type === "LOW_STOCK" ? (
                      <AlertTriangle />
                    ) : n.type === "EXPIRY" ? (
                      <Clock3 />
                    ) : (
                      <Truck />
                    )}
                    <div>
                      <b>{n.title}</b>
                      <span>{n.text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty">Everything looks good.</p>
              )}
            </div>
          )}
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
function Head({ tag, title, text, button }) {
  return (
    <div className="head">
      <div>
        <span className="eyebrow">{tag}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {button}
    </div>
  );
}
const roleCopy = {
  MANAGER: [
    "Management command center",
    "Monitor every module, financial health and operational risk.",
  ],
  PHARMACIST: [
    "Dispensing command center",
    "Prioritize prescription safety, medicine availability and expiry risk.",
  ],
  INVENTORY: [
    "Inventory command center",
    "Track stock health, reorder needs, batches and incoming purchases.",
  ],
  FINANCE: [
    "Finance command center",
    "Follow revenue, transactions and purchasing commitments.",
  ],
  CASHIER: [
    "Sales command center",
    "Serve customers quickly with live stock and streamlined billing.",
  ],
  CUSTOMER: [
    "My pharmacy account",
    "View your purchases, invoices and loyalty rewards.",
  ],
};
function CustomerPortal() {
  const [data, setData] = useState(null), [invoice, setInvoice] = useState(null), toast = useToast();
  useLive(() => api("/customer/dashboard").then(setData).catch(() => {}));
  async function openInvoice(id) { try { setInvoice(await api(`/customer/invoices/${id}`)); } catch (x) { toast(x.message, "error"); } }
  if (!data) return <p>Loading your account...</p>;
  return <>
    <Head tag="CUSTOMER PORTAL" title={`Welcome, ${data.profile.full_name}`} text="Your registered purchases, invoices and loyalty rewards are available here." />
    <div className="customer-summary">
      <div className="glass customer-card"><ReceiptText/><span>Purchases</span><b>{data.purchaseCount}</b></div>
      <div className="glass customer-card"><WalletCards/><span>Total spent</span><b>LKR {Number(data.totalSpent).toFixed(2)}</b></div>
      <div className="glass customer-card"><Sparkles/><span>Loyalty points</span><b>{data.profile.loyalty_points}</b></div>
    </div>
    <section className="glass table-card"><div className="section-title"><div><span className="eyebrow">MY RECORDS</span><h2>Purchase History</h2></div></div>
      <table><thead><tr><th>Invoice</th><th>Date</th><th>Branch</th><th>Payment</th><th>Total</th><th></th></tr></thead>
      <tbody>{data.sales.length ? data.sales.map(s => <tr key={s.id}><td><b>{s.invoice_no}</b></td><td>{new Date(s.created_at).toLocaleString()}</td><td>{s.branch}</td><td><span className="badge">{s.payment_method}</span></td><td>LKR {Number(s.grand_total).toFixed(2)}</td><td><button className="secondary small" onClick={()=>openInvoice(s.id)}>View Bill</button></td></tr>) : <tr><td colSpan="6" className="empty">No registered purchases yet.</td></tr>}</tbody></table>
    </section>
    <CustomerServices />
    {invoice && <Invoice invoice={invoice} close={()=>setInvoice(null)}/>} 
  </>;
}
function CustomerServices(){
  const [complaints,setComplaints]=useState([]),[reminders,setReminders]=useState([]),[form,setForm]=useState({}),toast=useToast();
  function load(){Promise.all([api('/customer/complaints').then(setComplaints),api('/customer/reminders').then(setReminders)]).catch(x=>toast(x.message,'error'));}
  useLive(load);
  async function submit(e){e.preventDefault();try{await api('/customer/complaints',{method:'POST',body:JSON.stringify(form)});setForm({});toast('Complaint submitted');load();}catch(x){toast(x.message,'error')}}
  return <div className="two customer-services"><form className="glass form" onSubmit={submit}><h2>Submit a Complaint</h2><label>Subject<input required value={form.subject||''} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>Details<textarea required value={form.details||''} onChange={e=>setForm({...form,details:e.target.value})}/></label><button>Submit</button></form><section className="glass table-card"><h2>Reminders & Complaint Status</h2>{reminders.map(x=><p className="notice-row" key={'r'+x.id}><b>{x.type}</b> {x.message} <span>{x.due_date||''}</span></p>)}{complaints.map(x=><p className="notice-row" key={'c'+x.id}><b>{x.subject}</b> {x.status}</p>)}{!reminders.length&&!complaints.length&&<p className="empty">No reminders or complaints yet.</p>}</section></div>
}

function AdvancedOperations(){
  const {user}=useAuth(),toast=useToast(),[data,setData]=useState(null),[reports,setReports]=useState(null),[refs,setRefs]=useState({medicines:[],suppliers:[],branches:[],users:[],customers:[]}),[transfer,setTransfer]=useState({}),[quote,setQuote]=useState({}),[shift,setShift]=useState({}),[reminder,setReminder]=useState({type:'REFILL'});
  function load(){api('/advanced/overview').then(setData).catch(x=>toast(x.message,'error'));if(['MANAGER','FINANCE'].includes(user.role))api('/reports/complete').then(setReports).catch(()=>{});}
  useEffect(()=>{load();const calls=[['medicines','/medicines'],['suppliers','/suppliers'],['branches','/branches'],['customers','/customers']];if(user.role==='MANAGER')calls.push(['users','/users']);Promise.all(calls.map(([k,p])=>api(p).then(v=>[k,v]).catch(()=>[k,[]]))).then(rows=>setRefs(Object.fromEntries(rows)));},[]);
  async function send(path,body,method='POST'){try{await api(path,{method,body:JSON.stringify(body)});toast('Saved successfully');load();}catch(x){toast(x.message,'error')}}
  if(!data)return <p>Loading operations...</p>;
  const options=(rows,label)=>(rows||[]).map(x=><option key={x.id} value={x.id}>{x[label]}</option>);
  return <><Head tag="COMPLETE OPERATIONS" title="Extended Pharmacy Management" text="Stock transfers, supplier comparison, complaints, staff schedules, reminders and full reports."/>
  <div className="ops-grid">
   {['MANAGER','INVENTORY'].includes(user.role)&&<form className="glass form" onSubmit={e=>{e.preventDefault();send('/stock-transfers',transfer)}}><h2>Branch Stock Transfer</h2><label>Medicine<select required onChange={e=>setTransfer({...transfer,medicine_id:e.target.value})}><option value="">Select</option>{options(refs.medicines,'name')}</select></label><label>From branch<select required onChange={e=>setTransfer({...transfer,from_branch_id:e.target.value})}><option value="">Select</option>{options(refs.branches,'name')}</select></label><label>To branch<select required onChange={e=>setTransfer({...transfer,to_branch_id:e.target.value})}><option value="">Select</option>{options(refs.branches,'name')}</select></label><label>Quantity<input required min="1" type="number" onChange={e=>setTransfer({...transfer,quantity:e.target.value})}/></label><button>Create Transfer</button></form>}
   {['MANAGER','INVENTORY','FINANCE'].includes(user.role)&&<form className="glass form" onSubmit={e=>{e.preventDefault();send('/supplier-quotes',quote)}}><h2>Supplier Price Comparison</h2><label>Supplier<select required onChange={e=>setQuote({...quote,supplier_id:e.target.value})}><option value="">Select</option>{options(refs.suppliers,'name')}</select></label><label>Medicine<select required onChange={e=>setQuote({...quote,medicine_id:e.target.value})}><option value="">Select</option>{options(refs.medicines,'name')}</select></label><label>Unit price<input required type="number" step="0.01" onChange={e=>setQuote({...quote,unit_price:e.target.value})}/></label><label>Lead days<input type="number" onChange={e=>setQuote({...quote,lead_days:e.target.value})}/></label><button>Save Supplier Price</button></form>}
   {user.role==='MANAGER'&&<form className="glass form" onSubmit={e=>{e.preventDefault();send('/staff-schedules',shift)}}><h2>Staff Schedule</h2><label>Staff<select required onChange={e=>setShift({...shift,user_id:e.target.value})}><option value="">Select</option>{options(refs.users,'full_name')}</select></label><label>Branch<select required onChange={e=>setShift({...shift,branch_id:e.target.value})}><option value="">Select</option>{options(refs.branches,'name')}</select></label><label>Date<input required type="date" onChange={e=>setShift({...shift,shift_date:e.target.value})}/></label><div className="two"><label>Start<input required type="time" onChange={e=>setShift({...shift,start_time:e.target.value})}/></label><label>End<input required type="time" onChange={e=>setShift({...shift,end_time:e.target.value})}/></label></div><button>Add Shift</button></form>}
   {['MANAGER','PHARMACIST','CASHIER'].includes(user.role)&&<form className="glass form" onSubmit={e=>{e.preventDefault();send('/reminders',reminder)}}><h2>Customer Reminder</h2><label>Customer<select required onChange={e=>setReminder({...reminder,customer_id:e.target.value})}><option value="">Select</option>{options(refs.customers,'full_name')}</select></label><label>Type<select value={reminder.type} onChange={e=>setReminder({...reminder,type:e.target.value})}><option>REFILL</option><option>LOYALTY</option><option>PAYMENT</option><option>GENERAL</option></select></label><label>Message<input required onChange={e=>setReminder({...reminder,message:e.target.value})}/></label><label>Due date<input type="date" onChange={e=>setReminder({...reminder,due_date:e.target.value})}/></label><button>Create Reminder</button></form>}
  </div>
  <section className="glass table-card"><h2>Stock Transfers</h2><table><thead><tr><th>Medicine</th><th>From</th><th>To</th><th>Qty</th><th>Status</th><th></th></tr></thead><tbody>{data.transfers.map(x=><tr key={x.id}><td>{x.medicine}</td><td>{x.from_branch}</td><td>{x.to_branch}</td><td>{x.quantity}</td><td><span className="badge">{x.status}</span></td><td>{x.status==='PENDING'&&['MANAGER','INVENTORY'].includes(user.role)&&<><button className="small" onClick={()=>send(`/stock-transfers/${x.id}/status`,{status:'COMPLETED'},'PUT')}>Complete</button><button className="danger small" onClick={()=>send(`/stock-transfers/${x.id}/status`,{status:'CANCELLED'},'PUT')}>Cancel</button></>}</td></tr>)}</tbody></table></section>
  <div className="two"><section className="glass table-card"><h2>Supplier Prices</h2>{data.quotes.map(x=><p className="notice-row" key={x.id}><b>{x.medicine}</b>{x.supplier}<span>LKR {Number(x.unit_price).toFixed(2)} · {x.lead_days} days</span></p>)}</section><section className="glass table-card"><h2>Complaint Management</h2>{data.complaints.map(x=><p className="notice-row" key={x.id}><b>{x.customer}: {x.subject}</b><span>{x.status}</span>{['MANAGER','CASHIER'].includes(user.role)&&x.status!=='RESOLVED'&&<button className="small" onClick={()=>send(`/complaints/${x.id}/status`,{status:'RESOLVED'},'PUT')}>Resolve</button>}</p>)}</section></div>
  {reports&&<CompleteReports reports={reports}/>}</>;
}
function CompleteReports({reports}){function csv(){const rows=[['Period','Revenue','Transactions'],...reports.monthly.map(x=>[x.period,x.revenue,x.transactions])];const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));a.download='pharmacy-monthly-report.csv';a.click();}return <section className="glass table-card"><div className="section-title"><h2>Complete Financial Reports</h2><button onClick={csv}>Export CSV</button></div><div className="report-columns"><div><h3>Monthly Sales</h3>{reports.monthly.map((x,i)=><p key={i}>{x.period}: <b>LKR {Number(x.revenue).toFixed(2)}</b></p>)}</div><div><h3>Inventory Value</h3>{reports.inventoryValue.map((x,i)=><p key={i}>{x.branch}: <b>LKR {Number(x.inventory_value||0).toFixed(2)}</b></p>)}</div><div><h3>Supplier Balances</h3>{reports.supplierBalances.map((x,i)=><p key={i}>{x.name}: <b>LKR {Number(x.outstanding||0).toFixed(2)}</b></p>)}</div><div><h3>Medicine Movement</h3>{reports.movement.map((x,i)=><p key={i}>{x.name}: <b>{x.movement} ({x.units})</b></p>)}</div></div></section>}
function MiniChart({ data = [] }) {
  const max = Math.max(...data.map((x) => Number(x.revenue)), 1);
  return (
    <div className="chartbars">
      {data.map((x, i) => (
        <div className="chartcol" key={i}>
          <div className="chartvalue">
            {Number(x.revenue) > 0
              ? Math.round(Number(x.revenue) / 1000) + "k"
              : ""}
          </div>
          <div
            className="chartbar"
            style={{
              height: `${Math.max(8, (Number(x.revenue) / max) * 145)}px`,
            }}
          ></div>
          <small>
            {new Date(x.day).toLocaleDateString("en", { weekday: "short" })}
          </small>
        </div>
      ))}
    </div>
  );
}
function Dashboard() {
  const { user } = useAuth();
  const [d, setD] = useState(null),
    [trend, setTrend] = useState([]),
    [recent, setRecent] = useState([]),
    [creative, setCreative] = useState(null),
    [alerts, setAlerts] = useState([]),
    [stock, setStock] = useState([]),
    [q, setQ] = useState("");
  useLive(() =>
    Promise.all([
      api("/dashboard").then(setD),
      api("/dashboard/trend").then(setTrend),
      api("/dashboard/recent-sales").then(setRecent),
      api("/dashboard/creative").then(setCreative),
      api("/stock-alerts").then(setAlerts),
      api("/stock").then(setStock),
    ]),
  );
  const low = stock.filter(
      (x) =>
        Number(x.quantity) > 0 && Number(x.quantity) <= Number(x.reorder_level),
    ),
    out = stock.filter((x) => Number(x.quantity) <= 0);
  const categories = useMemo(() => {
    const x = {};
    stock.forEach((i) => {
      const k = i.category || "Other";
      x[k] = (x[k] || 0) + Number(i.quantity || 0);
    });
    return Object.entries(x)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [stock]);
  const filtered = stock.filter((x) =>
    (x.name + x.generic_name + x.category + x.barcode)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  const topCards = [
    ["Total Products", d?.medicines || stock.length, Boxes, "blue"],
    ["Low Stock Items", low.length, AlertTriangle, "yellow"],
    ["Out of Stock", out.length, X, "red"],
    [
      "Today Sales",
      `Rs. ${Number(d?.todaySales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      TrendingUp,
      "purple",
    ],
  ];
  return (
    <>
      <section className="dash-title glass">
        <div>
          <span className="eyebrow">{user.role} WORKSPACE</span>
          <h1>Pharmacy Dashboard</h1>
          <p>
            Monitor products, stock health, sales, branches and alerts from one
            place.
          </p>
        </div>
        <div className="dash-actions">
          <button
            className="primary"
            onClick={() => (window.location.href = "/inventory")}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </section>
      <section className="ref-report">
        <Head
          tag="REPORTS"
          title="Pharmacy overview"
          text="Live statistics from your pharmacy management system."
        />
        <div className="ref-stat-grid">
          {topCards.map(([t, v, I, c]) => (
            <div className={`ref-stat ${c}`} key={t}>
              <div className="ref-stat-icon">
                <I size={21} />
              </div>
              <div>
                <span>{t}</span>
                <strong>{v}</strong>
                <small>Live system data</small>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="ref-category-grid">
        {categories.map(([name, total], i) => (
          <div className={`ref-cat cat-${i % 8}`} key={name}>
            <div className="ref-cat-top">
              <span>{name}</span>
              <MoreDot />
            </div>
            <strong>{total}</strong>
            <small>units in stock</small>
          </div>
        ))}
      </div>
      <div className="ref-dashboard-grid">
        <section className="panel glass">
          <Head
            tag="PURCHASES & SALES"
            title="Sales trend"
            text="Recent revenue in Sri Lankan Rupees."
          />
          <MiniChart data={trend} />
        </section>
        <section className="panel glass">
          <Head
            tag="STOCK STATUS"
            title="Low-stock alerts"
            text="Items requiring attention."
          />
          <div className="compact-alerts">
            {alerts.slice(0, 5).map((a) => (
              <div
                className="compact-alert"
                key={`${a.branch_id}-${a.medicine_id}`}
              >
                <div>
                  <b>{a.medicine}</b>
                  <span>{a.branch}</span>
                </div>
                <strong>{a.quantity} left</strong>
              </div>
            ))}
            {!alerts.length && <p className="empty">No active stock alerts.</p>}
          </div>
        </section>
      </div>
      <section className="ref-product-panel glass">
        <div className="ref-product-toolbar">
          <div>
            <span className="eyebrow">PRODUCT LIST</span>
            <h2>Medicine Stock</h2>
          </div>
          <SearchBox
            q={q}
            setQ={setQ}
            placeholder="Search product, generic, category or barcode..."
          />
          <button
            className="primary"
            onClick={() => (window.location.href = "/inventory")}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((r) => {
                const qty = Number(r.quantity || 0),
                  status =
                    qty <= 0
                      ? "Out of stock"
                      : qty <= Number(r.reorder_level)
                        ? "Low stock"
                        : "In stock";
                return (
                  <tr key={r.id}>
                    <td>#{String(r.id).padStart(3, "0")}</td>
                    <td>
                      <b>{r.name}</b>
                      <small className="cell-sub">{r.generic_name}</small>
                    </td>
                    <td>{qty} Units</td>
                    <td>
                      Rs.{" "}
                      {Number(r.unit_price || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      {r.nearest_expiry
                        ? String(r.nearest_expiry).slice(0, 10)
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${status === "In stock" ? "instock" : status === "Low stock" ? "lowstock" : "outstock"}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && <p className="empty">No products found.</p>}
        </div>
      </section>
      <div className="ref-dashboard-grid bottom">
        <section className="panel glass">
          <Head
            tag="TODAY'S SALES"
            title="Latest transactions"
            text="Recent completed bills."
          />
          <div className="recent">
            {recent.slice(0, 6).map((x) => (
              <div className="recent-row" key={x.id}>
                <div>
                  <b>{x.invoice_no}</b>
                  <span>{x.customer}</span>
                </div>
                <span className="badge">{x.payment_method}</span>
                <strong>Rs. {Number(x.grand_total).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel glass">
          <Head
            tag="BRANCH HEALTH"
            title="Pharmacy network"
            text="Current branch stock health."
          />
          <div className="branch-health">
            {creative?.branchHealth?.map((x) => (
              <div className="branch-health-row" key={x.id}>
                <div className="branch-dot">
                  <MapPin size={15} />
                </div>
                <div>
                  <b>{x.name}</b>
                  <span>{x.stock} stock units</span>
                </div>
                <strong
                  className={Number(x.low_items) > 0 ? "risk" : "healthy"}
                >
                  {x.low_items} low
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function MoreDot() {
  return <span className="more-dot">•••</span>;
}
const defs = {
  medicines: {
    title: "Medicine Master",
    tag: "INVENTORY CRUD",
    path: "/medicines",
    fields: [
      "name",
      "generic_name",
      "category",
      "barcode",
      "unit_price",
      "reorder_level",
    ],
    required: ["name", "unit_price", "reorder_level"],
  },
  supplier_payments: {
    title: "Supplier Payments CRUD",
    tag: "FINANCE CRUD",
    path: "/supplier_payments",
    fields: ["supplier_id", "amount", "payment_date", "method", "note"],
    required: ["supplier_id", "amount", "payment_date"],
  },
  invoices: {
    title: "Invoice Management",
    tag: "INVOICE CRUD",
    path: "/invoices",
    fields: ["saleId", "medicineName", "quantity", "totalAmount", "date"],
    required: ["saleId", "medicineName", "quantity", "totalAmount"],
  },
  stock_batches: {
    title: "Stock Batch Management",
    tag: "STOCK CRUD",
    path: "/stock-batches",
    fields: ["medicine_id", "branch_id", "batch_no", "quantity", "purchase_price", "expiry_date"],
    required: ["medicine_id", "branch_id", "batch_no", "quantity", "purchase_price", "expiry_date"],
  },
  customers: {
    title: "Customers & Loyalty",
    tag: "MODULE 04",
    path: "/customers",
    fields: ["full_name", "phone", "email", "address", "loyalty_points"],
    required: ["full_name", "phone"],
  },
  suppliers: {
    title: "Supplier Directory",
    tag: "SUPPLIERS",
    path: "/suppliers",
    fields: ["name", "contact_person", "phone", "email", "address"],
    required: ["name", "phone"],
  },
};
function Crud({ type }) {
  const d = defs[type],
    toast = useToast(),
    [rows, setRows] = useState([]),
    [show, setShow] = useState(false),
    [edit, setEdit] = useState(null),
    [form, setForm] = useState({}),
    [q, setQ] = useState("");
  const load = () => api(d.path).then(setRows);
  useLive(load, [type]);
  function open(r) {
    setEdit(r?.id || null);
    setForm(r ? { ...r } : {});
    setShow(true);
  }
  async function save(e) {
    e.preventDefault();
    if (!form[d.fields[0]])
      return toast(`${d.fields[0].replaceAll("_", " ")} is required`, `error`);
    try {
      await api(d.path + (edit ? `/${edit}` : ""), {
        method: edit ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      toast(edit ? "Record updated" : "Record created");
      setShow(false);
      load();
    } catch (x) {
      toast(x.message, "error");
    }
  }
  const filtered = rows.filter((r) =>
    d.fields.some((f) =>
      String(r[f] ?? "")
        .toLowerCase()
        .includes(q.toLowerCase()),
    ),
  );
  return (
    <>
      <Head
        tag={d.tag}
        title={d.title}
        text="Secure searchable records with inline validation."
        button={
          <button className="primary" onClick={() => open()}>
            <Plus size={16} />
            Add record
          </button>
        }
      />
      {show && (
        <form className="form glass" onSubmit={save}>
          {d.fields.map((f) => (
            <label key={f}>
              {f.replaceAll("_", " ")}
              <input
                type={/date/i.test(f) ? "date" : /email/i.test(f) ? "email" : /phone/i.test(f) ? "tel" : "text"}
                inputMode={/price|amount|quantity|level|points|total/i.test(f) ? "decimal" : undefined}
                required={d.required?.includes(f)}
                maxLength={/date/i.test(f) ? undefined : f === "address" || f === "note" ? 255 : 100}
                value={/date/i.test(f) ? String(form[f] ?? "").slice(0, 10) : (form[f] ?? "")}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            </label>
          ))}
          <div>
            <button className="primary">
              {edit ? "Save changes" : "Create record"}
            </button>
            <button type="button" onClick={() => setShow(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <SearchBox
        q={q}
        setQ={setQ}
        placeholder={`Search ${d.title.toLowerCase()}...`}
      />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              {d.fields.map((f) => (
                <th key={f}>{f.replaceAll("_", " ")}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                {d.fields.map((f) => (
                  <td key={f}>{String(r[f] ?? "—")}</td>
                ))}
                <td>
                  <button onClick={() => open(r)}>Edit</button>{" "}
                  <button
                    className="danger-btn"
                    onClick={async () => {
                      if (confirm("Delete this record?")) {
                        try {
                          await api(`${d.path}/${r.id}`, { method: "DELETE" });
                          toast("Record deleted");
                          load();
                        } catch (x) {
                          toast(x.message, "error");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="empty">No matching records.</p>}
      </div>
    </>
  );
}
function SearchBox({ q, setQ, placeholder }) {
  return (
    <div className="search">
      <Search size={17} />
      <input
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q && (
        <button onClick={() => setQ("")}>
          <X size={15} />
        </button>
      )}
    </div>
  );
}
function Inventory() {
  const [rows, setRows] = useState([]),
    [q, setQ] = useState("");
  useLive(() => api("/stock").then(setRows));
  const f = rows.filter((x) =>
    (x.name + x.generic_name + x.category + x.barcode)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <Head
        tag="MODULE 01"
        title="Inventory & Stock Control"
        text="Search live stock, reorder status and nearest expiry dates."
      />
      <SearchBox
        q={q}
        setQ={setQ}
        placeholder="Search medicine, generic, category or barcode..."
      />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Generic</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Nearest expiry</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {f.map((r) => (
              <tr key={r.id}>
                <td>
                  <b>{r.name}</b>
                </td>
                <td>{r.generic_name}</td>
                <td>{r.category}</td>
                <td>LKR {Number(r.unit_price).toFixed(2)}</td>
                <td>{r.quantity}</td>
                <td>{r.nearest_expiry?.slice(0, 10) || "—"}</td>
                <td>
                  <span
                    className={
                      Number(r.quantity) <= Number(r.reorder_level)
                        ? "badge bad"
                        : "badge"
                    }
                  >
                    {Number(r.quantity) <= Number(r.reorder_level)
                      ? "LOW STOCK"
                      : "HEALTHY"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="subsection">
        <Crud type="medicines" />
      </div>
      <div className="subsection">
        <Crud type="stock_batches" />
      </div>
    </>
  );
}
function StockAlertCenter() {
  const toast = useToast(),
    [rows, setRows] = useState([]),
    [q, setQ] = useState("");
  const load = () => api("/stock-alerts").then(setRows);
  useLive(load);
  function openUserEditor(x) {
    setEditUser(x.id);
    setForm({
      full_name: x.full_name,
      email: x.email,
      role: x.role,
      branch_id: x.branch_id || "",
    });
    setTimeout(
      () =>
        document
          .getElementById("staff-editor")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      0,
    );
  }
  function openBranchEditor(x) {
    setEditBranch(x.id);
    setBranch({
      name: x.name,
      address: x.address || "",
      phone: x.phone || "",
    });
    setTimeout(
      () =>
        document
          .getElementById("branch-editor")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      0,
    );
  }
  const f = rows.filter((x) =>
    (x.branch + x.medicine + (x.suppliers || "") + x.severity)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <section className="subsection">
      <Head
        tag="AUTOMATED REORDER WATCH"
        title="Multi-branch stock alert center"
        text="Every pharmacy branch is checked against each medicine reorder level. Critical items can be escalated to management and linked suppliers."
      />
      <SearchBox
        q={q}
        setQ={setQ}
        placeholder="Search branch, medicine, supplier or severity..."
      />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Pharmacy</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Reorder level</th>
              <th>Linked supplier</th>
              <th>Alert</th>
            </tr>
          </thead>
          <tbody>
            {f.map((x) => (
              <tr key={`${x.branch_id}-${x.medicine_id}`}>
                <td>
                  <span
                    className={`badge ${x.severity === "CRITICAL" ? "danger" : "warn"}`}
                  >
                    {x.severity}
                  </span>
                </td>
                <td>{x.branch}</td>
                <td>
                  <b>{x.medicine}</b>
                </td>
                <td>{x.quantity}</td>
                <td>{x.reorder_level}</td>
                <td>{x.suppliers || "Not linked yet"}</td>
                <td>
                  <button
                    className="primary"
                    onClick={async () => {
                      try {
                        const r = await api(
                          `/stock-alerts/${x.branch_id}/${x.medicine_id}/notify`,
                          { method: "POST" },
                        );
                        toast(r.message);
                      } catch (e) {
                        toast(e.message, "error");
                      }
                    }}
                  >
                    <Send size={15} /> Send Alert
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!f.length && (
          <p className="empty">
            No low-stock alerts. All branches are above reorder levels.
          </p>
        )}
      </div>
      <p className="alert-note">
        <Bell size={15} /> Alerts are recorded inside the management system.
        Supplier names/emails are resolved from previous purchase orders for
        that medicine.
      </p>
    </section>
  );
}

function Purchasing() {
  const toast = useToast(),
    [sup, setSup] = useState([]),
    [med, setMed] = useState([]),
    [orders, setOrders] = useState([]),
    [supplier, setSupplier] = useState(""),
    [items, setItems] = useState([
      { medicine_id: "", quantity: 1, unit_cost: 0 },
    ]),
    [q, setQ] = useState("");
  const load = () =>
    Promise.all([
      api("/suppliers").then(setSup),
      api("/medicines").then(setMed),
      api("/purchase-orders").then(setOrders),
    ]);
  useLive(load);
  async function create(e) {
    e.preventDefault();
    if (
      !supplier ||
      items.some((i) => !i.medicine_id || Number(i.quantity) <= 0)
    )
      return toast("Select supplier and valid medicine quantities", "error");
    try {
      await api("/purchase-orders", {
        method: "POST",
        body: JSON.stringify({ supplier_id: supplier, items }),
      });
      toast("Purchase order created");
      setItems([{ medicine_id: "", quantity: 1, unit_cost: 0 }]);
      load();
    } catch (x) {
      toast(x.message, "error");
    }
  }
  const filtered = orders.filter((o) =>
    (o.po_no + o.supplier + o.status).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Head
        tag="MODULE 02"
        title="Purchasing & Suppliers"
        text="Create purchase orders, receive stock and act on automatic low-stock alerts."
      />
      <StockAlertCenter />
      <form className="form glass" onSubmit={create}>
        <label>
          Supplier
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select supplier</option>
            {sup.map((x) => (
              <option value={x.id} key={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        {items.map((it, n) => (
          <div className="poitem" key={n}>
            <select
              value={it.medicine_id}
              onChange={(e) =>
                setItems((a) =>
                  a.map((x, i) =>
                    i === n ? { ...x, medicine_id: e.target.value } : x,
                  ),
                )
              }
            >
              <option value="">Medicine</option>
              {med.map((x) => (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={it.quantity}
              onChange={(e) =>
                setItems((a) =>
                  a.map((x, i) =>
                    i === n ? { ...x, quantity: e.target.value } : x,
                  ),
                )
              }
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Unit cost"
              value={it.unit_cost}
              onChange={(e) =>
                setItems((a) =>
                  a.map((x, i) =>
                    i === n ? { ...x, unit_cost: e.target.value } : x,
                  ),
                )
              }
            />
            <button
              type="button"
              className="iconbtn"
              onClick={() => setItems(items.filter((_, i) => i !== n))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={() =>
              setItems([
                ...items,
                { medicine_id: "", quantity: 1, unit_cost: 0 },
              ])
            }
          >
            + Medicine
          </button>
          <button className="primary">Create PO</button>
        </div>
      </form>
      <SearchBox q={q} setQ={setQ} placeholder="Search purchase orders..." />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              <th>PO</th>
              <th>Supplier</th>
              <th>Branch</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>{o.po_no}</b>
                </td>
                <td>{o.supplier}</td>
                <td>{o.branch}</td>
                <td>LKR {Number(o.total_amount).toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${o.status === "PENDING" ? "warn" : ""}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.status === "PENDING" && (
                    <button
                      className="primary"
                      onClick={async () => {
                        try {
                          await api(`/purchase-orders/${o.id}/receive`, {
                            method: "POST",
                          });
                          toast("Stock received successfully");
                          load();
                        } catch (x) {
                          toast(x.message, "error");
                        }
                      }}
                    >
                      Receive Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="subsection">
        <Crud type="suppliers" />
      </div>
    </>
  );
}
function PrescriptionDesk() {
  const toast = useToast(),
    [rows, setRows] = useState([]),
    [customers, setCustomers] = useState([]),
    [med, setMed] = useState([]),
    [form, setForm] = useState({ status: "PENDING" }),
    [selected, setSelected] = useState(null),
    [item, setItem] = useState({ quantity: 1 }),
    [q, setQ] = useState("");
  const load = () =>
    Promise.all([
      api("/prescriptions").then(setRows),
      api("/customers").then(setCustomers),
      api("/medicines").then(setMed),
    ]);
  useLive(load);
  async function addRx(e) {
    e.preventDefault();
    if (!form.customer_id) return toast("Select a customer", "error");
    try {
      await api("/prescriptions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast("Prescription created");
      setForm({ status: "PENDING" });
      load();
    } catch (x) {
      toast(x.message, "error");
    }
  }
  const f = rows.filter((r) =>
    (
      String(r.id) +
      r.doctor_name +
      r.status +
      (customers.find((c) => c.id === r.customer_id)?.full_name || "")
    )
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <Head
        tag="MODULE 03"
        title="Prescription & Dispensing"
        text="Create prescriptions, add medicine instructions and dispense with automatic stock deduction."
      />
      <form className="form glass" onSubmit={addRx}>
        <label>
          Customer
          <select
            value={form.customer_id || ""}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          >
            <option value="">Select customer</option>
            {customers.map((x) => (
              <option value={x.id} key={x.id}>
                {x.full_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Doctor
          <input
            value={form.doctor_name || ""}
            onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
          />
        </label>
        <label>
          Notes
          <input
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>
        <button className="primary">Create Prescription</button>
      </form>
      <SearchBox q={q} setQ={setQ} placeholder="Search prescriptions..." />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {f.map((r) => (
              <tr key={r.id}>
                <td>RX-{r.id}</td>
                <td>
                  {customers.find((c) => c.id === r.customer_id)?.full_name ||
                    r.customer_id}
                </td>
                <td>{r.doctor_name || "—"}</td>
                <td>
                  <span className="badge">{r.status}</span>
                </td>
                <td>
                  <button onClick={() => setSelected(r)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="modal">
          <div className="dialog glass">
            <button className="dialog-x" onClick={() => setSelected(null)}>
              <X />
            </button>
            <span className="eyebrow">RX-{selected.id}</span>
            <h2>Dispensing workspace</h2>
            <p>Add medicine instructions, then dispense when ready.</p>
            <label>
              Medicine
              <select
                onChange={(e) =>
                  setItem({ ...item, medicine_id: e.target.value })
                }
              >
                <option>Select medicine</option>
                {med.map((m) => (
                  <option value={m.id} key={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="dialog-grid">
              <label>
                Dosage
                <input
                  onChange={(e) => setItem({ ...item, dosage: e.target.value })}
                />
              </label>
              <label>
                Frequency
                <input
                  onChange={(e) =>
                    setItem({ ...item, frequency: e.target.value })
                  }
                />
              </label>
              <label>
                Duration
                <input
                  onChange={(e) =>
                    setItem({ ...item, duration: e.target.value })
                  }
                />
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    setItem({ ...item, quantity: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="dialog-actions">
              <button
                onClick={async () => {
                  try {
                    await api(`/prescriptions/${selected.id}/items`, {
                      method: "POST",
                      body: JSON.stringify(item),
                    });
                    toast("Medicine instruction added");
                  } catch (x) {
                    toast(x.message, "error");
                  }
                }}
              >
                Add Medicine
              </button>
              <button
                className="primary"
                onClick={async () => {
                  try {
                    await api(`/prescriptions/${selected.id}/dispense`, {
                      method: "POST",
                    });
                    toast("Prescription dispensed");
                    setSelected(null);
                    load();
                  } catch (x) {
                    toast(x.message, "error");
                  }
                }}
              >
                Dispense
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function POS() {
  const toast = useToast(),
    [meds, setMeds] = useState([]),
    [customers, setCustomers] = useState([]),
    [customer, setCustomer] = useState(""),
    [cart, setCart] = useState([]),
    [q, setQ] = useState(""),
    [pay, setPay] = useState("CASH"),
    [discount, setDiscount] = useState(0),
    [invoice, setInvoice] = useState(null);
  const load = () =>
    Promise.all([
      api("/pos/medicines").then(setMeds),
      api("/customers").then(setCustomers),
    ]);
  useLive(load);
  /* stock changed by someone else while this cart is open? keep the cart honest */
  useEffect(() => {
    setCart((c) => {
      let changed = null;
      const next = c
        .map((i) => {
          const m = meds.find((x) => x.id === i.id);
          if (!m) return i;
          if (i.qty > m.stock) changed = `${i.name}: only ${m.stock} left in stock`;
          return { ...i, stock: m.stock, qty: Math.max(0, Math.min(i.qty, m.stock)) };
        })
        .filter((i) => i.qty > 0);
      if (changed) setTimeout(() => toast(`Stock updated live. ${changed}`, "error"), 0);
      return changed ? next : c;
    });
  }, [meds]);
  function add(m) {
    setCart((c) => {
      const x = c.find((i) => i.id === m.id);
      return x
        ? c.map((i) =>
            i.id === m.id ? { ...i, qty: Math.min(i.qty + 1, m.stock) } : i,
          )
        : [...c, { ...m, qty: 1 }];
    });
  }
  const subtotal = cart.reduce((s, i) => s + Number(i.unit_price) * i.qty, 0),
    discountError =
      discount === "" || Number.isNaN(Number(discount))
        ? "Enter a valid discount"
        : Number(discount) < 0
          ? "Discount can't be negative"
          : Number(discount) > subtotal
            ? "Discount can't be more than the subtotal"
            : "",
    total = Math.max(0, subtotal - Number(discount || 0)),
    shown = meds.filter((m) =>
      (m.name + m.generic_name + m.barcode)
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
  async function checkout() {
    try {
      const r = await api("/pos/checkout", {
        method: "POST",
        body: JSON.stringify({
          customer_id: customer || null,
          items: cart.map((i) => ({ medicine_id: i.id, quantity: i.qty })),
          discount,
          payment_method: pay,
        }),
      });
      const full = await api(`/sales/${r.saleId}/invoice`);
      setInvoice(full);
      setCart([]);
      setDiscount(0);
      toast("Sale completed successfully");
      load();
    } catch (e) {
      toast(e.message, "error");
    }
  }
  return (
    <>
      <Head
        tag="LIVE POS"
        title="Sales & Billing"
        text="Search medicines, build a cart and generate a professional receipt."
      />
      <div className="pos">
        <section>
          <SearchBox
            q={q}
            setQ={setQ}
            placeholder="Search medicine or scan barcode..."
          />
          <div className="productgrid">
            {shown.map((m) => (
              <button
                className="product glass"
                onClick={() => add(m)}
                key={m.id}
              >
                <span>{m.generic_name}</span>
                <b>{m.name}</b>
                <small>{m.stock} in stock</small>
                <strong>LKR {Number(m.unit_price).toFixed(2)}</strong>
              </button>
            ))}
          </div>
        </section>
        <aside className="cart glass">
          <h2>Current Sale</h2>
          <label>
            Customer
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </label>
          {cart.map((i) => (
            <div className="cartitem" key={i.id}>
              <div>
                <b>{i.name}</b>
                <small>
                  LKR {i.unit_price} × {i.qty}
                </small>
              </div>
              <div>
                <button
                  onClick={() =>
                    setCart((c) =>
                      c.map((x) =>
                        x.id === i.id
                          ? { ...x, qty: Math.max(1, x.qty - 1) }
                          : x,
                      ),
                    )
                  }
                >
                  −
                </button>
                <span>{i.qty}</span>
                <button
                  onClick={() =>
                    setCart((c) =>
                      c.map((x) =>
                        x.id === i.id
                          ? { ...x, qty: Math.min(x.stock, x.qty + 1) }
                          : x,
                      ),
                    )
                  }
                >
                  +
                </button>
                <button
                  onClick={() => setCart((c) => c.filter((x) => x.id !== i.id))}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {!cart.length && <p className="empty">Cart is empty</p>}
          <div className="totals">
            <label>
              Discount (LKR)
              <input
                type="number"
                min="0"
                value={discount}
                className={discountError ? "fv-invalid" : ""}
                onChange={(e) => setDiscount(e.target.value)}
              />
              {discountError && <span className="fv-hint"><span className="fv-text error" role="alert">{discountError}</span></span>}
            </label>
            <label>
              Payment
              <select value={pay} onChange={(e) => setPay(e.target.value)}>
                <option>CASH</option>
                <option>CARD</option>
                <option>DIGITAL</option>
              </select>
            </label>
            <p>
              Subtotal <b>LKR {subtotal.toFixed(2)}</b>
            </p>
            <p>
              Discount <b>− LKR {Number(discount || 0).toFixed(2)}</b>
            </p>
            <h3>
              Total <b>LKR {total.toFixed(2)}</b>
            </h3>
            <button
              className="primary checkout"
              disabled={!cart.length || !!discountError}
              onClick={checkout}
            >
              <ReceiptText size={17} />
              Complete Sale
            </button>
          </div>
        </aside>
      </div>
      {invoice && <Invoice invoice={invoice} close={() => setInvoice(null)} />}
    </>
  );
}
function Invoice({ invoice, close }) {
  const brand = getBrand();
  return (
    <div className="modal">
      <div className="invoice glass" id="print-invoice">
        <button className="dialog-x no-print" onClick={close}>
          <X />
        </button>
        <div className="invoice-brand">
          <div className="brandmark">{brand.logo}</div>
          <div>
            <h2>{brand.name} Pharmacy</h2>
            <span>{brand.sub}</span>
          </div>
        </div>
        <div className="invoice-meta">
          <div>
            <span>INVOICE</span>
            <b>{invoice.invoice_no}</b>
          </div>
          <div>
            <span>DATE</span>
            <b>{new Date(invoice.created_at).toLocaleString()}</b>
          </div>
          <div>
            <span>CUSTOMER</span>
            <b>{invoice.customer}</b>
          </div>
          <div>
            <span>CASHIER</span>
            <b>{invoice.cashier}</b>
          </div>
        </div>
        {invoice.customer_number && <div className="invoice-customer">
          <span><b>Customer ID:</b> CUST-{String(invoice.customer_number).padStart(5,"0")}</span>
          <span><b>Phone:</b> {invoice.customer_phone || "—"}</span>
          <span><b>Email:</b> {invoice.customer_email || "—"}</span>
        </div>}
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((x, i) => (
              <tr key={i}>
                <td>{x.name}</td>
                <td>{x.quantity}</td>
                <td>{Number(x.unit_price).toFixed(2)}</td>
                <td>{Number(x.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-total">
          <p>
            Subtotal <b>LKR {Number(invoice.subtotal).toFixed(2)}</b>
          </p>
          <p>
            Discount <b>LKR {Number(invoice.discount).toFixed(2)}</b>
          </p>
          <h3>
            Grand Total <b>LKR {Number(invoice.grand_total).toFixed(2)}</b>
          </h3>
          <small>Payment: {invoice.payment_method}</small>
          {invoice.customer_number && <small className="loyalty-line">Points earned: +{invoice.earned_points} · Current loyalty balance: {invoice.loyalty_points}</small>}
        </div>
        <p className="thanks">Thank you for choosing {brand.name} Pharmacy.</p>
        <button className="primary no-print" onClick={() => window.print()}>
          <Printer size={16} />
          Print Invoice
        </button>
      </div>
    </div>
  );
}
function Finance() {
  const [d, setD] = useState(null),
    [trend, setTrend] = useState([]);
  useLive(() =>
    Promise.all([
      api("/reports/summary").then(setD),
      api("/dashboard/trend").then(setTrend),
    ]),
  );
  return (
    <>
      <Head
        tag="MODULE 05"
        title="Finance & Reports"
        text="Revenue, transaction activity and best-selling medicines."
      />
      <div className="grid">
        <div className="card glass">
          <TrendingUp />
          <span>Total revenue</span>
          <strong>LKR {d?.revenue?.toLocaleString() || 0}</strong>
          <small>Completed sales</small>
        </div>
        <div className="card glass">
          <ReceiptText />
          <span>Transactions</span>
          <strong>{d?.transactions || 0}</strong>
          <small>Paid invoices</small>
        </div>
        <div className="card glass">
          <WalletCards />
          <span>Avg. sale</span>
          <strong>
            LKR{" "}
            {d?.transactions
              ? Math.round(d.revenue / d.transactions).toLocaleString()
              : 0}
          </strong>
          <small>Revenue per invoice</small>
        </div>
      </div>
      <div className="dash-two">
        <section className="panel glass">
          <Head
            tag="TREND"
            title="Revenue chart"
            text="Recent daily sales revenue."
          />
          <MiniChart data={trend} />
        </section>
        <section className="panel glass">
          <Head
            tag="TOP SELLERS"
            title="Best-selling medicines"
            text="Ranked by revenue."
          />
          <div className="ranking">
            {d?.top?.map((x, i) => (
              <div key={x.name}>
                <span>0{i + 1}</span>
                <div>
                  <b>{x.name}</b>
                  <small>{x.units} units</small>
                </div>
                <strong>LKR {Number(x.revenue).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="subsection">
        <Crud type="supplier_payments" />
      </div>
      <div className="subsection">
        <Crud type="invoices" />
      </div>
    </>
  );
}
function Users() {
  const toast = useToast(),
    [r, setR] = useState([]),
    [branches, setBranches] = useState([]),
    [form, setForm] = useState({ role: "CASHIER" }),
    [editUser, setEditUser] = useState(null),
    [branch, setBranch] = useState({}),
    [editBranch, setEditBranch] = useState(null),
    [q, setQ] = useState("");
  const load = () =>
    Promise.all([api("/users").then(setR), api("/branches").then(setBranches)]);
  useLive(load);
  async function saveUser(e) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.branch_id)
      return toast("Complete name, email and branch", "error");
    try {
      await api(editUser ? `/users/${editUser}` : "/users", {
        method: editUser ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      toast(editUser ? "Staff account updated" : "Staff account created");
      setForm({ role: "CASHIER" });
      setEditUser(null);
      load();
    } catch (x) {
      toast(x.message, "error");
    }
  }
  async function saveBranch(e) {
    e.preventDefault();
    if (!branch.name) return toast("Branch name is required", "error");
    try {
      await api(editBranch ? `/branches/${editBranch}` : "/branches", {
        method: editBranch ? "PUT" : "POST",
        body: JSON.stringify(branch),
      });
      toast(editBranch ? "Branch updated" : "Branch created");
      setBranch({});
      setEditBranch(null);
      load();
    } catch (x) {
      toast(x.message, "error");
    }
  }
  const f = r.filter((x) =>
    `${x.full_name || ""} ${x.email || ""} ${x.role || ""} ${x.branch || ""}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <Head
        tag="MODULE 06"
        title="Users, Employees & Branches"
        text="Create and edit staff, assign roles, manage branch access and safely deactivate records."
      />
      <div className="admin-grid">
        <form
          id="staff-editor"
          className={`form glass ${editUser ? "editing-form" : ""}`}
          onSubmit={saveUser}
        >
          <h3>{editUser ? "Edit staff account" : "New staff account"}</h3>
          {["full_name", "email"].map((k) => (
            <label key={k}>
              {k.replaceAll("_", " ")}
              <input
                value={form[k] || ""}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          {!editUser && (
            <label>
              Password
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Default: password"
              />
            </label>
          )}
          <label>
            Role
            <select
              value={form.role || "CASHIER"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {["MANAGER", "PHARMACIST", "INVENTORY", "FINANCE", "CASHIER"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Branch
            <select
              value={form.branch_id || ""}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
            >
              <option value="">Select branch</option>
              {branches
                .filter((b) => b.active)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
            </select>
          </label>
          <div>
            <button className="primary">
              {editUser ? "Save Staff" : "Create Staff"}
            </button>
            {editUser && (
              <button
                type="button"
                onClick={() => {
                  setEditUser(null);
                  setForm({ role: "CASHIER" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <form
          id="branch-editor"
          className={`form glass ${editBranch ? "editing-form" : ""}`}
          onSubmit={saveBranch}
        >
          <h3>{editBranch ? "Edit branch" : "New branch"}</h3>
          {["name", "address", "phone"].map((k) => (
            <label key={k}>
              {k}
              <input
                value={branch[k] || ""}
                onChange={(e) => setBranch({ ...branch, [k]: e.target.value })}
              />
            </label>
          ))}
          <div>
            <button className="primary">
              {editBranch ? "Save Branch" : "Add Branch"}
            </button>
            {editBranch && (
              <button
                type="button"
                onClick={() => {
                  setEditBranch(null);
                  setBranch({});
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <SearchBox
        q={q}
        setQ={setQ}
        placeholder="Search staff by name, role, branch..."
      />
      <div className="table glass">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {f.map((x) => (
              <tr key={x.id}>
                <td>{x.full_name}</td>
                <td>{x.email}</td>
                <td>
                  <span className="badge">{x.role}</span>
                </td>
                <td>{x.branch || "—"}</td>
                <td>{x.status}</td>
                <td>
                  <button
                    onClick={() => openUserEditor(x)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    onClick={async () => {
                      try {
                        await api(`/users/${x.id}/status`, {
                          method: "PUT",
                          body: JSON.stringify({
                            status:
                              x.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                          }),
                        });
                        toast("Account status updated");
                        load();
                      } catch (e) {
                        toast(e.message, "error");
                      }
                    }}
                  >
                    {x.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="subsection">
        <Head
          tag="BRANCH CRUD"
          title="Pharmacy branches"
          text="Edit branch contact details or deactivate a branch without deleting history."
        />
        <div className="table glass">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.address || "—"}</td>
                  <td>{b.phone || "—"}</td>
                  <td>{b.active ? "ACTIVE" : "INACTIVE"}</td>
                  <td>
                    <button
                      onClick={() => openBranchEditor(b)}
                    >
                      Edit
                    </button>{" "}
                    {b.active ? (
                      <button
                        className="danger-btn"
                        onClick={async () => {
                          if (confirm("Deactivate this branch?")) {
                            try {
                              await api(`/branches/${b.id}`, {
                                method: "DELETE",
                              });
                              toast("Branch deactivated");
                              load();
                            } catch (e) {
                              toast(e.message, "error");
                            }
                          }
                        }}
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function SettingsPage() {
  const { syncUser } = useAuth(),
    toast = useToast(),
    [profile, setProfile] = useState({}),
    [brand, setBrand] = useState(getBrand());
  useEffect(() => {
    api("/profile").then(setProfile);
  }, []);
  function chooseImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/"))
      return toast("Please select an image file", "error");
    if (f.size > 750 * 1024)
      return toast("Image must be smaller than 750 KB", "error");
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((p) => ({ ...p, profile_image: reader.result }));
    reader.readAsDataURL(f);
  }
  async function saveProfile(e) {
    e.preventDefault();
    if (!profile.full_name || !profile.email)
      return toast("Name and email are required", "error");
    try {
      await api("/profile", { method: "PUT", body: JSON.stringify(profile) });
      syncUser(profile);
      toast("Profile updated");
    } catch (x) {
      toast(x.message, "error");
    }
  }
  function saveBrand(e) {
    e.preventDefault();
    localStorage.setItem("brand", JSON.stringify(brand));
    toast("Brand customization saved. Refreshing...");
    setTimeout(() => location.reload(), 700);
  }
  return (
    <>
      <Head
        tag="PERSONALIZATION"
        title="Profile & Settings"
        text="Update your account and customize the pharmacy identity shown across the app."
      />
      <div className="settings-grid">
        <form className="form glass settings-card" onSubmit={saveProfile}>
          <div className="profile-photo-editor">
            <div className="profile-photo">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt="Profile preview" />
              ) : (
                <UserRound />
              )}
            </div>
            <div>
              <h2>My Profile</h2>
              <p>JPG, PNG or WebP · maximum 750 KB</p>
              <div className="photo-actions">
                <label className="upload-btn">
                  <Camera size={16} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={chooseImage}
                  />
                </label>
                {profile.profile_image && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfile({ ...profile, profile_image: null })
                    }
                  >
                    <ImageOff size={16} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <label>
            Full name
            <input
              value={profile.full_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </label>
          <label>
            New password <small>Leave blank to keep current password</small>
            <input
              type="password"
              value={profile.password || ""}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
            />
          </label>
          <div className="info-strip">
            <Building2 size={16} />
            {profile.branch || "Assigned branch"}
            <ShieldCheck size={16} />
            {profile.role}
          </div>
          <button className="primary">Save Profile</button>
        </form>
        <form className="form glass settings-card" onSubmit={saveBrand}>
          <div className="setting-icon">
            <Palette />
          </div>
          <h2>Pharmacy Branding</h2>
          <label>
            Pharmacy name
            <input
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            />
          </label>
          <label>
            System label
            <input
              value={brand.sub}
              onChange={(e) => setBrand({ ...brand, sub: e.target.value })}
            />
          </label>
          <label>
            Logo initials
            <input
              maxLength="3"
              value={brand.logo}
              onChange={(e) =>
                setBrand({ ...brand, logo: e.target.value.toUpperCase() })
              }
            />
          </label>
          <label>
            Login tagline
            <input
              value={brand.tagline}
              onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
            />
          </label>
          <div className="brand-preview">
            <div className="brandmark">{brand.logo}</div>
            <div>
              <b>{brand.name}</b>
              <span>{brand.sub}</span>
            </div>
          </div>
          <button className="primary">Save Branding</button>
        </form>
      </div>
    </>
  );
}
function Protected() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const allowed = Object.fromEntries(nav.map((x) => [x[0], x[3]]));
  function Guard({ path, children }) {
    return allowed[path]?.includes(user.role) ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={user.role === "CUSTOMER" ? <CustomerPortal /> : <Dashboard />} />
        <Route
          path="/inventory"
          element={
            <Guard path="/inventory">
              <Inventory />
            </Guard>
          }
        />
        <Route
          path="/suppliers"
          element={
            <Guard path="/suppliers">
              <Purchasing />
            </Guard>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <Guard path="/prescriptions">
              <PrescriptionDesk />
            </Guard>
          }
        />
        <Route
          path="/pos"
          element={
            <Guard path="/pos">
              <POS />
            </Guard>
          }
        />
        <Route
          path="/customers"
          element={
            <Guard path="/customers">
              <Crud type="customers" />
            </Guard>
          }
        />
        <Route
          path="/finance"
          element={
            <Guard path="/finance">
              <Finance />
            </Guard>
          }
        />
        <Route
          path="/users"
          element={
            <Guard path="/users">
              <Users />
            </Guard>
          }
        />
        <Route path="/operations" element={<Guard path="/operations"><AdvancedOperations /></Guard>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
function ValidationHost() {
  const toast = useToast();
  return <LiveValidation onInvalid={(m) => toast(m, "error")} />;
}
function App() {
  return (
    <ToastProvider>
      <ValidationHost />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/*" element={<Protected />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
