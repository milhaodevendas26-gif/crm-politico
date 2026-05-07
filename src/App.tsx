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
import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Tab = 'dashboard' | 'voters' | 'volunteers' | 'events' | 'donations' | 'tasks' | 'heatmap';

interface Supporter {
  id: string;
  name: string;
  neighborhood: string;
  status: 'confirmed' | 'in-conversation' | 'critical' | 'undecided' | 'apoiador' | 'indeciso' | 'oposição';
  image: string;
  phone?: string;
  email?: string;
  zone?: string;
  section?: string;
  interests?: string[];
  notes?: string;
  lider?: string;
  score?: number;
  tags?: string[];
}

interface Volunteer {
  id: string;
  name: string;
  role: string;
  bairro: string;
  phone: string;
  tasks: number;
  status: 'ativo' | 'inativo';
}

interface Event {
  id: string;
  title: string;
  date: string;
  local: string;
  tipo: 'caminhada' | 'reunião' | 'carreata' | 'debate' | 'panfletagem' | 'comício';
  confirmados: number;
  status: 'agendado' | 'realizado';
}

interface Donation {
  id: string;
  donor: string;
  value: number;
  date: string;
  method: 'pix' | 'transferência' | 'dinheiro' | 'cheque';
  status: 'confirmado' | 'pendente';
}

interface CampaignTask {
  id: string;
  title: string;
  resp: string;
  due: string;
  priority: 'alta' | 'média' | 'baixa';
  done: boolean;
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
  { id: '1', name: 'Ana Silveira', neighborhood: 'Mecejana', status: 'confirmed', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Ricardo Mendes', neighborhood: 'Pricumã', status: 'in-conversation', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Carla Santos', neighborhood: 'Paraviana', status: 'critical', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { id: '4', name: 'Marcos Oliveira', neighborhood: 'Centro', status: 'undecided', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: '5', name: 'Beatriz Lima', neighborhood: 'Caçari', status: 'confirmed', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: '6', name: 'José Augusto', neighborhood: 'Liberdade', status: 'undecided', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
];

const TASKS: Task[] = [
  { id: '1', title: 'Caminhada - Mecejana', description: 'Meta: 5.000 panfletos', priority: 'high', expiry: '4h', team: 'Equipe BV-Sul', icon: Megaphone },
  { id: '2', title: 'Ligações: Doadores BV', description: 'Lista de 20 contatos', priority: 'medium', expiry: 'Dia todo', team: 'Captação', icon: Megaphone },
  { id: '3', title: 'Visitas: Bairro Pintolândia', description: 'Mapeamento de intenção', priority: 'active', expiry: 'Em andamento', team: 'Setor 5ª Zona', icon: MapPin },
];

const TEAMS: Team[] = [
  { id: '1', name: 'Alpha - Mecejana', members: 12, status: 'online', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Bravo - Paraviana', members: 8, status: 'online', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'Charlie - Centro', members: 5, status: 'offline', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=150' },
];

// --- Components ---

const StatusBadge = ({ status }: { status: Supporter['status'] }) => {
  const configs = {
    confirmed: { color: 'text-secondary bg-secondary/10', label: 'Apoiador Confirmado', dot: 'bg-secondary' },
    apoiador: { color: 'text-secondary bg-secondary/10', label: 'Apoiador Confirmado', dot: 'bg-secondary' },
    'in-conversation': { color: 'text-primary bg-primary/10', label: 'Em Conversa', dot: 'bg-primary' },
    indeciso: { color: 'text-on-surface-variant bg-white/5', label: 'Indeciso', dot: 'bg-outline' },
    undecided: { color: 'text-on-surface-variant bg-white/5', label: 'Indeciso', dot: 'bg-outline' },
    critical: { color: 'text-error bg-error/10', label: 'Oposição', dot: 'bg-error' },
    oposição: { color: 'text-error bg-error/10', label: 'Oposição', dot: 'bg-error' },
  };

  const config = configs[status] || configs['undecided'];

  return (
    <div className={`flex items-center justify-between mt-auto pt-4 border-t border-white/5`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className={`text-label-md font-bold uppercase tracking-wider ${config.color.split(' ')[0]}`}>{config.label}</span>
      </div>
      <MoreVertical className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-on-surface" />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [tasks, setTasks] = useState<CampaignTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/supporters');
        if (response.status === 503) {
          const data = await response.json();
          setConfigError(data.message);
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSupporters(data);
        
        // Mocking other data for now as per user code structure
        setVolunteers([
          { id: '1', name: 'João Pedro', role: 'Líder de Bairro', bairro: 'Centro', phone: '95981001001', tasks: 12, status: 'ativo' },
          { id: '2', name: 'Ana Lima', role: 'Coordenadora', bairro: 'Pricumã', phone: '95982002002', tasks: 8, status: 'ativo' },
          { id: '3', name: 'Pedro Souza', role: 'Líder de Bairro', bairro: 'Caçari', phone: '95983003003', tasks: 15, status: 'ativo' },
        ]);
        setEvents([
          { id: '1', title: 'Caminhada no Centro', date: '2026-05-15', local: 'Praça do Centro', tipo: 'caminhada', confirmados: 120, status: 'agendado' },
          { id: '2', title: 'Reunião com Líderes', date: '2026-05-10', local: 'Comitê Central', tipo: 'reunião', confirmados: 18, status: 'agendado' },
        ]);
        setDonations([
          { id: '1', donor: 'Empresa ABC', value: 5000, date: '2026-04-10', method: 'transferência', status: 'confirmado' },
          { id: '2', donor: 'José Ferreira', value: 500, date: '2026-04-15', method: 'pix', status: 'confirmado' },
        ]);
        setTasks([
          { id: '1', title: 'Ligar para líderes de Pricumã', resp: 'Ana Lima', due: '2026-05-08', priority: 'alta', done: false },
          { id: '2', title: 'Imprimir 500 santinhos', resp: 'João Pedro', due: '2026-05-12', priority: 'média', done: false },
        ]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addVoter = async (voter: Omit<Supporter, 'id'>) => {
    try {
      const response = await fetch('/api/supporters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voter),
      });

      if (!response.ok) throw new Error('Failed to save voter');
      
      const newVoter = await response.json();
      setSupporters(prev => [newVoter, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving voter:', error);
      alert('Erro ao salvar eleitor. Verifique sua conexão e tente novamente.');
    }
  };

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
          {activeTab === 'dashboard' && <Dashboard key="dashboard" supporters={supporters} volunteers={volunteers} events={events} donations={donations} tasks={tasks} />}
          {activeTab === 'voters' && (
            <Voters 
              key="voters" 
              supporters={supporters} 
              onAddClick={() => setIsModalOpen(true)} 
              isLoading={isLoading} 
              configError={configError}
            />
          )}
          {activeTab === 'heatmap' && <Heatmap key="heatmap" />}
          {activeTab === 'volunteers' && <VolunteersScreen key="volunteers" volunteers={volunteers} />}
          {activeTab === 'events' && <EventsScreen key="events" events={events} />}
          {activeTab === 'donations' && <DonationsScreen key="donations" donations={donations} />}
          {activeTab === 'tasks' && <TasksScreen key="tasks" tasks={tasks} volunteers={volunteers} />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface-dim/90 backdrop-blur-xl border-t border-white/5 flex flex-wrap justify-around items-center px-1 py-3 z-50">
        <NavItem active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Painel" onClick={() => setActiveTab('dashboard')} />
        <NavItem active={activeTab === 'voters'} icon={Users} label="Eleitores" onClick={() => setActiveTab('voters')} />
        <NavItem active={activeTab === 'volunteers'} icon={Heart} label="Equipe" onClick={() => setActiveTab('volunteers')} />
        <NavItem active={activeTab === 'events'} icon={Clock} label="Agenda" onClick={() => setActiveTab('events')} />
        <NavItem active={activeTab === 'donations'} icon={TrendingUp} label="Finanças" onClick={() => setActiveTab('donations')} />
        <NavItem active={activeTab === 'tasks'} icon={Briefcase} label="Missões" onClick={() => setActiveTab('tasks')} />
        <NavItem active={activeTab === 'heatmap'} icon={MapIcon} label="Mapa" onClick={() => setActiveTab('heatmap')} />
      </nav>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <VoterRegistrationModal 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={addVoter} 
          />
        )}
      </AnimatePresence>
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

function Dashboard({ supporters, volunteers, events, donations, tasks }: { supporters: Supporter[], volunteers: Volunteer[], events: Event[], donations: Donation[], tasks: CampaignTask[], key?: string }) {
  const confirmed = supporters.filter(s => s.status === 'confirmed' || s.status === 'apoiador').length;
  const totalArrecadado = donations.filter(d => d.status === 'confirmado').reduce((acc, d) => acc + d.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      className="p-4 space-y-6 max-w-6xl mx-auto"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MAPEAMENTO" value={supporters.length.toString()} trend={`+${confirmed} confirmados`} trendColor="text-secondary" />
        <MetricCard label="VOLUNTÁRIOS" value={volunteers.filter(v => v.status === 'ativo').length.toString()} trend="Equipe Ativa" trendColor="text-secondary" />
        <MetricCard label="ARRECADADO" value={`R$ ${totalArrecadado.toLocaleString('pt-BR')}`} trend="Doações 2026" trendColor="text-secondary" />
        <MetricCard label="MISSÕES" value={tasks.filter(t => !t.done).length.toString()} trend="Ação Imediata" trendColor="text-error" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface-container border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-headline-md font-bold text-white tracking-tight">Potencial por Bairro</h3>
          </div>
          <div className="space-y-4">
            <ZoneItem label="Mecejana" count={`${supporters.filter(s => s.neighborhood === 'Mecejana').length} eleitores`} percent="40%" color="primary" />
            <ZoneItem label="Pricumã" count={`${supporters.filter(s => s.neighborhood === 'Pricumã').length} eleitores`} percent="25%" color="secondary" />
            <ZoneItem label="Caçari" count={`${supporters.filter(s => s.neighborhood === 'Caçari').length} eleitores`} percent="35%" color="tertiary-container" />
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container border border-white/5 rounded-[32px] p-8 shadow-2xl flex flex-col">
          <h3 className="text-headline-md font-bold text-white mb-8 tracking-tight">Próximos Eventos</h3>
          <div className="space-y-6 flex-grow">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-primary/10 text-primary flex flex-col items-center justify-center rounded-xl font-bold">
                  <span className="text-[10px] leading-none uppercase">{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  <span className="text-xl leading-none">{new Date(event.date + 'T12:00:00').getDate()}</span>
                </div>
                <div>
                  <p className="text-body-md font-bold text-white group-hover:text-primary transition-colors">{event.title}</p>
                  <p className="text-body-sm text-on-surface-variant opacity-70">{event.local} · {event.confirmados} cnf</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Voters({ supporters, onAddClick, isLoading, configError }: { supporters: Supporter[], onAddClick: () => void, isLoading: boolean, configError: string | null, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-headline-lg font-bold text-white tracking-tight">Base de Apoio: Boa Vista</h2>
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
                    placeholder="Buscar por nome, bairro (Ex: Mecejana)..." 
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-body-md text-white shadow-inner"
                  />
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  <Chip label="Todos" active />
                  <Chip label="Bairro: Mecejana" />
                  <Chip label="Zona: 1ª" />
                  <Chip label="Interesse: Educação" />
                </div>
              </div>

      {configError ? (
        <div className="bg-error/10 border border-error/20 rounded-[32px] p-12 text-center">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Configuração Necessária</h3>
          <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">{configError}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Criar Projeto Supabase
            </a>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">Carregando apoiadores...</p>
        </div>
      ) : supporters.length === 0 ? (
        <div className="bg-surface-container border border-dashed border-white/10 rounded-[32px] p-12 text-center">
          <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum apoiador encontrado</h3>
          <p className="text-on-surface-variant mb-8 max-w-xs mx-auto">Comece sua base cadastrando o primeiro eleitor agora mesmo.</p>
          <button 
            onClick={onAddClick}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Cadastrar Primeiro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supporters.map(supporter => (
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
      )}

      <button 
        onClick={onAddClick}
        className="fixed bottom-28 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white/10"
      >
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
                <h2 className="text-headline-md font-bold text-white mt-1">1ª Zona Eleitoral - RR</h2>
              </div>
              <div className="bg-secondary/20 text-secondary px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-secondary/20 shadow-glow shadow-secondary/10">
                BOA VISTA / RR
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

function VolunteersScreen({ volunteers }: { volunteers: Volunteer[], key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-headline-lg font-bold text-white">Equipe de Voluntários</h2>
        <button className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map(volunteer => (
          <div key={volunteer.id} className="bg-surface-container border border-white/5 rounded-3xl p-6 hover:ring-2 hover:ring-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
                {volunteer.name[0]}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${volunteer.status === 'ativo' ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                {volunteer.status}
              </span>
            </div>
            <h4 className="text-headline-md font-bold text-white">{volunteer.name}</h4>
            <p className="text-body-sm text-on-surface-variant opacity-70">{volunteer.role} · {volunteer.bairro}</p>
            <div className="mt-6 flex items-center justify-between text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
              <span>{volunteer.tasks} Missões</span>
              <span>{volunteer.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EventsScreen({ events }: { events: Event[], key?: string }) {
  const tipoColors = { caminhada: 'text-secondary', reunião: 'text-primary', carreata: 'text-tertiary', debate: 'text-error', panfletagem: 'text-on-surface', comício: 'text-primary' };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <h2 className="text-headline-lg font-bold text-white">Agenda Eleitoral</h2>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-surface-container border border-white/5 rounded-[32px] p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:bg-white/5 transition-all">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex flex-col items-center justify-center font-bold border border-white/5 shadow-inner">
              <span className="text-xs uppercase text-on-surface-variant">{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
              <span className="text-2xl text-white">{new Date(event.date + 'T12:00:00').getDate()}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-headline-md font-bold text-white">{event.title}</h4>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border border-white/5 bg-white/5 ${tipoColors[event.tipo]}`}>
                  {event.tipo}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant opacity-70">{event.local} · {event.confirmados} Confirmados</p>
            </div>
            <button className={`px-6 py-3 rounded-2xl font-bold text-label-md uppercase tracking-widest border transition-all ${event.status === 'agendado' ? 'border-primary text-primary hover:bg-primary hover:text-white' : 'bg-secondary/10 border-secondary/20 text-secondary'}`}>
              {event.status === 'agendado' ? 'Confirmar' : 'Realizado'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DonationsScreen({ donations }: { donations: Donation[], key?: string }) {
  const total = donations.filter(d => d.status === 'confirmado').reduce((acc, d) => acc + d.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="TOTAL ARRECADADO" value={`R$ ${total.toLocaleString('pt-BR')}`} trend="Confirmado" trendColor="text-secondary" />
        <MetricCard label="PIX" value="85%" trend="Método Preferencial" trendColor="text-primary" />
        <MetricCard label="PENDENTE" value={`R$ ${donations.filter(d => d.status === 'pendente').reduce((acc, d) => acc + d.value, 0).toLocaleString('pt-BR')}`} trend="Em Processamento" trendColor="text-error" />
      </div>

      <section className="bg-surface-container border border-white/5 rounded-[32px] overflow-hidden">
        <div className="px-8 py-5 border-b border-white/5 bg-white/5">
          <h2 className="text-headline-md font-bold text-white">Extrato de Arrecadação</h2>
        </div>
        <div className="divide-y divide-white/5">
          {donations.map(donation => (
            <div key={donation.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-md font-bold text-white">{donation.donor}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">{donation.method} · {donation.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-headline-md font-bold text-secondary">+ R$ {donation.value.toLocaleString('pt-BR')}</p>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${donation.status === 'confirmado' ? 'text-secondary' : 'text-error'}`}>
                  {donation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function TasksScreen({ tasks, volunteers }: { tasks: CampaignTask[], volunteers: Volunteer[], key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-4 space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-headline-lg font-bold text-white">Missões da Equipe</h2>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
          Adicionar Missão
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className={`bg-surface-container border border-white/5 rounded-[32px] p-6 flex items-center gap-6 transition-all ${task.done ? 'opacity-50 grayscale' : 'hover:scale-[1.01]'}`}>
            <button className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.done ? 'bg-secondary border-secondary' : 'border-white/10 hover:border-primary'}`}>
              {task.done && <CheckCircle2 className="w-5 h-5 text-white" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className={`text-headline-md font-bold text-white ${task.done ? 'line-through' : ''}`}>{task.title}</h4>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${task.priority === 'alta' ? 'bg-error/10 border-error/20 text-error' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant opacity-70">Responsável: {task.resp} · Prazo: {task.due}</p>
            </div>
            <MoreVertical className="w-6 h-6 text-on-surface-variant" />
          </div>
        ))}
      </div>
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

const VoterRegistrationModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (voter: Omit<Supporter, 'id'>) => void }) => {
  const [formData, setFormData] = useState<Omit<Supporter, 'id'>>({
    name: '',
    neighborhood: '',
    status: 'undecided',
    phone: '',
    email: '',
    zone: '',
    section: '',
    interests: [],
    notes: '',
    lider: '',
    score: 0,
    tags: [],
    image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=150`
  });

  const availableInterests = ['Educação', 'Saúde', 'Segurança', 'Transporte', 'Saneamento', 'Cultura', 'Esporte'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.neighborhood) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-surface-dim/90 backdrop-blur-md flex items-center justify-center z-[100] p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-surface-container border border-white/10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-surface-container/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-headline-lg font-bold text-white tracking-tight">Novo Mapeamento</h2>
            <p className="text-body-sm text-on-surface-variant opacity-70 uppercase tracking-widest font-black">Cadastro Manual de Inteligência</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <Plus className="w-6 h-6 rotate-45 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Nome Completo</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                type="text" placeholder="Nome Completo" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Bairro / Localidade</label>
              <input 
                required
                value={formData.neighborhood}
                onChange={e => setFormData(p => ({ ...p, neighborhood: e.target.value }))}
                type="text" placeholder="Ex: Mecejana" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Telefone (WhatsApp)</label>
              <input 
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                type="tel" placeholder="(95) 9" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Status de Engajamento</label>
              <select 
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-white appearance-none"
              >
                <option value="undecided">Indeciso</option>
                <option value="confirmed">Apoiador Confirmado</option>
                <option value="in-conversation">Em Conversa</option>
                <option value="critical">Oposição / Crítico</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Principais Interesses</h4>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.interests?.includes(interest)
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white/5 text-on-surface-variant border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">Notas de Inteligência</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Observações importantes sobre o eleitor..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none text-white h-32 resize-none"
            />
          </div>

          <button className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-label-md shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest">
            Confirmar Mapeamento
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
