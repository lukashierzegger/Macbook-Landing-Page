import { ctaHref } from "../constants";

const Footer = () => (
  <footer className="site-footer">
    <div>
      <a className="wordmark" href="#top" aria-label="WindCore home">
        <span>W</span>
        WindCore
      </a>
      <p>
        Public blueprint teaser for compliance-grade compute built from physical
        renewable provenance.
      </p>
    </div>

    <a href={ctaHref}>Request the pitch deck</a>
  </footer>
);

export default Footer;
