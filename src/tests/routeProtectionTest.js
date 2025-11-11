import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

class RouteTester {
  constructor() {
    this.userToken = null;
    this.adminToken = null;
    this.testResults = [];
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async runAllTests() {
    this.log('\n🚀 INICIANDO TESTS DE RUTAS PROTEGIDAS', 'cyan');
    this.log('=' * 50, 'cyan');

    try {
      await this.setupTestUsers();
      
      await this.testUserRoutes();
      
      await this.testAdminRoutes();
      
      await this.testCrossAccess();
      
      this.showSummary();
      
    } catch (error) {
      this.log(`❌ Error general en tests: ${error.message}`, 'red');
    }
  }

  async setupTestUsers() {
    this.log('\n📋 CONFIGURANDO USUARIOS DE PRUEBA', 'yellow');
    
    try {
      const userData = {
        nombre: 'Usuario',
        apellidos: 'Test',
        telefono: '1234567890',
        correo: `usuario_test_${Date.now()}@test.com`,
        contrasena: 'password123'
      };

      await axios.post(`${API_BASE}/register`, userData);
      this.log('✅ Usuario regular registrado', 'green');

      const userLogin = await axios.post(`${API_BASE}/login`, {
        correo: userData.correo,
        contrasena: userData.contrasena
      });
      this.userToken = userLogin.data.token;
      this.log('✅ Token de usuario obtenido', 'green');

      const adminData = {
        nombre: 'Admin',
        apellidos: 'Test',
        telefono: '0987654321',
        email: `admin_test_${Date.now()}@test.com`,
        password: 'admin123'
      };

      await axios.post(`${API_BASE}/admin/register`, adminData);
      this.log('✅ Admin registrado', 'green');

      const adminLogin = await axios.post(`${API_BASE}/admin/login`, {
        email: adminData.email,
        password: adminData.password
      });
      this.adminToken = adminLogin.data.token;
      this.log('✅ Token de admin obtenido', 'green');

    } catch (error) {
      this.log(`❌ Error configurando usuarios: ${error.response?.data || error.message}`, 'red');
      throw error;
    }
  }

  async testUserRoutes() {
    this.log('\n👤 TESTING RUTAS DE USUARIO', 'blue');
    
    const userRoutes = [
      { method: 'GET', url: '/sesion', description: 'Obtener sesión actual' },
      { method: 'GET', url: '/validar-sesion', description: 'Validar sesión' },
      { method: 'POST', url: '/editar-perfil', description: 'Editar perfil', data: { nombre: 'Usuario Editado' } },
      { method: 'DELETE', url: '/sesiones', description: 'Eliminar todas las sesiones' }
    ];

    for (const route of userRoutes) {
      await this.testRoute({
        ...route,
        token: this.userToken,
        expectedRole: 'usuario'
      });
    }
  }

  async testAdminRoutes() {
    this.log('\n👑 TESTING RUTAS DE ADMIN', 'magenta');
    
    const adminRoutes = [
      { method: 'GET', url: '/usuarios', description: 'Listar usuarios' },
      { method: 'GET', url: '/admin/sesion', description: 'Obtener sesión admin' },
      { method: 'GET', url: '/admin/validar-sesion', description: 'Validar sesión admin' },
      { method: 'POST', url: '/admin/editar-perfil', description: 'Editar perfil admin', data: { nombre: 'Admin Editado' } }
    ];

    for (const route of adminRoutes) {
      await this.testRoute({
        ...route,
        token: this.adminToken,
        expectedRole: 'admin'
      });
    }
  }

  async testCrossAccess() {
    this.log('\n🔄 TESTING ACCESO CRUZADO (Seguridad)', 'yellow');
    
    this.log('\n🚫 Usuario intentando acceder a rutas de admin:', 'yellow');
    const adminRoutesForUser = [
      { method: 'GET', url: '/usuarios', description: 'Usuario -> Listar usuarios (debe fallar)' },
      { method: 'GET', url: '/admin/sesion', description: 'Usuario -> Sesión admin (debe fallar)' }
    ];

    for (const route of adminRoutesForUser) {
      await this.testRoute({
        ...route,
        token: this.userToken,
        expectedRole: 'usuario',
        shouldFail: true
      });
    }

    this.log('\n🔄 Admin intentando acceder a rutas de usuario:', 'yellow');
    const userRoutesForAdmin = [
      { method: 'GET', url: '/sesion', description: 'Admin -> Sesión usuario (middleware específico)' },
      { method: 'GET', url: '/validar-sesion', description: 'Admin -> Validar sesión usuario (middleware específico)' }
    ];

    for (const route of userRoutesForAdmin) {
      await this.testRoute({
        ...route,
        token: this.adminToken,
        expectedRole: 'admin',
        shouldFail: true
      });
    }
  }

  async testRoute({ method, url, description, token, expectedRole, data = null, shouldFail = false }) {
    const testName = `${method} ${url}`;
    
    try {
      const config = {
        method: method.toLowerCase(),
        url: `${API_BASE}${url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.data = data;
      }

      const response = await axios(config);
      
      if (shouldFail) {
        this.log(`❌ ${testName} - ${description} (Debería haber fallado pero pasó)`, 'red');
        this.testResults.push({ test: testName, status: 'FAIL', reason: 'Debería haber sido rechazado' });
      } else {
        this.log(`✅ ${testName} - ${description} (${response.status})`, 'green');
        this.testResults.push({ test: testName, status: 'PASS', response: response.status });
      }
      
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      
      if (shouldFail && (status === 401 || status === 403)) {
        this.log(`✅ ${testName} - ${description} (Correctamente rechazado: ${status})`, 'green');
        this.testResults.push({ test: testName, status: 'PASS', reason: `Correctamente rechazado (${status})` });
      } else if (shouldFail) {
        this.log(`⚠️  ${testName} - ${description} (Error inesperado: ${status})`, 'yellow');
        this.testResults.push({ test: testName, status: 'WARNING', reason: `Error inesperado: ${errorMessage}` });
      } else {
        this.log(`❌ ${testName} - ${description} (${status}: ${errorMessage})`, 'red');
        this.testResults.push({ test: testName, status: 'FAIL', reason: `${status}: ${errorMessage}` });
      }
    }
  }

  showSummary() {
    this.log('\n📊 RESUMEN DE TESTS', 'cyan');
    this.log('=' * 50, 'cyan');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const warnings = this.testResults.filter(r => r.status === 'WARNING').length;
    const total = this.testResults.length;
    
    this.log(`✅ Pasaron: ${passed}`, 'green');
    this.log(`❌ Fallaron: ${failed}`, 'red');
    this.log(`⚠️  Advertencias: ${warnings}`, 'yellow');
    this.log(`📈 Total: ${total}`, 'white');
    
    const successRate = ((passed / total) * 100).toFixed(1);
    this.log(`🎯 Tasa de éxito: ${successRate}%`, successRate > 80 ? 'green' : 'yellow');
    
    if (failed > 0) {
      this.log('\n❌ TESTS FALLIDOS:', 'red');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          this.log(`  • ${r.test}: ${r.reason}`, 'red');
        });
    }
    
    if (warnings > 0) {
      this.log('\n⚠️  ADVERTENCIAS:', 'yellow');
      this.testResults
        .filter(r => r.status === 'WARNING')
        .forEach(r => {
          this.log(`  • ${r.test}: ${r.reason}`, 'yellow');
        });
    }
  }
}

export async function testProtectedRoutes() {
  const tester = new RouteTester();
  await tester.runAllTests();
}

if (typeof window !== 'undefined') {
  window.testProtectedRoutes = testProtectedRoutes;
  console.log('🧪 Test de rutas cargado. Ejecuta testProtectedRoutes() para iniciar.');
}

export default RouteTester;
