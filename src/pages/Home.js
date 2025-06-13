import Header from '../components/header.js';
import Footer from '../components/footer.js';

const Home = () => {
  return `
    ${Header()}
    <main class="landing-container">
      <section class="Inner-landing">
        <section class="hero-section">
          <h1>Automatic Skin Disease Detection</h1>
          <p>
            Empowering you to identify, understand, and treat skin conditions with AI-powered analysis and trusted educational content.
          </p>
          <a href="/#/analysis" class="start-btn">Start Diagnosis</a>
        </section>

        <section class="features-section">
          <div class="feature-box" id="feature-analysis">
            <img src="/assets/analysis-icon.png" alt="Skin Analysis" />
            <h3>Skin Analysis</h3>
            <p>Upload a skin photo for instant condition detection and guidance.</p>
          </div>
          <div class="feature-box" id="feature-education">
            <img src="/assets/education.png" alt="Education" />
            <h3>Education</h3>
            <p>Learn about various skin diseases and how to manage them.</p>
          </div>
          <div class="feature-box" id="feature-history">
            <img src="/assets/history.png" alt="Diagnosis History" />
            <h3>Diagnosis History</h3>
            <p>Access previous diagnoses and treatment suggestions anytime.</p>
          </div>
        </section>

        <section class="testimonial-section">
          <h2>What Our Users Say</h2>
          <div class="testimonial-container">
            <div class="testimonial-box">
              <p>“Fast, accurate, and easy to use. DermaScan helped me identify my skin issue and gave me peace of mind.”</p>
              <span><strong>Alex T.</strong></span>
            </div>
            <div class="testimonial-box">
              <p>“The education section is incredibly helpful. I learned how to take better care of my skin.”</p>
              <span><strong>Priya L.</strong></span>
            </div>
            <div class="testimonial-box">
              <p>“The diagnosis history lets me keep track of my progress and follow treatment suggestions.”</p>
              <span><strong>Samuel K.</strong></span>
            </div>
          </div>
        </section>
      </section>
    </main>
    ${Footer()}
  `;
};

export default Home;
