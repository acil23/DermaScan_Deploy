const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return `
    <header>
      <div style="display: flex; align-items: center;">
        <img src="assets/logo3.png" alt="Logo" />
        <span class="logo">DermaScan</span>
      </div>
      <button class="hamburger" id="hamburger-menu">☰</button>
      <nav id="nav-links">
        <a href="#/">Home</a>
        <a href="#/analysis">Skin Analysis</a>
        <a href="#/education">Education</a>
        <a href="#/profile">Profile</a>
        <a href="#/about">About</a>
        ${
          user
            ? `<a href="#" id="logout-link" class="logout-btn">Logout</a>`
            : `
            <a href="#/login" class="login-btn">Login</a>
            <a href="#/register" class="register-btn">Register</a>`
        }
      </nav>
    </header>
  `;
};

export default Header;
