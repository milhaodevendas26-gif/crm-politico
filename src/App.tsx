import { 
  Users, 
  LayoutDashboard, 
  Map as MapIcon, 
  Heart, 
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Briefcase,
  ChevronRight,
  TrendingUp,
  MapPin,
  Megaphone,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Tab = 'dashboard' | 'voters' | 'heatmap' | 'volunteers';

interface Supporter {
  id: string;
  name: string;
  neighborhood: string;
  status: 'confirmed' | 'in-conversation' | 'critical' | 'undecided';
  image: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'active';
  expiry: string;
  team: string;
  icon: any;
}

interface Team {
  id: string;
  name: string;
  members: number;
  status: 'online' | 'offline';
  image: string;
}

// --- Mock Data ---
const SUPPORTERS: Supporter[] = [
  { id: '1', name: 'Ana Silveira', neighborhood: 'Vila Nova', status: 'confirmed', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Ricardo Mendes', neighborhood: 'Industrial', status: 'in-conversation', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Carla Santos', neighborhood: 'Jardim América', status: 'critical', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { id: '4', name: 'Marcos Oliveira', neighborhood: 'Centro', status: 'undecided', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: '5', name: 'Beatriz Lima', neighborhood: 'Bela Vista', status: 'confirmed', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: '6', name: 'José Augusto', neighborhood: 'Santa Cruz', status: 'undecided', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
];

const TASKS: Task[] = [
  { id: '1', title: 'Panfletagem - Centro', description: 'Meta: 5.000 panfletos', priority: 'high', expiry: '4h', team: 'Equipe Sul', icon: Megaphone },
  { id: '2', title: 'Ligações: Doadores', description: 'Lista de 20 contatos', priority: 'medium', expiry: 'Dia todo', team: 'Captação', icon: Megaphone },
  { id: '3', title: 'Visitas: Bairro Flores', description: 'Mapeamento de intenção', priority: 'active', expiry: 'Em andamento', team: 'Zona Sul - Setor 4', icon: MapPin },
];

const TEAMS: Team[] = [
  { id: '1', name: 'Alpha - Sul', members: 12, status: 'online', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Bravo - Digital', members: 8, status: 'online', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Charlie - Centro', members: 5, status: 'offline', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=150' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Supporter['status'] }) => {
  const configs = {
    confirmed: { color: 'text-secondary bg-secondary/10', shadow: 'shadow-secondary/20', label: 'Apoiador Confirmado', dot: 'bg-secondary', icon: CheckCircle2 },
    'in-conversation': { color: 'text-primary bg-primary/10', shadow: 'shadow-primary/20', label: 'Em Conversa', dot: 'bg-primary', icon: TrendingUp },
    critical: { color: 'text-error bg-error/10', shadow: 'shadow-error/20', label: 'Crítico / Oposição', dot: 'bg-error', icon: AlertCircle },
    undecided: { color: 'text-on-surface-variant bg-white/5', shadow: 'shadow-none', label: 'Indeciso', dot: 'bg-outline', icon: HelpCircle },
  };

  const { color, label, dot, shadow } = configs[status];

  return (
    <div className={`flex items-center justify-between mt-auto pt-4 border-t border-white/5`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot} shadow-[0_0_8px] ${shadow}`} />
        <span className={`text-label-md font-bold uppercase tracking-wider ${color.split(' ')[0]}`}>{label}</span>
      </div>
      <MoreVertical className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-on-surface" />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Top App Bar */}
      <header className="bg-surface-dim/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-5 h-5 border-2 border-white rounded-sm" />
          </div>
          <div>
            <h1 className="text-headline-md font-bold text-white tracking-tight leading-none">Meta</h1>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1 opacity-60">Unidade de Operações v2.4</p>
          </div>
        </div>
        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-white">
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
          {activeTab === 'voters' && <Voters key="voters" />}
          {activeTab === 'heatmap' && <Heatmap key="heatmap" />}
          {activeTab === 'volunteers' && <Volunteers key="volunteers" />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-dim/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-2 py-4 z-50">
        <NavItem active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Painel" onClick={() => setActiveTab('dashboard')} />
        <NavItem active={activeTab === 'voters'} icon={Users} label="Eleitores" onClick={() => setActiveTab('voters')} />
        <NavItem active={activeTab === 'heatmap'} icon={MapIcon} label="Mapa" onClick={() => setActiveTab('heatmap')} />
        <NavItem active={activeTab === 'volunteers'} icon={Heart} label="Voluntários" onClick={() => setActiveTab('volunteers')} />
      </nav>
    </div>
  );
}

const NavItem = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all duration-300 py-1 px-4 rounded-xl ${
      active 
        ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' 
        : 'text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-white/5'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'fill-primary/20' : ''}`} />
    <span className="text-[10px] font-bold uppercase tracking-widest mt-1.5">{label}</span>
  </button>
);

// --- Sub-Screens ---

function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      className="p-4 space-y-6 max-w-6xl mx-auto"
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="TOTAL DE ELEITORES" value="124.892" trend="+2.4%" trendColor="text-secondary" />
        <MetricCard label="ENGAJAMENTO" value="68.5%" trend="Ativo" trendColor="text-secondary" isBarChart />
        <MetricCard label="INTENÇÃO DE VOTO" value="42.1%" trend="-0.8%" trendColor="text-error" hasTarget target="Meta: 50%" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface-container border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-headline-md font-bold text-white tracking-tight">Distribuição por Zona</h3>
            <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Filter className="w-5 h-5 text-on-surface-variant cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="2.5" strokeDasharray="40 100" strokeLinecap="round" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="2.5" strokeDasharray="25 100" strokeDashoffset="-40" strokeLinecap="round" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-tertiary-container" strokeWidth="2.5" strokeDasharray="35 100" strokeDashoffset="-65" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-lg text-white font-bold drop-shadow-lg">100%</span>
                <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-3 w-full">
              <ZoneItem label="Zona Central" count="49.957 eleitores" percent="40%" color="primary" />
              <ZoneItem label="Zona Norte" count="31.223 eleitores" percent="25%" color="secondary" />
              <ZoneItem label="Zona Sul" count="43.712 eleitores" percent="35%" color="tertiary-container" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container border border-white/5 rounded-[32px] p-8 shadow-2xl flex flex-col">
          <h3 className="text-headline-md font-bold text-white mb-8 tracking-tight">Atividades Recentes</h3>
          <div className="space-y-8 flex-grow">
            <ActivityItem icon={Megaphone} content="Caminhada agendada em Vila Nova para amanhã." time="Há 10 min" color="bg-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            <ActivityItem icon={Users} content="15 novos voluntários integrados pela equipe Norte." time="Há 2 h" color="bg-secondary shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
            <ActivityItem icon={TrendingUp} content="Relatório semanal: Aumento de 5% no tom positivo." time="Há 5 h" color="bg-tertiary-container shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
          </div>
          <button className="w-full text-white font-bold text-label-md py-5 border-t border-white/5 mt-8 hover:text-primary transition-all uppercase tracking-widest">
            Fluxo de Atividades
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Voters() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-headline-lg font-bold text-white tracking-tight">Gestão de Apoiadores</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-label-md hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-label-md hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nome, bairro ou zona..." 
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-body-md text-white shadow-inner"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <Chip label="Todos" active />
          <Chip label="Bairro: Centro" />
          <Chip label="Zona: 12ª" />
          <Chip label="Interesse: Educação" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUPPORTERS.map(supporter => (
          <div key={supporter.id} className="bg-surface-container border border-white/5 rounded-3xl p-6 flex flex-col hover:ring-2 hover:ring-primary/20 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img src={supporter.image} alt={supporter.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg" />
                <div>
                  <h4 className="text-headline-md font-bold text-white leading-tight">{supporter.name}</h4>
                  <p className="text-body-sm text-on-surface-variant opacity-70">Bairro: {supporter.neighborhood}</p>
                </div>
              </div>
              {supporter.status === 'confirmed' && (
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
              )}
            </div>
            <StatusBadge status={supporter.status} />
          </div>
        ))}
      </div>

      <button className="fixed bottom-28 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white/10">
        <UserPlus className="w-8 h-8" />
      </button>
    </motion.div>
  );
}

function Heatmap() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-160px)] relative overflow-hidden flex flex-col"
    >
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
        <div className="bg-surface-container/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex shadow-2xl">
          <button className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-bold text-label-md shadow-lg shadow-primary/20 transition-all">
            Intenção de Voto
          </button>
          <button className="flex-1 py-3 px-6 rounded-full text-on-surface-variant font-bold text-label-md hover:bg-white/5 transition-all">
            Total de Eleitores
          </button>
        </div>
      </div>

      <div className="flex-grow w-full relative bg-surface-dim">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
          alt="Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-75 contrast-[0.8] grayscale-[0.2]"
        />
        
        {/* Heatmap Overlays */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full delay-700 animate-pulse" />
        
        {/* Detail Card Overlay */}
        <div className="absolute bottom-8 left-4 z-30 w-[calc(100%-2rem)] max-w-sm">
          <div className="bg-surface-container border border-white/10 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Zona Selecionada</span>
                <h2 className="text-headline-md font-bold text-white mt-1">Zona Eleitoral 342</h2>
              </div>
              <div className="bg-secondary/20 text-secondary px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-secondary/20 shadow-glow shadow-secondary/10">
                ALTA DENSIDADE
              </div>
            </div>
            <div className="space-y-4 relative z-10">
              <DataRow label="Apoiadores" value="12.482" />
              <DataRow label="Intenção de Voto" value="64.2%" valueColor="text-secondary" />
              <DataRow label="Votos Indecisos" value="2,150" valueColor="text-error" />
            </div>
            <div className="mt-8 relative z-10">
              <div className="flex justify-between text-label-sm font-bold mb-3 uppercase tracking-widest">
                <span className="text-on-surface-variant">Sentimento</span>
                <span className="text-secondary">Favorável</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{ width: '78%' }} />
              </div>
            </div>
            <button className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold text-label-md hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-widest">
              Detalhes Da Zona
            </button>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute right-6 bottom-8 flex flex-col gap-4 z-30">
          <MapButton icon={Plus} />
          <MapButton icon={Plus} isMinus />
          <MapButton icon={MapPin} />
        </div>
      </div>
    </motion.div>
  );
}

function Volunteers() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard label="Total de Voluntários" value="1.284" trend="+12% esta semana" trendColor="text-secondary" />
        <MetricCard label="Tarefas em Aberto" value="42" trend="8 urgentes" trendColor="text-error" />
      </div>

      <button className="w-full bg-primary text-white font-bold text-label-md py-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 border-2 border-white/10 uppercase tracking-[0.2em]">
        <Briefcase className="w-8 h-8" />
        DELEGAR NOVA TAREFA
      </button>

      <section className="bg-surface-container border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-headline-md font-bold text-white tracking-tight">Tarefas Pendentes</h2>
          <button className="text-primary font-bold text-label-md hover:brightness-110 uppercase tracking-widest">Ver tudo</button>
        </div>
        <div className="divide-y divide-white/5">
          {TASKS.map(task => (
            <div key={task.id} className="p-6 flex items-center gap-6 hover:bg-white/5 transition-all group cursor-pointer">
              <div className="p-4 bg-white/5 text-primary rounded-2xl transition-colors shrink-0 group-hover:bg-primary/10">
                <task.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-body-md font-bold text-white truncate tracking-wide">{task.title}</p>
                  <TaskPriorityBadge priority={task.priority} />
                </div>
                <p className="text-body-sm text-on-surface-variant truncate mt-1 opacity-70">{task.description}</p>
                <div className="mt-4 flex items-center gap-5 text-label-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-on-surface-variant"><Clock className="w-4 h-4" /> {task.expiry}</div>
                  <div className="flex items-center gap-2 text-on-surface-variant"><Users className="w-4 h-4" /> {task.team}</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-on-surface-variant group-hover:text-primary transform group-hover:translate-x-2 transition-all opacity-40 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h2 className="text-headline-md font-bold text-white tracking-tight">Status das Equipes</h2>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse" />
            <span className="text-label-sm font-bold text-white tracking-widest uppercase">82 Online</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {TEAMS.map(team => (
            <div key={team.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <img src={team.image} alt={team.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-surface-container rounded-full ${team.status === 'online' ? 'bg-secondary' : 'bg-on-surface-variant'}`} />
                </div>
                <div>
                  <p className="text-body-md font-bold text-white tracking-wide">{team.name}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-70">
                    {team.status === 'online' ? `${team.members} Membros ativos` : 'Offline desde 18:00'}
                  </p>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-on-surface-variant group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>
        <div className="p-6 bg-white/2">
          <button className="w-full py-4 border-2 border-dashed border-white/10 text-white/50 font-bold text-label-md rounded-2xl hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" /> CRIAR NOVA EQUIPE
          </button>
        </div>
      </section>
    </motion.div>
  );
}

// --- Helper Components ---

const MetricCard = ({ label, value, trend, trendColor, isBarChart, hasTarget, target }: any) => (
  <div className="bg-surface-container border border-white/5 p-6 rounded-[24px] shadow-xl flex flex-col justify-between relative overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
    <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-[0.15em] relative z-10">{label}</p>
    <div className="flex items-baseline gap-2 relative z-10">
      <h2 className="text-headline-xl text-white font-bold">{value}</h2>
      <span className={`text-label-sm font-bold ${trendColor} drop-shadow-sm`}>{trend}</span>
    </div>
    {isBarChart && (
      <div className="flex gap-2 mt-6 h-10 items-end relative z-10">
        {[20, 40, 30, 60, 70, 45, 90, 100].map((h, i) => (
          <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${i === 7 ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10 group-hover:bg-white/20'}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    )}
    {hasTarget && (
      <div className="flex items-center gap-4 mt-6 relative z-10">
        <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
          <div className="bg-secondary h-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: value }} />
        </div>
        <span className="text-label-sm font-bold text-white whitespace-nowrap">{target}</span>
      </div>
    )}
    {!isBarChart && !hasTarget && (
      <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden relative z-10">
        <div className="bg-primary h-full w-[75%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      </div>
    )}
  </div>
);

const ZoneItem = ({ label, count, percent, color }: any) => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    'tertiary-container': 'bg-tertiary-container'
  };
  return (
    <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors rounded-2xl group">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colorMap[color]} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
        <div>
          <p className="text-label-md font-bold text-white tracking-wide">{label}</p>
          <p className="text-body-sm text-on-surface-variant font-medium opacity-70">{count}</p>
        </div>
      </div>
      <span className={`font-bold text-2xl transition-transform group-hover:scale-110 ${color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-tertiary'}`}>
        {percent}
      </span>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, content, time, color }: any) => (
  <div className="flex gap-4 relative group">
    <div className="absolute left-[11px] top-6 bottom-[-24px] group-last:hidden w-[2px] bg-outline-variant" />
    <div className={`z-10 w-6 h-6 rounded-full ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
    <div>
      <p className="text-body-sm text-on-surface leading-tight">{content}</p>
      <span className="text-label-sm text-on-surface-variant uppercase font-bold">{time}</span>
    </div>
  </div>
);

const Chip = ({ label, active }: any) => (
  <button className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-bold border transition-all uppercase tracking-widest ${
    active 
      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
      : 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10'
  }`}>
    {label}
  </button>
);

const DataRow = ({ label, value, valueColor = 'text-on-surface' }: any) => (
  <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30 last:border-0">
    <span className="text-body-sm text-on-surface-variant font-medium">{label}</span>
    <span className={`text-body-md font-bold ${valueColor}`}>{value}</span>
  </div>
);

const MapButton = ({ icon: Icon, isMinus }: any) => (
  <button className="w-12 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
    {isMinus ? <span className="text-2xl font-bold leading-none">-</span> : <Icon className="w-6 h-6 text-on-surface" />}
  </button>
);

const TaskPriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
  const configs = {
    high: { color: 'bg-error/20 text-error border-error/20', label: 'Alta Prioridade' },
    medium: { color: 'bg-white/5 text-on-surface-variant border-white/10', label: 'Média' },
    active: { color: 'bg-secondary/20 text-secondary border-secondary/20', label: 'Ativo' },
  };
  const { color, label } = configs[priority];
  return <span className={`${color} border text-[8px] uppercase font-black px-2 py-1 rounded-md shrink-0 tracking-widest`}>{label}</span>;
};
