<template>
  <div class="app">
    <header class="hero">
      <h1>Welcome to Our Automatic Customizable Order Management System</h1>
      <p>Optimize your order management with ease and efficiency.</p>
      <button class="btn hero-btn">Get Started</button>
    </header>

    <section class="features">
      <h2>Features</h2>
      <div class="feature-cards">
        <div class="feature-card">
          <h3>Customizable</h3>
          <p>Adapt the system to fit your unique business needs.</p>
        </div>
        <div class="feature-card">
          <h3>Automated</h3>
          <p>Automate your processes to save time and reduce errors.</p>
        </div>
        <div class="feature-card">
          <h3>User-Friendly</h3>
          <p>Enjoy an intuitive interface that enhances productivity.</p>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <h2>What Our Users Say</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card">
          <p>"This system has transformed our business! Highly recommend!"</p>
          <span>- Alex J.</span>
        </div>
        <div class="testimonial-card">
          <p>"Incredibly easy to use and incredibly effective!"</p>
          <span>- Sarah T.</span>
        </div>
        <div class="testimonial-card">
          <p>"A must-have tool for any business looking to improve efficiency."</p>
          <span>- James K.</span>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Ready to Transform Your Order Management?</h2>
      <button class="btn cta-btn">Sign Up Now</button>
    </section>

    <footer class="footer">
      <p>&copy; 2024 nStore. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.app {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

.hero {
  text-align: center;
  padding: 100px 20px;
  background: #3498db;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}


.btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  background-color: #333;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background-color: black;
  transform: scale(1.05);
}

.features {
  padding: 60px 20px;
  background-color: #f8f9fa;
  height: 80vh;
}

.features h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.feature-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.testimonials {
  padding: 60px 20px;
  background-color: #ffffff;
  height: 60vh;
}

.testimonials h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
}

.testimonial-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.testimonial-card {
  background: #e9ecef;
  border-radius: 12px;
  padding: 30px;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.testimonial-card:hover {
  transform: scale(1.05);
}

.cta {
  text-align: center;
  padding: 60px 20px;
  background: #3498db;
  color: white;
}

.cta h2 {
  margin-bottom: 20px;
  font-size: 2rem;
}

.cta-btn {
  margin-top: 20px;
}

.footer {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  color: #333;
}
</style>
