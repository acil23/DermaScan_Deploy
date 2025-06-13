const Footer = () => {
  return `
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">DermaScan © 2025 | Made with ❤️ by Team CC25-CF344</p>
        <div class="footer-links">
          <a href="#/about">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div class="footer-social">
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <img src="/assets/instagram.png" alt="Instagram" />
        </a>
        <a href="https://wa.me/" target="_blank" aria-label="WhatsApp">
          <img src="/assets/whatsapp.png" alt="WhatsApp" />
        </a>
        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <img src="/assets/linkedin.png" alt="LinkedIn" />
        </a>
      </div>
    </footer>
  `;
};

export default Footer;
