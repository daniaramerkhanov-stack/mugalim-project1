import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#1565C0", primaryLight: "#1976D2", primaryDark: "#0D47A1",
  secondary: "#2E7D32", secondaryLight: "#43A047",
  accent: "#0288D1", accentLight: "#E3F2FD",
  warning: "#F57F17", success: "#2E7D32", danger: "#C62828",
  bg: "#F0F4F8", card: "#FFFFFF", sidebar: "#0D2137",
  sidebarHover: "#1A3A5C", text: "#1A237E", textMuted: "#546E7A",
};

const MOCK_USERS = [
  { id: 1, name: "Айгерім Бекова", email: "aigul@test.com", password: "123", course: 1, scholarship: 45000, progress: 72, avatar: "АБ", role: "student" },
  { id: 2, name: "Нұрлан Сейтқали", email: "nurlan@test.com", password: "123", course: 2, scholarship: 52000, progress: 58, avatar: "НС", role: "student" },
  { id: 3, name: "Мадина Омарова", email: "madina@test.com", password: "123", course: 3, scholarship: 60000, progress: 85, avatar: "МО", role: "student" },
  { id: 4, name: "Әкімші", email: "admin@test.com", password: "admin", course: 0, scholarship: 0, progress: 100, avatar: "ӘК", role: "admin" },
];

const MOCK_TASKS = [
  { id: 1, month: "Қаңтар", title: "Мектепке бару есебі", desc: "4 сағат мектепте болу және есеп жазу", course: 1, completed: true, dueDate: "2025-01-31", file: null },
  { id: 2, month: "Қаңтар", title: "Сабақ жоспары", desc: "Бір апталық сабақ жоспарын жасау", course: 1, completed: false, dueDate: "2025-01-28", file: null },
  { id: 3, month: "Ақпан", title: "Бақылау жұмысы", desc: "Психология пәнінен бақылау жұмысын жазу", course: 1, completed: false, dueDate: "2025-02-15", file: null },
  { id: 4, month: "Ақпан", title: "Тәжірибе есебі", desc: "Өндірістік тәжірибе туралы есеп", course: 1, completed: true, dueDate: "2025-02-20", file: "esep.pdf" },
  { id: 5, month: "Наурыз", title: "Зерттеу жұмысы", desc: "Педагогика бойынша зерттеу жұмысы", course: 1, completed: false, dueDate: "2025-03-10", file: null },
  { id: 6, month: "Қаңтар", title: "Портфолио жинау", desc: "Семестрлік портфолио толтыру", course: 2, completed: true, dueDate: "2025-01-25", file: null },
  { id: 7, month: "Ақпан", title: "Курстық жұмыс", desc: "2-курс курстық жұмысы", course: 2, completed: false, dueDate: "2025-02-28", file: null },
];

const MOCK_SCHEDULE = [
  { id: 1, day: "Дүйсенбі", time: "09:00", subject: "Педагогика негіздері", teacher: "Алмас Нұрқожаев", room: "204", type: "offline", course: 1 },
  { id: 2, day: "Дүйсенбі", time: "11:00", subject: "Психология", teacher: "Гүлнәр Исаева", room: "Zoom", type: "online", course: 1 },
  { id: 3, day: "Сейсенбі", time: "10:00", subject: "Оқыту әдістемесі", teacher: "Берік Жанәбіл", room: "301", type: "offline", course: 1 },
  { id: 4, day: "Сәрсенбі", time: "14:00", subject: "Мектеп тәжірибесі", teacher: "Алмас Нұрқожаев", room: "Google Meet", type: "online", course: 1 },
  { id: 5, day: "Бейсенбі", time: "09:00", subject: "Инклюзивті білім беру", teacher: "Сандуғаш Мұқанова", room: "105", type: "offline", course: 1 },
  { id: 6, day: "Жұма", time: "10:00", subject: "Ақпараттық технологиялар", teacher: "Данияр Сейітов", room: "Zoom", type: "online", course: 1 },
  { id: 7, day: "Дүйсенбі", time: "10:00", subject: "Жоғары математика", teacher: "Ерлан Бейсенов", room: "201", type: "offline", course: 2 },
  { id: 8, day: "Сейсенбі", time: "13:00", subject: "Дидактика", teacher: "Гүлнәр Исаева", room: "Teams", type: "online", course: 2 },
];

const MOCK_SEMINARS = [
  { id: 1, title: "Заманауи педагогика тенденциялары", speaker: "Проф. Кенжебаев А.Т.", topic: "Цифрлық білім беру", date: "2025-02-10", time: "14:00", place: "Актовый зал", online: false, registered: true },
  { id: 2, title: "Мұғалім психологиясы", speaker: "Dr. Смайылова Г.К.", topic: "Эмоциональды интеллект", date: "2025-02-18", time: "15:00", place: "Zoom", online: true, registered: false },
  { id: 3, title: "Инклюзивті оқыту практикасы", speaker: "Балғабаева М.Ж.", topic: "Ерекше балалармен жұмыс", date: "2025-03-05", time: "10:00", place: "305 аудитория", online: false, registered: false },
  { id: 4, title: "MUGALIM жобасы: жетістіктер", speaker: "Жоба координаторы Ахметов Н.", topic: "Жоба нәтижелері", date: "2025-03-15", time: "11:00", place: "Google Meet", online: true, registered: true },
];

const MOCK_TESTS = [
  {
    id: 1, title: "Педагогика негіздері", course: 1, duration: 30, questions: [
      { id: 1, q: "Педагогика ғылымының негізін қалаған кім?", options: ["Я.А. Коменский", "Ж.Ж. Руссо", "И. Кант", "Л. Выготский"], answer: 0 },
      { id: 2, q: "Дидактика дегеніміз не?", options: ["Тәрбие теориясы", "Оқыту теориясы", "Психология", "Педагогика тарихы"], answer: 1 },
      { id: 3, q: "Оқушыға бағытталған оқыту кім ұсынды?", options: ["Б. Блум", "К. Роджерс", "Л. Выготский", "П. Гальперин"], answer: 1 },
    ], completed: true, score: 85,
  },
  {
    id: 2, title: "Психология негіздері", course: 1, duration: 45, questions: [
      { id: 1, q: "Жақын даму аймағы ұғымын енгізген ғалым?", options: ["Пиаже", "Выготский", "Фрейд", "Скиннер"], answer: 1 },
      { id: 2, q: "Мотивация теориясын ұсынған?", options: ["Маслоу", "Юнг", "Адлер", "Бандура"], answer: 0 },
      { id: 3, q: "Когнитивті даму кезеңдерін зерттеген?", options: ["Выготский", "Пиаже", "Эриксон", "Колберг"], answer: 1 },
    ], completed: false, score: null,
  },
  {
    id: 3, title: "Мектеп тәжірибесі", course: 1, duration: 20, questions: [
      { id: 1, q: "Сабақтың негізгі құрылымдық бөліктері?", options: ["2", "3", "4", "5"], answer: 1 },
      { id: 2, q: "Рефлексия сабақтың қай кезеңінде жүргізіледі?", options: ["Басында", "Ортасында", "Соңында", "Үзілісте"], answer: 2 },
    ], completed: false, score: null,
  },
];

const MOCK_SCHOLARSHIPS = [
  { course: 1, amount: 45000, desc: "1-курс студенттері үшін негізгі стипендия" },
  { course: 2, amount: 52000, desc: "2-курс студенттері үшін жоғарылатылған стипендия" },
  { course: 3, amount: 60000, desc: "3-курс студенттері үшін жоғарылатылған стипендия" },
  { course: 4, amount: 68000, desc: "4-курс студенттері үшін үздік стипендия" },
];

const MOCK_BOOKS = [
  { id: 1, title: "Педагогика", author: "И.П. Подласый", year: 2020, type: "pdf", link: "#", category: "Педагогика", course: 0 },
  { id: 2, title: "Жалпы психология", author: "А.В. Петровский", year: 2019, type: "link", link: "#", category: "Психология", course: 0 },
  { id: 3, title: "Дидактика негіздері", author: "М.Н. Скаткин", year: 2021, type: "pdf", link: "#", category: "Дидактика", course: 1 },
  { id: 4, title: "Инклюзивті білім беру", author: "Н. Назарова", year: 2022, type: "pdf", link: "#", category: "Инклюзия", course: 2 },
  { id: 5, title: "Мектеп менеджменті", author: "В.П. Симонов", year: 2020, type: "link", link: "#", category: "Менеджмент", course: 3 },
  { id: 6, title: "Цифрлық педагогика", author: "А. Хуторской", year: 2023, type: "pdf", link: "#", category: "Технологиялар", course: 0 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "task", title: "Жаңа тапсырма", body: "Наурыз айы үшін зерттеу жұмысы қосылды", time: "2 сағат бұрын", read: false },
  { id: 2, type: "seminar", title: "Жаңа семинар", body: "02/18 психология семинарына тіркеліңіз", time: "Кеше", read: false },
  { id: 3, type: "announce", title: "Хабарландыру", body: "Стипендия ақпан айында уақытында төленеді", time: "2 күн бұрын", read: true },
  { id: 4, type: "task", title: "Мерзім ескертуі", body: "Сабақ жоспарын тапсыру мерзімі: 28 қаңтар", time: "3 күн бұрын", read: true },
];

const MOCK_FEEDBACKS = [
  { id: 1, name: "Айгерім Бекова", type: "Ұсыныс", text: "Кітапхана ресурстарын толықтыруды өтінемін", date: "2025-01-15", status: "Қаралуда" },
  { id: 2, name: "Нұрлан Сейтқали", type: "Шағым", text: "Онлайн сабақтардың сапасын жақсартуды сұраймын", date: "2025-01-18", status: "Шешілді" },
];

const COURSE_CONTENT = {
  1: { title: "1-Курс", color: "#1565C0", subjects: ["Педагогика негіздері", "Жалпы психология", "Оқыту теориясы", "Мектеп тәжірибесі I"] },
  2: { title: "2-Курс", color: "#2E7D32", subjects: ["Дидактика", "Даму психологиясы", "Оқыту технологиялары", "Мектеп тәжірибесі II"] },
  3: { title: "3-Курс", color: "#7B1FA2", subjects: ["Педагогикалық психология", "Инклюзивті білім беру", "Арнайы дидактика", "Мектеп тәжірибесі III"] },
  4: { title: "4-Курс", color: "#E65100", subjects: ["Зерттеу методологиясы", "Мектеп менеджменті", "Дипломдық жұмыс", "Педагогикалық инновациялар"] },
};

const DAYS = ["Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма"];

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Басты бет" },
  { id: "tasks", icon: "✓", label: "Тапсырмалар" },
  { id: "schedule", icon: "▦", label: "Кесте" },
  { id: "seminars", icon: "◎", label: "Семинарлар" },
  { id: "tests", icon: "◈", label: "Тесттер" },
  { id: "scholarship", icon: "₸", label: "Стипендия" },
  { id: "books", icon: "◻", label: "Кітаптар" },
  { id: "courses", icon: "◑", label: "Курстар" },
  { id: "feedback", icon: "◇", label: "Пікір" },
  { id: "notifications", icon: "◉", label: "Хабарландырулар" },
];

export default function MugalimPlatform() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", course: 1 });
  const [authError, setAuthError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [seminars, setSeminars] = useState(MOCK_SEMINARS);
  const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACKS);
  const [tests, setTests] = useState(MOCK_TESTS);
  const [users, setUsers] = useState(MOCK_USERS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogin = () => {
    const found = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (found) { setUser(found); setAuthError(""); }
    else setAuthError("Email немесе құпия сөз қате!");
  };

  const handleRegister = () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) { setAuthError("Барлық өрістерді толтырыңыз!"); return; }
    const newUser = { id: Date.now(), ...registerForm, scholarship: MOCK_SCHOLARSHIPS.find(s => s.course == registerForm.course)?.amount || 45000, progress: 0, avatar: registerForm.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(), role: "student" };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setAuthError("");
  };

  if (!user) return <AuthPage authMode={authMode} setAuthMode={setAuthMode} loginForm={loginForm} setLoginForm={setLoginForm} registerForm={registerForm} setRegisterForm={setRegisterForm} authError={authError} setAuthError={setAuthError} handleLogin={handleLogin} handleRegister={handleRegister} />;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', 'Arial', sans-serif", background: COLORS.bg, overflow: "hidden" }}>
      <Sidebar open={sidebarOpen} page={page} setPage={setPage} user={user} setUser={setUser} unreadCount={unreadCount} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} page={page} unreadCount={unreadCount} setPage={setPage} />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {page === "dashboard" && <Dashboard user={user} tasks={tasks} notifications={notifications} seminars={seminars} />}
          {page === "tasks" && <TasksPage user={user} tasks={tasks} setTasks={setTasks} />}
          {page === "schedule" && <SchedulePage user={user} schedule={MOCK_SCHEDULE} />}
          {page === "seminars" && <SeminarsPage seminars={seminars} setSeminars={setSeminars} />}
          {page === "tests" && <TestsPage user={user} tests={tests} setTests={setTests} />}
          {page === "scholarship" && <ScholarshipPage user={user} scholarships={MOCK_SCHOLARSHIPS} />}
          {page === "books" && <BooksPage user={user} />}
          {page === "courses" && <CoursesPage user={user} />}
          {page === "feedback" && <FeedbackPage user={user} feedbacks={feedbacks} setFeedbacks={setFeedbacks} />}
          {page === "notifications" && <NotificationsPage notifications={notifications} setNotifications={setNotifications} />}
          {page === "admin" && user.role === "admin" && <AdminPage users={users} setUsers={setUsers} tasks={tasks} setTasks={setTasks} seminars={seminars} setSeminars={setSeminars} />}
        </main>
      </div>
    </div>
  );
}

function AuthPage({ authMode, setAuthMode, loginForm, setLoginForm, registerForm, setRegisterForm, authError, setAuthError, handleLogin, handleRegister }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0D2137 0%, #1565C0 50%, #2E7D32 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #1565C0, #2E7D32)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", margin: "0 auto 16px", fontWeight: 700 }}>М</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>MUGALIM Жобасы</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "6px 0 0" }}>Білім беру платформасы</p>
        </div>
        <div style={{ display: "flex", background: "#F0F4F8", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", background: authMode === m ? "#fff" : "transparent", color: authMode === m ? COLORS.primary : COLORS.textMuted, boxShadow: authMode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
              {m === "login" ? "Кіру" : "Тіркелу"}
            </button>
          ))}
        </div>
        {authError && <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", color: "#C62828", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{authError}</div>}
        {authMode === "login" ? (
          <div>
            <InputField label="Email" value={loginForm.email} onChange={v => setLoginForm(p => ({ ...p, email: v }))} type="email" placeholder="email@example.com" />
            <InputField label="Құпия сөз" value={loginForm.password} onChange={v => setLoginForm(p => ({ ...p, password: v }))} type="password" placeholder="••••••••" />
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "8px 0 16px" }}>Тест: aigul@test.com / 123 немесе admin@test.com / admin</p>
            <PrimaryBtn onClick={handleLogin} full>Кіру</PrimaryBtn>
          </div>
        ) : (
          <div>
            <InputField label="Аты-жөні" value={registerForm.name} onChange={v => setRegisterForm(p => ({ ...p, name: v }))} placeholder="Аты Жөні" />
            <InputField label="Email" value={registerForm.email} onChange={v => setRegisterForm(p => ({ ...p, email: v }))} type="email" placeholder="email@example.com" />
            <InputField label="Құпия сөз" value={registerForm.password} onChange={v => setRegisterForm(p => ({ ...p, password: v }))} type="password" placeholder="••••••••" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Курс</label>
              <select value={registerForm.course} onChange={e => setRegisterForm(p => ({ ...p, course: parseInt(e.target.value) }))} style={inputStyle}>
                {[1, 2, 3, 4].map(c => <option key={c} value={c}>{c}-курс</option>)}
              </select>
            </div>
            <PrimaryBtn onClick={handleRegister} full>Тіркелу</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ open, page, setPage, user, setUser, unreadCount }) {
  const items = user.role === "admin" ? [...NAV_ITEMS, { id: "admin", icon: "⚙", label: "Әкімші панелі" }] : NAV_ITEMS;
  return (
    <div style={{ width: open ? 240 : 0, background: COLORS.sidebar, display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.3)" }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #1565C0, #2E7D32)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>М</div>
          <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>MUGALIM</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, whiteSpace: "nowrap" }}>Платформа</div></div>
        </div>
      </div>
      <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: page === item.id ? "rgba(255,255,255,0.12)" : "transparent", color: page === item.id ? "#fff" : "rgba(255,255,255,0.6)", textAlign: "left", fontSize: 13, fontWeight: page === item.id ? 600 : 400, transition: "all 0.2s", marginBottom: 2, position: "relative", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.id === "notifications" && unreadCount > 0 && <span style={{ background: "#EF5350", color: "#fff", borderRadius: 99, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>{unreadCount}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #1976D2, #43A047)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{user.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "#fff", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name.split(" ")[0]}</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>{user.course > 0 ? `${user.course}-курс` : "Әкімші"}</div></div>
        </div>
        <button onClick={() => setUser(null)} style={{ width: "100%", padding: "9px", border: "none", borderRadius: 8, background: "rgba(239,83,80,0.15)", color: "#EF9A9A", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Шығу</button>
      </div>
    </div>
  );
}

function Header({ user, sidebarOpen, setSidebarOpen, page, unreadCount, setPage }) {
  const PAGE_TITLES = { dashboard: "Басты бет", tasks: "Тапсырмалар", schedule: "Кесте", seminars: "Семинарлар", tests: "Тесттер", scholarship: "Стипендия", books: "Кітаптар", courses: "Курстар", feedback: "Пікір және ұсыныстар", notifications: "Хабарландырулар", admin: "Әкімші панелі" };
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #E8EDF2", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textMuted, padding: 4, lineHeight: 1 }}>☰</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>{PAGE_TITLES[page] || ""}</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>{new Date().toLocaleDateString("kk-KZ", { day: "numeric", month: "long", year: "numeric" })}</div>
        <button onClick={() => setPage("notifications")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textMuted, padding: 4, lineHeight: 1 }}>
          ◉{unreadCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, background: "#EF5350", borderRadius: "50%", color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unreadCount}</span>}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1976D2, #43A047)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{user.avatar}</div>
          <div style={{ fontSize: 13 }}><div style={{ fontWeight: 600, color: COLORS.text }}>{user.name.split(" ").slice(0, 2).join(" ")}</div><div style={{ color: COLORS.textMuted, fontSize: 11 }}>{user.course > 0 ? `${user.course}-курс` : "Әкімші"}</div></div>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ user, tasks, notifications, seminars }) {
  const userTasks = tasks.filter(t => t.course === user.course);
  const completedTasks = userTasks.filter(t => t.completed).length;
  const progress = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0;
  const upcomingSeminars = seminars.slice(0, 2);
  const recentNotifs = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, right: 80, width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <p style={{ margin: "0 0 4px", fontSize: 14, opacity: 0.8 }}>Қош келдіңіз!</p>
        <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>{user.name}</h2>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>{user.course > 0 ? `MUGALIM жобасы · ${user.course}-курс студенті` : "Платформа Әкімшісі"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="◈" label="Тапсырмалар" value={`${completedTasks}/${userTasks.length}`} sub="орындалды" color={COLORS.primary} />
        <StatCard icon="◎" label="Прогресс" value={`${progress}%`} sub="жалпы орындалу" color={COLORS.secondary} />
        <StatCard icon="₸" label="Стипендия" value={`${(user.scholarship || 0).toLocaleString()} ₸`} sub="ай сайын" color="#7B1FA2" />
        <StatCard icon="◉" label="Хабарламалар" value={recentNotifs.length} sub="оқылмаған" color="#E65100" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card title="Жалпы прогресс">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>Тапсырмалар орындалуы</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>{progress}%</span>
            </div>
            <ProgressBar value={progress} color={COLORS.primary} />
          </div>
          {userTasks.slice(0, 3).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F0F4F8" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.completed ? "#E8F5E9" : "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.completed ? COLORS.secondary : COLORS.warning, flexShrink: 0 }}>{t.completed ? "✓" : "○"}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.month}</div></div>
            </div>
          ))}
        </Card>
        <Card title="Жақындағы семинарлар">
          {upcomingSeminars.map(s => (
            <div key={s.id} style={{ padding: "12px", background: "#F8FAFF", borderRadius: 10, marginBottom: 10, border: "1px solid #E3EEFF" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{s.speaker}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Badge color={s.online ? COLORS.secondary : COLORS.primary}>{s.online ? "Онлайн" : "Офлайн"}</Badge>
                <Badge color={COLORS.textMuted}>{s.date}</Badge>
              </div>
            </div>
          ))}
          {upcomingSeminars.length === 0 && <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Жоспарланған семинар жоқ</p>}
        </Card>
      </div>
      {recentNotifs.length > 0 && (
        <Card title="Жаңа хабарландырулар" style={{ marginTop: 20 }}>
          {recentNotifs.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F4F8" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.primary, marginTop: 5, flexShrink: 0 }} />
              <div><div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{n.title}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{n.body}</div></div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function TasksPage({ user, tasks, setTasks }) {
  const [selectedMonth, setSelectedMonth] = useState("Барлығы");
  const [uploadingId, setUploadingId] = useState(null);
  const months = ["Барлығы", ...new Set(tasks.map(t => t.month))];
  const userTasks = tasks.filter(t => t.course === user.course || user.role === "admin");
  const filtered = selectedMonth === "Барлығы" ? userTasks : userTasks.filter(t => t.month === selectedMonth);
  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {months.map(m => <button key={m} onClick={() => setSelectedMonth(m)} style={{ padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer", background: selectedMonth === m ? COLORS.primary : "#fff", color: selectedMonth === m ? "#fff" : COLORS.textMuted, fontWeight: selectedMonth === m ? 600 : 400, fontSize: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>{m}</button>)}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(task => (
          <div key={task.id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `2px solid ${task.completed ? "#E8F5E9" : "#F0F4F8"}`, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <button onClick={() => toggleTask(task.id)} style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${task.completed ? COLORS.secondary : "#CBD5E1"}`, background: task.completed ? COLORS.secondary : "transparent", color: "#fff", fontSize: 13, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
              {task.completed ? "✓" : ""}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: task.completed ? COLORS.textMuted : COLORS.text, textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</span>
                <Badge color={task.completed ? COLORS.secondary : COLORS.warning}>{task.completed ? "Орындалды" : "Күтілуде"}</Badge>
                <Badge color={COLORS.primary}>{task.month}</Badge>
              </div>
              <p style={{ margin: "6px 0 10px", fontSize: 13, color: COLORS.textMuted }}>{task.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Мерзімі: {task.dueDate}</span>
                {task.file && <span style={{ fontSize: 12, color: COLORS.primary, background: "#EEF4FF", padding: "3px 10px", borderRadius: 99 }}>📄 {task.file}</span>}
                <label style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer", background: "#E3F2FD", padding: "4px 12px", borderRadius: 99, fontWeight: 500 }}>
                  + Файл жүктеу
                  <input type="file" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) setTasks(prev => prev.map(t => t.id === task.id ? { ...t, file: e.target.files[0].name } : t)); }} />
                </label>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState text="Тапсырма табылмады" />}
      </div>
    </div>
  );
}

function SchedulePage({ user, schedule }) {
  const [view, setView] = useState("weekly");
  const userSchedule = schedule.filter(s => s.course === user.course || user.role === "admin");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["weekly", "Апталық"], ["list", "Тізім"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "8px 20px", borderRadius: 99, border: "none", cursor: "pointer", background: view === v ? COLORS.primary : "#fff", color: view === v ? "#fff" : COLORS.textMuted, fontWeight: view === v ? 600 : 400, fontSize: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>{l}</button>
        ))}
      </div>
      {view === "weekly" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {DAYS.map(day => {
            const daySched = userSchedule.filter(s => s.day === day);
            return (
              <div key={day} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ background: COLORS.primary, padding: "12px", textAlign: "center" }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{day}</span>
                </div>
                <div style={{ padding: "8px" }}>
                  {daySched.length === 0 ? <p style={{ color: COLORS.textMuted, fontSize: 12, textAlign: "center", padding: "12px 0" }}>Сабақ жоқ</p> : daySched.map(s => (
                    <div key={s.id} style={{ padding: "10px", borderRadius: 10, marginBottom: 6, background: s.type === "online" ? "#E8F5E9" : "#E3F2FD", border: `1px solid ${s.type === "online" ? "#C8E6C9" : "#BBDEFB"}` }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{s.time}</div>
                      <div style={{ fontSize: 12, color: COLORS.text, marginTop: 2, fontWeight: 500 }}>{s.subject}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.teacher}</div>
                      <div style={{ marginTop: 6 }}><Badge color={s.type === "online" ? COLORS.secondary : COLORS.accent}>{s.type === "online" ? "Онлайн" : "Офлайн"}</Badge></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {userSchedule.map(s => (
            <div key={s.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>{s.time}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.day}</div></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{s.subject}</div><div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.teacher} · {s.room}</div></div>
              <Badge color={s.type === "online" ? COLORS.secondary : COLORS.primary}>{s.type === "online" ? "Онлайн" : "Офлайн"}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeminarsPage({ seminars, setSeminars }) {
  const toggle = id => setSeminars(prev => prev.map(s => s.id === id ? { ...s, registered: !s.registered } : s));
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {seminars.map(s => (
        <div key={s.id} style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Badge color={s.online ? COLORS.secondary : COLORS.primary}>{s.online ? "Онлайн" : "Офлайн"}</Badge>
                {s.registered && <Badge color="#7B1FA2">Тіркелдім</Badge>}
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: COLORS.text }}>{s.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 13, color: COLORS.textMuted, marginTop: 10 }}>
                <span style={{ fontWeight: 600, color: COLORS.text }}>Баяндамашы:</span><span>{s.speaker}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>Тақырып:</span><span>{s.topic}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>Күні:</span><span>{s.date} · {s.time}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>Орны:</span><span>{s.place}</span>
              </div>
            </div>
            <button onClick={() => toggle(s.id)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: s.registered ? "#FFEBEE" : COLORS.primary, color: s.registered ? COLORS.danger : "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {s.registered ? "Тіркеуді болдырмау" : "Тіркелу"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestsPage({ user, tests, setTests }) {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const startTest = test => {
    setActiveTest(test);
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(test.duration * 60);
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); submitTest(test); return 0; } return t - 1; }), 1000);
  };

  const submitTest = test => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    const correct = (test || activeTest).questions.filter(q => answers[q.id] === q.answer).length;
    const score = Math.round((correct / (test || activeTest).questions.length) * 100);
    setTests(prev => prev.map(t => t.id === (test || activeTest).id ? { ...t, completed: true, score } : t));
    setActiveTest(prev => prev ? { ...prev, score } : prev);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (activeTest) {
    return (
      <div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <div><h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>{activeTest.title}</h3><p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textMuted }}>{activeTest.questions.length} сұрақ</p></div>
          {!submitted && <div style={{ background: timeLeft < 60 ? "#FFEBEE" : "#E3F2FD", color: timeLeft < 60 ? COLORS.danger : COLORS.primary, padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 20, fontVariantNumeric: "tabular-nums" }}>{fmt(timeLeft)}</div>}
        </div>
        {submitted ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: activeTest.score >= 60 ? "#E8F5E9" : "#FFEBEE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>{activeTest.score >= 60 ? "✓" : "✗"}</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>Тест аяқталды!</h3>
            <div style={{ fontSize: 48, fontWeight: 700, color: activeTest.score >= 60 ? COLORS.secondary : COLORS.danger, margin: "16px 0" }}>{activeTest.score}%</div>
            <p style={{ color: COLORS.textMuted, margin: "0 0 24px" }}>{activeTest.score >= 90 ? "Керемет нәтиже!" : activeTest.score >= 60 ? "Жақсы нәтиже!" : "Тағы оқып, қайталаңыз"}</p>
            <PrimaryBtn onClick={() => { setActiveTest(null); setSubmitted(false); }}>Тесттер тізіміне оралу</PrimaryBtn>
          </div>
        ) : (
          <div>
            {activeTest.questions.map((q, i) => (
              <div key={q.id} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{i + 1}. {q.q}</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((opt, j) => (
                    <label key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, cursor: "pointer", border: `2px solid ${answers[q.id] === j ? COLORS.primary : "#E8EDF2"}`, background: answers[q.id] === j ? "#EEF4FF" : "#F8FAFF", transition: "all 0.15s" }}>
                      <input type="radio" name={`q${q.id}`} checked={answers[q.id] === j} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: j }))} style={{ display: "none" }} />
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${answers[q.id] === j ? COLORS.primary : "#CBD5E1"}`, background: answers[q.id] === j ? COLORS.primary : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {answers[q.id] === j && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: 14, color: COLORS.text }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => { clearInterval(timerRef.current); setActiveTest(null); }} style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${COLORS.textMuted}`, background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontWeight: 600 }}>Болдырмау</button>
              <PrimaryBtn onClick={() => submitTest()}>Тапсыру</PrimaryBtn>
            </div>
          </div>
        )}
      </div>
    );
  }

  const userTests = tests.filter(t => t.course === user.course || user.role === "admin");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {userTests.map(test => (
        <div key={test.id} style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: COLORS.text }}>{test.title}</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{test.questions.length} сұрақ</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>·</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{test.duration} минут</span>
              {test.completed && <><span style={{ fontSize: 12, color: COLORS.textMuted }}>·</span><span style={{ fontSize: 12, fontWeight: 700, color: test.score >= 60 ? COLORS.secondary : COLORS.danger }}>Нәтиже: {test.score}%</span></>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {test.completed && <Badge color={test.score >= 60 ? COLORS.secondary : COLORS.danger}>{test.score >= 60 ? "Өтті" : "Өтпеді"}</Badge>}
            <button onClick={() => startTest(test)} style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: test.completed ? "#F0F4F8" : COLORS.primary, color: test.completed ? COLORS.textMuted : "#fff", fontWeight: 700, fontSize: 13 }}>
              {test.completed ? "Қайталау" : "Бастау"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScholarshipPage({ user, scholarships }) {
  return (
    <div>
      <Card title="Менің стипендиям" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ background: "linear-gradient(135deg, #7B1FA2, #9C27B0)", borderRadius: 16, padding: "24px 32px", color: "#fff" }}>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Ай сайынғы стипендия</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{(user.scholarship || 0).toLocaleString()} ₸</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>{user.course}-курс студенті</div>
          </div>
          <div>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 8px" }}>Стипендия жыл сайын қайта қаралады</p>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>Ай сайын 5-ші күні есептеледі</p>
          </div>
        </div>
      </Card>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Барлық курстар бойынша стипендия</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {scholarships.map(s => (
          <div key={s.course} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: s.course === user.course ? `2px solid ${COLORS.primary}` : "2px solid transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{s.course}-курс</span>
              {s.course === user.course && <Badge color={COLORS.primary}>Менің курсым</Badge>}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#7B1FA2" }}>{s.amount.toLocaleString()} ₸</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>{s.desc}</div>
            <ProgressBar value={Math.round((s.amount / 68000) * 100)} color="#7B1FA2" style={{ marginTop: 12 }} />
          </div>
        ))}
      </div>
      <Card title="Төлем кестесі" style={{ marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#F8FAFF" }}>{["Ай", "Сома", "Мерзімі", "Күйі"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: COLORS.textMuted, borderBottom: "1px solid #E8EDF2" }}>{h}</th>)}</tr></thead>
          <tbody>
            {["Қаңтар", "Ақпан", "Наурыз"].map((m, i) => (
              <tr key={m}><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}>{m} 2025</td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8", fontWeight: 600 }}>{(user.scholarship || 0).toLocaleString()} ₸</td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}>{5} {m === "Қаңтар" ? "қаңтар" : m === "Ақпан" ? "ақпан" : "наурыз"}</td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}><Badge color={i < 2 ? COLORS.secondary : COLORS.warning}>{i < 2 ? "Төленді" : "Күтілуде"}</Badge></td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function BooksPage({ user }) {
  const [cat, setCat] = useState("Барлығы");
  const cats = ["Барлығы", ...new Set(MOCK_BOOKS.map(b => b.category))];
  const filtered = (cat === "Барлығы" ? MOCK_BOOKS : MOCK_BOOKS.filter(b => b.category === cat)).filter(b => b.course === 0 || b.course === user.course || user.role === "admin");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer", background: cat === c ? COLORS.secondary : "#fff", color: cat === c ? "#fff" : COLORS.textMuted, fontWeight: cat === c ? 600 : 400, fontSize: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>{c}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {filtered.map(b => (
          <div key={b.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "transform 0.2s" }}>
            <div style={{ height: 6, background: b.type === "pdf" ? COLORS.primary : COLORS.secondary }} />
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <Badge color={b.type === "pdf" ? COLORS.primary : COLORS.secondary}>{b.type === "pdf" ? "PDF" : "Сілтеме"}</Badge>
                <Badge color={COLORS.textMuted}>{b.category}</Badge>
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>{b.title}</h4>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: COLORS.textMuted }}>{b.author}</p>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: COLORS.textMuted }}>{b.year} ж.</p>
              <a href={b.link} style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: 10, background: COLORS.primary, color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                {b.type === "pdf" ? "PDF жүктеу" : "Ашу"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesPage({ user }) {
  const [activeCourse, setActiveCourse] = useState(user.course || 1);
  const courseColors = { 1: COLORS.primary, 2: COLORS.secondary, 3: "#7B1FA2", 4: "#E65100" };
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map(c => (
          <button key={c} onClick={() => setActiveCourse(c)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: activeCourse === c ? courseColors[c] : "#fff", color: activeCourse === c ? "#fff" : COLORS.textMuted, fontWeight: activeCourse === c ? 700 : 400, fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s" }}>{c}-курс {user.course === c ? "• Менің курсым" : ""}</button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ background: courseColors[activeCourse], padding: "28px 32px", color: "#fff" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700 }}>{COURSE_CONTENT[activeCourse].title}</h2>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>MUGALIM жобасы · Оқу бағдарламасы</p>
        </div>
        <div style={{ padding: "24px 32px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Пәндер тізімі</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {COURSE_CONTENT[activeCourse].subjects.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#F8FAFF", borderRadius: 12, border: "1px solid #E3EEFF" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: courseColors[activeCourse], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[["Тапсырмалар", MOCK_TASKS.filter(t => t.course === activeCourse).length], ["Тесттер", MOCK_TESTS.filter(t => t.course === activeCourse).length], ["Кітаптар", MOCK_BOOKS.filter(b => b.course === activeCourse || b.course === 0).length]].map(([l, v]) => (
              <div key={l} style={{ background: "#F8FAFF", borderRadius: 12, padding: "16px", textAlign: "center", border: "1px solid #E3EEFF" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: courseColors[activeCourse] }}>{v}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackPage({ user, feedbacks, setFeedbacks }) {
  const [form, setForm] = useState({ type: "Ұсыныс", text: "" });
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!form.text) return;
    setFeedbacks(prev => [...prev, { id: Date.now(), name: user.name, type: form.type, text: form.text, date: new Date().toISOString().split("T")[0], status: "Қаралуда" }]);
    setForm({ type: "Ұсыныс", text: "" });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      <div>
        <Card title="Пікір/Ұсыныс жіберу">
          {sent && <div style={{ background: "#E8F5E9", border: "1px solid #A5D6A7", color: COLORS.secondary, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontWeight: 600, fontSize: 13 }}>✓ Пікіріңіз жіберілді! Рақмет.</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Түрі</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
              {["Ұсыныс", "Шағым", "Сауал", "Алғыс"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Хабарлама</label>
            <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={5} placeholder="Пікіріңізді жазыңыз..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </div>
          <PrimaryBtn onClick={submit} full>Жіберу</PrimaryBtn>
        </Card>
      </div>
      <Card title="Жіберілген пікірлер">
        {feedbacks.filter(f => f.name === user.name || user.role === "admin").map(f => (
          <div key={f.id} style={{ padding: "14px", background: "#F8FAFF", borderRadius: 10, marginBottom: 10, border: "1px solid #E3EEFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
              <div style={{ display: "flex", gap: 8 }}><Badge color={COLORS.primary}>{f.type}</Badge>{user.role === "admin" && <span style={{ fontSize: 12, color: COLORS.textMuted }}>{f.name}</span>}</div>
              <Badge color={f.status === "Шешілді" ? COLORS.secondary : COLORS.warning}>{f.status}</Badge>
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: COLORS.text }}>{f.text}</p>
            <span style={{ fontSize: 11, color: COLORS.textMuted }}>{f.date}</span>
          </div>
        ))}
        {feedbacks.filter(f => f.name === user.name || user.role === "admin").length === 0 && <EmptyState text="Пікір жоқ" />}
      </Card>
    </div>
  );
}

function NotificationsPage({ notifications, setNotifications }) {
  const markAll = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markOne = id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const typeColors = { task: COLORS.primary, seminar: COLORS.secondary, announce: "#E65100" };
  const typeIcons = { task: "✓", seminar: "◎", announce: "◉" };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={markAll} style={{ padding: "8px 18px", borderRadius: 99, border: `1px solid ${COLORS.primary}`, background: "transparent", color: COLORS.primary, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Барлығын оқылды деп белгілеу</button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => markOne(n.id)} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 14, cursor: "pointer", border: `2px solid ${n.read ? "transparent" : "#E3EEFF"}`, transition: "border-color 0.2s" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: n.read ? "#F0F4F8" : `${typeColors[n.type]}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: n.read ? COLORS.textMuted : typeColors[n.type], flexShrink: 0 }}>{typeIcons[n.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: COLORS.text }}>{n.title}</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>{n.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>{n.body}</p>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.primary, flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage({ users, setUsers, tasks, setTasks, seminars, setSeminars }) {
  const [tab, setTab] = useState("students");
  const [newTask, setNewTask] = useState({ title: "", desc: "", month: "Қаңтар", course: 1, dueDate: "" });
  const [newSeminar, setNewSeminar] = useState({ title: "", speaker: "", topic: "", date: "", time: "", place: "", online: false });
  const [taskAdded, setTaskAdded] = useState(false);
  const [semAdded, setSemAdded] = useState(false);

  const addTask = () => {
    if (!newTask.title) return;
    setTasks(prev => [...prev, { id: Date.now(), ...newTask, completed: false, file: null }]);
    setNewTask({ title: "", desc: "", month: "Қаңтар", course: 1, dueDate: "" });
    setTaskAdded(true); setTimeout(() => setTaskAdded(false), 2500);
  };
  const addSeminar = () => {
    if (!newSeminar.title) return;
    setSeminars(prev => [...prev, { id: Date.now(), ...newSeminar, registered: false }]);
    setNewSeminar({ title: "", speaker: "", topic: "", date: "", time: "", place: "", online: false });
    setSemAdded(true); setTimeout(() => setSemAdded(false), 2500);
  };

  const TABS = [["students", "Студенттер"], ["addTask", "Тапсырма қосу"], ["addSeminar", "Семинар қосу"]];

  return (
    <div>
      <div style={{ background: "#FFF3E0", border: "1px solid #FFCC02", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "#E65100", fontWeight: 500 }}>⚙ Әкімші панелі · Барлық деректерге қол жеткізу бар</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map(([v, l]) => <button key={v} onClick={() => setTab(v)} style={{ padding: "9px 18px", borderRadius: 99, border: "none", cursor: "pointer", background: tab === v ? COLORS.primary : "#fff", color: tab === v ? "#fff" : COLORS.textMuted, fontWeight: tab === v ? 600 : 400, fontSize: 13, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>{l}</button>)}
      </div>
      {tab === "students" && (
        <Card title={`Студенттер тізімі (${users.filter(u => u.role === "student").length})`}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#F8FAFF" }}>{["Аты-жөні", "Email", "Курс", "Прогресс", "Стипендия"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: COLORS.textMuted, borderBottom: "1px solid #E8EDF2" }}>{h}</th>)}</tr></thead>
            <tbody>{users.filter(u => u.role === "student").map(u => (
              <tr key={u.id}><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1976D2, #43A047)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{u.avatar}</div>{u.name}</div></td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8", color: COLORS.textMuted }}>{u.email}</td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}><Badge color={COLORS.primary}>{u.course}-курс</Badge></td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8", minWidth: 120 }}><ProgressBar value={u.progress} color={COLORS.secondary} /><span style={{ fontSize: 11, color: COLORS.textMuted }}>{u.progress}%</span></td><td style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8", fontWeight: 600, color: "#7B1FA2" }}>{(u.scholarship || 0).toLocaleString()} ₸</td></tr>
            ))}</tbody>
          </table>
        </Card>
      )}
      {tab === "addTask" && (
        <Card title="Жаңа тапсырма қосу">
          {taskAdded && <div style={{ background: "#E8F5E9", border: "1px solid #A5D6A7", color: COLORS.secondary, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontWeight: 600, fontSize: 13 }}>✓ Тапсырма сәтті қосылды!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1/-1" }}><InputField label="Тапсырма атауы" value={newTask.title} onChange={v => setNewTask(p => ({ ...p, title: v }))} placeholder="Тапсырма атауын енгізіңіз" /></div>
            <div style={{ gridColumn: "1/-1" }}><InputField label="Сипаттама" value={newTask.desc} onChange={v => setNewTask(p => ({ ...p, desc: v }))} placeholder="Тапсырма сипаттамасы" /></div>
            <div><label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Ай</label><select value={newTask.month} onChange={e => setNewTask(p => ({ ...p, month: e.target.value }))} style={inputStyle}>{["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым"].map(m => <option key={m}>{m}</option>)}</select></div>
            <div><label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Курс</label><select value={newTask.course} onChange={e => setNewTask(p => ({ ...p, course: parseInt(e.target.value) }))} style={inputStyle}>{[1, 2, 3, 4].map(c => <option key={c} value={c}>{c}-курс</option>)}</select></div>
            <div style={{ gridColumn: "1/-1" }}><InputField label="Мерзімі" value={newTask.dueDate} onChange={v => setNewTask(p => ({ ...p, dueDate: v }))} type="date" /></div>
          </div>
          <div style={{ marginTop: 16 }}><PrimaryBtn onClick={addTask}>Тапсырма қосу</PrimaryBtn></div>
        </Card>
      )}
      {tab === "addSeminar" && (
        <Card title="Жаңа семинар қосу">
          {semAdded && <div style={{ background: "#E8F5E9", border: "1px solid #A5D6A7", color: COLORS.secondary, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontWeight: 600, fontSize: 13 }}>✓ Семинар сәтті қосылды!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1/-1" }}><InputField label="Семинар атауы" value={newSeminar.title} onChange={v => setNewSeminar(p => ({ ...p, title: v }))} placeholder="Семинар атауы" /></div>
            <InputField label="Баяндамашы" value={newSeminar.speaker} onChange={v => setNewSeminar(p => ({ ...p, speaker: v }))} placeholder="Аты-жөні" />
            <InputField label="Тақырып" value={newSeminar.topic} onChange={v => setNewSeminar(p => ({ ...p, topic: v }))} placeholder="Семинар тақырыбы" />
            <InputField label="Күні" value={newSeminar.date} onChange={v => setNewSeminar(p => ({ ...p, date: v }))} type="date" />
            <InputField label="Уақыты" value={newSeminar.time} onChange={v => setNewSeminar(p => ({ ...p, time: v }))} type="time" />
            <div style={{ gridColumn: "1/-1" }}><InputField label="Орны / Сілтемесі" value={newSeminar.place} onChange={v => setNewSeminar(p => ({ ...p, place: v }))} placeholder="Аудитория немесе Zoom сілтемесі" /></div>
            <div style={{ gridColumn: "1/-1" }}><label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14 }}><input type="checkbox" checked={newSeminar.online} onChange={e => setNewSeminar(p => ({ ...p, online: e.target.checked }))} /><span style={{ fontWeight: 500, color: COLORS.text }}>Онлайн семинар</span></label></div>
          </div>
          <div style={{ marginTop: 16 }}><PrimaryBtn onClick={addSeminar}>Семинар қосу</PrimaryBtn></div>
        </Card>
      )}
    </div>
  );
}

// ─── Reusable UI Components ───────────────────────────────────────

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", ...style }}>
      {title && <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: COLORS.text, paddingBottom: 12, borderBottom: "1px solid #F0F4F8" }}>{title}</h3>}
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: 22, marginBottom: 10, color }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function ProgressBar({ value, color, style = {} }) {
  return (
    <div style={{ background: "#E8EDF2", borderRadius: 99, height: 8, overflow: "hidden", ...style }}>
      <div style={{ height: "100%", width: `${Math.min(100, value)}%`, background: color, borderRadius: 99, transition: "width 0.5s" }} />
    </div>
  );
}

function Badge({ color, children }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: `${color}22`, color, whiteSpace: "nowrap" }}>{children}</span>;
}

function PrimaryBtn({ onClick, children, full }) {
  return <button onClick={onClick} style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, color: "#fff", fontWeight: 700, fontSize: 14, width: full ? "100%" : "auto", transition: "opacity 0.2s" }}>{children}</button>;
}

function InputField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function EmptyState({ text }) {
  return <div style={{ textAlign: "center", padding: "32px", color: COLORS.textMuted, fontSize: 14 }}>— {text} —</div>;
}

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14, color: COLORS.text, background: "#FAFBFC", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
