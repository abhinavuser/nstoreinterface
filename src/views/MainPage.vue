<template>
  <div class="app">
    <nav :class="`navbar theme-${theme}`">
      <div class="navbar-container">
        <a class="navbar-brand" href="#">nStore</a>
        <div class="navbar-links">
          <ul class="navbar-nav">
            <li v-for="(page, index) in pages" class="nav-item" :key="index">
              <a
                class="nav-link"
                :class="{ active: activePage == index }"
                aria-current="page"
                href="#"
                @click.prevent="activePage = index"
              >{{ page.link.text }}</a>
            </li>
          </ul>
        </div>
        <button class="btn theme-toggle" @click.prevent="changeTheme">Change theme</button>
        <button class="navbar-toggler" @click="toggleNav">☰</button>
      </div>
    </nav>
    <div id="content" class="content">
      <h1>{{ pages[activePage].pageTitle }}</h1>
      <p>{{ pages[activePage].content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePage: 0,
      theme: 'light',
      navOpen: false,
      pages: [
        {
          link: { text: 'Home', url: 'index.html' },
          pageTitle: 'Home Page',
          content: 'This is the home content'
        },
        {
          link: { text: 'About', url: 'about.html' },
          pageTitle: 'About Page',
          content: 'This is the about content'
        },
        {
          link: { text: 'Contact', url: 'contact.html' },
          pageTitle: 'Contact Page',
          content: 'This is the contact content'
        }
      ]
    };
  },
  methods: {
    changeTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
    toggleNav() {
      this.navOpen = !this.navOpen;
    }
  }
};
</script>

<style scoped>
.app {
  height: 100vh;
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--navbar-bg);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.navbar-links {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.navbar-toggler {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.navbar-collapse {
  display: flex;
  align-items: center;
}

.navbar-collapse.open {
  display: block;
}

.navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-left: 1rem;
}

.nav-link {
  text-decoration: none;
  padding: 10px 15px;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: var(--link-color);
}

.nav-link.active {
  font-weight: bold;
  color: var(--link-active-color);
}

.theme-light {
  --navbar-bg: #f8f9fa;
  --link-color: #333(0, 0, 0, 0.5);
  --link-active-color: #333(0, 0, 0, 0.9);
}

.theme-dark {
  --navbar-bg: #333;
  --link-color: rgba(255, 255, 255, 0.5);
  --link-active-color: rgba(255, 255, 255, 0.9);
}

.navbar-brand {
  color: var(--link-active-color);
  font-weight: bold;
  background-image: linear-gradient(to top, lightblue 0%, #3498db 100%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
}
.btn:hover {
  background-color: #2980b9;
}

.theme-light .btn {
  color: white;
}

.theme-dark .btn {
  color: white;
}

.content {
  text-align: center;
  padding: 2rem;
}

</style>
