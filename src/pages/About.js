import Header from '../components/header.js';
import Footer from '../components/footer.js';

const About = () => {
  return `
    ${Header()}
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">About Page</h1>
    </main>
    ${Footer()}
  `;
};

export default About;
