import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import WindCoreScrollytelling from "./components/WindCoreScrollytelling";
import {
  ctaHref,
  heroStats,
  orchestrationSteps,
  problemCards,
  provenancePoints,
  summaryCards,
} from "./constants";

const Hero = () => (
  <section className="hero-section" id="top">
    <div className="hero-copy">
      <p className="eyebrow">WindCore kinetic blueprint</p>
      <h1>Monetizing stranded renewable energy via compliance-grade compute.</h1>
      <p className="hero-lede">
        WindCore places containerized GPU capacity behind the meter at wind
        sites, turning physical renewable supply into auditable compute for
        batch-heavy workloads.
      </p>
      <div className="hero-actions">
        <a className="primary-cta" href={ctaHref}>
          Request the pitch deck
        </a>
        <a className="secondary-cta" href="#blueprint">
          Explore the blueprint
        </a>
      </div>
    </div>

    <div className="hero-blueprint" aria-label="WindCore supply to compute diagram">
      <div className="hero-wind">
        <span className="tower" />
        <span className="hub" />
        <span className="blade blade-a" />
        <span className="blade blade-b" />
        <span className="blade blade-c" />
      </div>
      <span className="hero-wire" />
      <div className="hero-chip">WC</div>
      <span className="hero-wire hero-wire-right" />
      <div className="hero-container">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>

    <div className="hero-stats">
      {heroStats.map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

const Problem = () => (
  <section className="section-shell" id="problem">
    <div className="section-heading">
      <p className="eyebrow">The market failure</p>
      <h2>Germany is curtailing wind while compute buyers need verifiable renewable execution.</h2>
    </div>

    <div className="problem-grid">
      {problemCards.map((card) => (
        <article className={`problem-card ${card.tone}`} key={card.title}>
          <p>{card.eyebrow}</p>
          <h3>{card.title}</h3>
          <span>{card.metric}</span>
          <small>{card.metricLabel}</small>
          <div />
          <p>{card.body}</p>
        </article>
      ))}
    </div>
  </section>
);

const Provenance = () => (
  <section className="section-shell provenance-section" id="provenance">
    <div className="section-heading">
      <p className="eyebrow">The edge</p>
      <h2>WindCore sells physical provenance and embedded auditability, not generic compute.</h2>
    </div>

    <div className="provenance-grid">
      {provenancePoints.map((point, index) => (
        <article key={point.title}>
          <span>0{index + 1}</span>
          <h3>{point.title}</h3>
          <p>{point.body}</p>
        </article>
      ))}
    </div>
  </section>
);

const Orchestration = () => (
  <section className="section-shell orchestration-section" id="orchestration">
    <div className="section-heading">
      <p className="eyebrow">The software layer</p>
      <h2>Orchestration turns intermittent wind into auditable batch compute.</h2>
    </div>

    <div className="orchestration-flow">
      {orchestrationSteps.map((step, index) => (
        <div key={step} className={index === orchestrationSteps.length - 1 ? "evidence" : ""}>
          <span>{index + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>

    <p className="flow-caption">
      The platform ingests operational signals and workload demand to make
      dispatch decisions. The byproduct is structured evidence that can support
      renewable Scope 2 reconciliation.
    </p>
  </section>
);

const Summary = () => (
  <section className="section-shell summary-section" id="summary">
    <div className="section-heading">
      <p className="eyebrow">Business model summary</p>
      <h2>A repeatable infrastructure pattern for compliance-ready compute.</h2>
    </div>

    <div className="summary-grid">
      {summaryCards.map((card) => (
        <article className={card.accent} key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
        </article>
      ))}
    </div>

    <div className="final-cta">
      <p>For the full economics, rollout cadence, and site-level model:</p>
      <a className="primary-cta" href={ctaHref}>
        Request the pitch deck
      </a>
    </div>
  </section>
);

const App = () => (
  <main>
    <NavBar />
    <Hero />
    <Problem />
    <WindCoreScrollytelling />
    <Provenance />
    <Orchestration />
    <Summary />
    <Footer />
  </main>
);

export default App;
