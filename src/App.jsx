import React, { useState, useEffect, useRef } from 'react'
import { Home, User, Code, Briefcase, Mail, Menu, X, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import UserImg from './assets/UserImg.JPG'
import emailjs from '@emailjs/browser'


const App = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState({})
  const observerRef = useRef()
  
  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target
            const animationType = element.getAttribute('data-animate')
            
            // Add the appropriate animation class
            element.classList.add(`animate-${animationType}`)
            
            // Mark as visible
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe elements after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]')
      elements.forEach((el) => observerRef.current.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [])

  // Smooth scrolling and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  // --- replaced: form ref / sendEmail / notification state ---
  const form = useRef();
  const [notify, setNotify] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    if (notify.status === 'success' || notify.status === 'error') {
      const t = setTimeout(() => setNotify({ status: 'idle', message: '' }), 5000)
      return () => clearTimeout(t)
    }
  }, [notify.status])

  const sendEmail = async (e) => {
    e.preventDefault()
    setNotify({ status: 'loading', message: 'Sending message...' })

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      form.current.reset()
      setNotify({ status: 'success', message: '✅ Message sent successfully.' })
    } catch (error) {
      console.error('EmailJS Error:', error)
      const msg = (error && (error.text || error.message)) || '❌ Failed to send message. Please try again later.'
      setNotify({ status: 'error', message: msg })
    }
  };
  // --- end replaced block ---

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Portfolio
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200/50">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Home Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div 
                data-animate="fade-up"
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse hover:animate-none hover:scale-110 transition-all duration-500"
              >
                <Code className="w-12 h-12 text-white" />
              </div>
              <h1 
                data-animate="fade-up"
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                  Hello, I'm
                </span>
                <br />
                <span className="text-gray-800">Howell</span>
              </h1>
              <p 
                data-animate="fade-up"
                className="text-xl md:text-2xl text-gray-600 mb-8"
              >
                Full Stack Developer & UI/UX Designer
              </p>
              <p 
                data-animate="fade-up"
                className="text-lg text-gray-500 max-w-2xl mx-auto mb-12"
              >
                I love turning ideas into beautiful, responsive web applications that feel great to use.
                I’m passionate about clean code, modern design, and crafting creative solutions that make a real impact.
              </p>
            </div>

            <div 
              data-animate="fade-up"
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="viewBtn px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="getBtn px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </button>
            </div>

            {/* Social Links */}
            <div 
              data-animate="fade-up"
              className="flex justify-center space-x-6"
            >
              <a href="#" className="socialBtn w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300 group">
                <Github className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="#" className="socialBtn w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300 group">
                <Linkedin className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="#" className="socialBtn w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300 group">
                <Twitter className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="#" className="socialBtn w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all duration-300 group">
                <Instagram className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div 
              data-animate="fade-up"
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Me</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                data-animate="fade-right"
                className="transform transition-all duration-700"
              >
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                  <img 
                    src={UserImg} 
                    alt="Howell" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
              <div 
                data-animate="fade-left"
                className="transform transition-all duration-700"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Passionate Developer</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  I’m a dedicated junior full-stack developer who loves bringing ideas to life through clean, creative, and functional web applications. I specialize in building scalable digital solutions that blend beautiful design with powerful performance.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  My journey started from simple curiosity, a desire to understand how things work online and grew into a genuine passion for crafting meaningful user experiences. I’m always eager to learn, explore new technologies, and stay on top of the latest trends in web development.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                    <div className="text-gray-600">Projects Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div 
              data-animate="fade-up"
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Skills & Tech Stack</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Frontend */}
              <div 
                data-animate="fade-up"
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Frontend</h3>
                <ul className="space-y-3">
                  {['React.js', 'JavaScript', 'Tailwind CSS', 'Next.js', 'HTML5/CSS3'].map((skill, index) => (
                    <li 
                      key={skill} 
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Backend */}
              <div 
                data-animate="fade-up"
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Backend</h3>
                <ul className="space-y-3">
                  {['Node.js', 'Express.js', 'MongoDB', 'MySQL'].map((skill, index) => (
                    <li 
                      key={skill} 
                      className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools & Others */}
              <div 
                data-animate="fade-up"
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Tools & Others</h3>
                <ul className="space-y-3">
                  {['Git/GitHub', 'Figma', 'VS Code', 'Agile', 'Microsoft Office (Word, Excel, PowerPoint)'].map((skill, index) => (
                    <li 
                      key={skill} 
                      className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section (restored design) */}
        <section id="projects" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div 
              data-animate="fade-up"
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Featured Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                A selection of projects that showcase UI, frontend engineering, and full-stack work — click to view demos or source.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project Card (template) */}
              {[
                {
                  id: 1,
                  title: 'E-Commerce Platform',
                  desc: 'Full-stack e-commerce with user auth, admin dashboard and Stripe payments.',
                  colorFrom: 'from-blue-100',
                  colorTo: 'to-indigo-100',
                  tech: ['React', 'Node.js', 'MongoDB', 'Stripe']
                },
                {
                  id: 2,
                  title: 'Task Management App',
                  desc: 'Real-time collaborative task app with drag-and-drop and websockets.',
                  colorFrom: 'from-purple-100',
                  colorTo: 'to-pink-100',
                  tech: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL']
                },
                {
                  id: 3,
                  title: 'Weather Dashboard',
                  desc: 'Responsive weather UI with maps, forecasts and charts.',
                  colorFrom: 'from-green-100',
                  colorTo: 'to-emerald-100',
                  tech: ['React', 'TypeScript', 'OpenWeather API', 'Chart.js']
                }
              ].map((proj, idx) => (
                <article 
                  key={proj.id}
                  data-animate="fade-up"
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className={`h-44 md:h-48 w-full flex items-end p-4 bg-gradient-to-br ${proj.colorFrom} ${proj.colorTo}`}>
                    <div className="w-full flex items-end justify-between">
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-800">{proj.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 hidden md:block">{proj.desc}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium shadow">
                          Live
                        </button>
                        <button className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium shadow">
                          Code
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 md:hidden">{proj.desc}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tech.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Case study · Demo available</div>
                      <div className="flex items-center space-x-3">
                        <a href="#" className="project-btn inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow hover:from-blue-700 hover:to-indigo-700 transition-colors">
                          View
                        </a>
                        <a href="#" className="project-btn inline-flex items-center px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          GitHub  
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div 
              data-animate="fade-up"
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get In Touch</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
              <p className="text-xl text-gray-600 mt-6">
                Ready to work together? Let's discuss your next project!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div 
                data-animate="fade-right"
                className="transform transition-all duration-700"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Let's Connect</h3>
                <p className="text-gray-600 mb-8">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors duration-300">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Email</div>
                      <div className="text-gray-600">your.email@gmail.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors duration-300">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Location</div>
                      <div className="text-gray-600">Your Address</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div 
                data-animate="fade-left"
                className="transform transition-all duration-700"
              >
                <form ref={form} onSubmit={sendEmail} className="space-y-6">
                    {/* hidden fields for date and time */}
                        <input
                          type="hidden"
                          name="date"
                          value={new Date().toLocaleDateString()}
                        />
                        <input
                          type="hidden"
                          name="time"
                          value={new Date().toLocaleTimeString()}
                        />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="submitBtn w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Notification Toast */}
      <div aria-live="polite" className="fixed z-50 bottom-6 right-6">
        {notify.status !== 'idle' && (
          <div
            className={
              `max-w-sm w-full rounded-lg shadow-lg p-4 flex items-center space-x-3 transform transition-all duration-300 ` +
              (notify.status === 'loading'
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : notify.status === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200')
            }
          >
            {/* icon */}
            {notify.status === 'loading' ? (
              <svg className="w-5 h-5 animate-spin text-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : notify.status === 'success' ? (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 112 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
            )}

            <div className="text-sm font-medium">{notify.message}</div>

            <button
              onClick={() => setNotify({ status: 'idle', message: '' })}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Portfolio</span>
          </div>
          <p className="text-gray-400 mb-4">
            © 2025 Your Name. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="socialsBtn text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="socialsBtn text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="socialsBtn text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="socialsBtn text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
