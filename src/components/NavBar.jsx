import { ctaHref, navLinks } from "../constants";

const NavBar = () => (
  <header className="site-header">
    <nav>
      <a className="wordmark" href="#top" aria-label="WindCore home">
        <span>W</span>
        WindCore
      </a>

      <ul>
        {navLinks.map(({ label, href }) => (
          <li key={label}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>

      <a className="nav-cta" href={ctaHref}>
        Pitch deck
      </a>
    </nav>
  </header>
);

export default NavBar;
