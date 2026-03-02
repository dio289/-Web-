import { FormEvent, useMemo, useState } from 'react';
import { articleCards, seedPets, seedPosts } from './data';
import { usePersistentState } from './hooks/usePersistentState';
import { AdoptionApplication, ApplicationStatus, CommunityPost, Donation, Pet, Volunteer } from './types';

const sections = ['首页', '领养中心', '审核中心', '志愿者', '捐赠公示', '社区互动'] as const;
type Section = (typeof sections)[number];

export function App() {
  const [active, setActive] = useState<Section>('首页');
  const [pets, setPets] = usePersistentState<Pet[]>('pets', seedPets);
  const [applications, setApplications] = usePersistentState<AdoptionApplication[]>('applications', []);
  const [volunteers, setVolunteers] = usePersistentState<Volunteer[]>('volunteers', []);
  const [donations, setDonations] = usePersistentState<Donation[]>('donations', []);
  const [posts, setPosts] = usePersistentState<CommunityPost[]>('posts', seedPosts);

  const [cityFilter, setCityFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) ?? null;
  const availablePets = useMemo(() => {
    return pets
      .filter((pet) => !pet.adopted)
      .filter((pet) => (cityFilter === '全部' ? true : pet.city === cityFilter))
      .filter((pet) => (typeFilter === '全部' ? true : pet.type === typeFilter))
      .filter((pet) => `${pet.name}${pet.story}${pet.temperament}`.includes(keyword.trim()))
      .sort((a, b) => (a.urgency === '高' ? -1 : b.urgency === '高' ? 1 : 0));
  }, [pets, cityFilter, typeFilter, keyword]);

  const donationSum = donations.reduce((sum, d) => sum + d.amount, 0);
  const adoptionRate = pets.length ? Math.round((pets.filter((p) => p.adopted).length / pets.length) * 100) : 0;

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPet) return;

    const form = new FormData(event.currentTarget);
    const app: AdoptionApplication = {
      id: Date.now(),
      petId: selectedPet.id,
      petName: selectedPet.name,
      applicant: String(form.get('applicant') || ''),
      phone: String(form.get('phone') || ''),
      housing: String(form.get('housing') || ''),
      experience: String(form.get('experience') || ''),
      hasFamilyConsent: Boolean(form.get('hasFamilyConsent')),
      canAffordMedical: Boolean(form.get('canAffordMedical')),
      acceptVisit: Boolean(form.get('acceptVisit')),
      createdAt: new Date().toLocaleString('zh-CN'),
      status: '待审核'
    };

    if (!app.hasFamilyConsent || !app.canAffordMedical || !app.acceptVisit) {
      window.alert('请勾选全部领养责任承诺项后再提交。');
      return;
    }

    setApplications((prev) => [app, ...prev]);
    event.currentTarget.reset();
  };

  const changeAppStatus = (id: number, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));

    if (status === '通过') {
      const target = applications.find((app) => app.id === id);
      if (!target) return;
      setPets((prev) => prev.map((pet) => (pet.id === target.petId ? { ...pet, adopted: true } : pet)));
    }
  };

  const submitVolunteer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: Volunteer = {
      id: Date.now(),
      name: String(form.get('name') || ''),
      city: String(form.get('city') || ''),
      skills: String(form.get('skills') || ''),
      availability: String(form.get('availability') || ''),
      hasPetExperience: Boolean(form.get('hasPetExperience'))
    };
    setVolunteers((prev) => [item, ...prev]);
    event.currentTarget.reset();
  };

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount') || 0);
    if (!Number.isFinite(amount) || amount <= 0) return;

    const item: Donation = {
      id: Date.now(),
      donor: String(form.get('donor') || '匿名爱心人士'),
      amount,
      usage: (String(form.get('usage')) as Donation['usage']) || '医疗救助',
      message: String(form.get('message') || ''),
      date: new Date().toLocaleDateString('zh-CN')
    };
    setDonations((prev) => [item, ...prev]);
    event.currentTarget.reset();
  };

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const content = String(form.get('content') || '');
    if (!content.trim()) return;
    const item: CommunityPost = {
      id: Date.now(),
      author: String(form.get('author') || '匿名用户'),
      topic: (String(form.get('topic')) as CommunityPost['topic']) || '领养日常',
      content,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    setPosts((prev) => [item, ...prev]);
    event.currentTarget.reset();
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>公益领养平台</h1>
        <p>以透明流程连接救助机构、领养家庭与志愿者，让每一份善意都可追踪。</p>
        <div className="metrics">
          <div><strong>{pets.filter((p) => !p.adopted).length}</strong><span>待领养</span></div>
          <div><strong>{applications.length}</strong><span>申请总量</span></div>
          <div><strong>{adoptionRate}%</strong><span>领养完成率</span></div>
          <div><strong>¥{donationSum}</strong><span>累计捐赠</span></div>
        </div>
      </header>

      <nav className="tabs">
        {sections.map((sec) => (
          <button key={sec} className={active === sec ? 'active' : ''} onClick={() => setActive(sec)}>{sec}</button>
        ))}
      </nav>

      <main className="panel">
        {active === '首页' && (
          <section className="grid3">
            {articleCards.map((card) => (
              <article key={card.title} className="card"><h3>{card.title}</h3><p>{card.content}</p></article>
            ))}
          </section>
        )}

        {active === '领养中心' && (
          <section>
            <div className="filters">
              <input placeholder="搜索名字/故事/性格关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="全部">全部城市</option>
                {[...new Set(pets.map((p) => p.city))].map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="全部">全部类型</option><option value="猫咪">猫咪</option><option value="狗狗">狗狗</option>
              </select>
            </div>

            <div className="grid2">
              <div className="list">
                {availablePets.map((pet) => (
                  <button key={pet.id} className="listItem" onClick={() => setSelectedPetId(pet.id)}>
                    <h3>{pet.name} <span className={`urgency ${pet.urgency}`}>{pet.urgency}优先</span></h3>
                    <p>{pet.type} · {pet.age} · {pet.city}</p>
                    <small>{pet.health}</small>
                  </button>
                ))}
                {!availablePets.length && <p>当前筛选条件暂无可领养动物。</p>}
              </div>

              <article className="card">
                <h3>{selectedPet ? `${selectedPet.name} 领养申请` : '请选择动物后填写申请'}</h3>
                {selectedPet && (
                  <>
                    <p>救助时间：{selectedPet.rescuedAt}</p>
                    <p>性格：{selectedPet.temperament}</p>
                    <p>故事：{selectedPet.story}</p>
                    <form onSubmit={submitApplication} className="form">
                      <input name="applicant" placeholder="申请人姓名" required />
                      <input name="phone" placeholder="联系电话" required />
                      <input name="housing" placeholder="居住情况（自有/租房）" required />
                      <textarea name="experience" placeholder="过往养宠经验与领养动机" required />
                      <label><input type="checkbox" name="hasFamilyConsent" /> 家庭成员已充分沟通并同意领养</label>
                      <label><input type="checkbox" name="canAffordMedical" /> 能承担疫苗、绝育和常规医疗成本</label>
                      <label><input type="checkbox" name="acceptVisit" /> 同意家访与回访，接受不当饲养追责</label>
                      <button type="submit">提交申请</button>
                    </form>
                  </>
                )}
              </article>
            </div>
          </section>
        )}

        {active === '审核中心' && (
          <section className="list">
            {applications.map((app) => (
              <article className="card" key={app.id}>
                <h3>{app.petName} · {app.applicant}</h3>
                <p>提交时间：{app.createdAt}</p>
                <p>联系：{app.phone}｜居住：{app.housing}</p>
                <p>经验：{app.experience}</p>
                <p>状态：<b>{app.status}</b></p>
                <div className="actions">
                  <button onClick={() => changeAppStatus(app.id, '家访中')}>标记家访中</button>
                  <button onClick={() => changeAppStatus(app.id, '通过')}>通过</button>
                  <button onClick={() => changeAppStatus(app.id, '拒绝')}>拒绝</button>
                </div>
              </article>
            ))}
            {!applications.length && <p>暂无待审核申请。</p>}
          </section>
        )}

        {active === '志愿者' && (
          <section className="grid2">
            <form onSubmit={submitVolunteer} className="card form">
              <h3>志愿者报名</h3>
              <input name="name" placeholder="姓名" required />
              <input name="city" placeholder="城市" required />
              <input name="skills" placeholder="技能（救助/宣传/摄影）" required />
              <input name="availability" placeholder="可服务时间" required />
              <label><input type="checkbox" name="hasPetExperience" /> 有养宠或救助经验</label>
              <button type="submit">提交报名</button>
            </form>
            <div className="list">
              {volunteers.map((v) => (
                <article className="card" key={v.id}>
                  <h3>{v.name}</h3>
                  <p>{v.city} · {v.availability}</p>
                  <p>技能：{v.skills}</p>
                  <small>{v.hasPetExperience ? '有救助经验' : '可参与基础支持工作'}</small>
                </article>
              ))}
              {!volunteers.length && <p>暂无报名，期待你的加入。</p>}
            </div>
          </section>
        )}

        {active === '捐赠公示' && (
          <section className="grid2">
            <form onSubmit={submitDonation} className="card form">
              <h3>爱心捐赠</h3>
              <input name="donor" placeholder="捐赠人（可匿名）" />
              <input name="amount" type="number" min="1" placeholder="金额（元）" required />
              <select name="usage" defaultValue="医疗救助">
                <option value="医疗救助">医疗救助</option>
                <option value="临时寄养">临时寄养</option>
                <option value="绝育行动">绝育行动</option>
                <option value="科普宣传">科普宣传</option>
              </select>
              <textarea name="message" placeholder="给毛孩子的一句话" />
              <button type="submit">确认捐赠</button>
            </form>

            <div className="list">
              {donations.map((d) => (
                <article className="card" key={d.id}>
                  <h3>{d.donor} · ¥{d.amount}</h3>
                  <p>用途：{d.usage}</p>
                  <p>{d.message || '感谢你的善意。'}</p>
                  <small>{d.date}</small>
                </article>
              ))}
              {!donations.length && <p>暂无捐赠记录公示。</p>}
            </div>
          </section>
        )}

        {active === '社区互动' && (
          <section className="grid2">
            <form onSubmit={submitPost} className="card form">
              <h3>发布社区内容</h3>
              <input name="author" placeholder="昵称" />
              <select name="topic" defaultValue="领养日常">
                <option value="领养日常">领养日常</option>
                <option value="救助故事">救助故事</option>
                <option value="科学养宠">科学养宠</option>
              </select>
              <textarea name="content" placeholder="分享你的故事与经验" required />
              <button type="submit">发布</button>
            </form>

            <div className="list">
              {posts.map((p) => (
                <article className="card" key={p.id}>
                  <h3>{p.author} · {p.topic}</h3>
                  <p>{p.content}</p>
                  <small>{p.createdAt}</small>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
