import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export class QuickRouteTester {
  
  static async quickTest() {
    console.log('🧪 INICIANDO TEST RÁPIDO DE RUTAS PROTEGIDAS');
    console.log('='.repeat(50));
    
    try {
      const { userToken, adminToken } = await this.createTestUsers();
      
      console.log('\n👤 TESTING RUTAS DE USUARIO:');
      await this.testUserRoute(userToken);
      
      console.log('\n👑 TESTING RUTAS DE ADMIN:');
      await this.testAdminRoute(adminToken);
      
      console.log('\n🔒 TESTING SEGURIDAD CRUZADA:');
      await this.testCrossSecurity(userToken, adminToken);
      
      console.log('\n✅ Tests completados');
      
    } catch (error) {
      console.error('❌ Error en tests:', error.message);
    }
  }
  
  static async createTestUsers() {
    const timestamp = Date.now();
    
    const userData = {
      nombre: 'TestUser',
      apellidos: 'Quick',
      telefono: '1234567890',
      correo: `user_${timestamp}@test.com`,
      contrasena: 'test123'
    };
    
    await axios.post(`${API_BASE}/register`, userData);
    const userLogin = await axios.post(`${API_BASE}/login`, {
      correo: userData.correo,
      contrasena: userData.contrasena
    });
    
    const adminData = {
      nombre: 'TestAdmin',
      apellidos: 'Quick',
      telefono: '0987654321',
      email: `admin_${timestamp}@test.com`,
      password: 'admin123'
    };
    
    await axios.post(`${API_BASE}/admin/register`, adminData);
    const adminLogin = await axios.post(`${API_BASE}/admin/login`, {
      email: adminData.email,
      password: adminData.password
    });
    
    console.log('✅ Usuarios de prueba creados');
    
    return {
      userToken: userLogin.data.token,
      adminToken: adminLogin.data.token
    };
  }
  
  static async testUserRoute(token) {
    try {
      const response = await axios.get(`${API_BASE}/sesion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ GET /sesion - Usuario puede acceder a su sesión');
    } catch (error) {
      console.log(`❌ GET /sesion - Error: ${error.response?.status}`);
    }
    
    try {
      const response = await axios.get(`${API_BASE}/validar-sesion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ GET /validar-sesion - Usuario puede validar sesión');
    } catch (error) {
      console.log(`❌ GET /validar-sesion - Error: ${error.response?.status}`);
    }
  }
  
  static async testAdminRoute(token) {
    try {
      const response = await axios.get(`${API_BASE}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ GET /usuarios - Admin puede listar usuarios');
    } catch (error) {
      console.log(`❌ GET /usuarios - Error: ${error.response?.status}`);
    }
    
    try {
      const response = await axios.get(`${API_BASE}/admin/sesion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ GET /admin/sesion - Admin puede acceder a su sesión');
    } catch (error) {
      console.log(`❌ GET /admin/sesion - Error: ${error.response?.status}`);
    }
  }
  
  static async testCrossSecurity(userToken, adminToken) {
    try {
      await axios.get(`${API_BASE}/usuarios`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ FALLO DE SEGURIDAD: Usuario pudo acceder a /usuarios');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Usuario correctamente rechazado en /usuarios (403)');
      } else {
        console.log(`⚠️ Usuario rechazado en /usuarios pero con código inesperado: ${error.response?.status}`);
      }
    }
    
    try {
      await axios.get(`${API_BASE}/sesion`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('⚠️ Admin pudo acceder a /sesion (puede ser esperado según configuración)');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Admin correctamente rechazado en /sesion (403)');
      } else {
        console.log(`⚠️ Admin rechazado en /sesion: ${error.response?.status}`);
      }
    }
  }
}

export async function testRoute(endpoint, token, method = 'GET', data = null) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${API_BASE}${endpoint}`,
      headers: { Authorization: `Bearer ${token}` }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint} - Success (${response.status})`);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;
    console.log(`❌ ${method} ${endpoint} - Error (${status}): ${message}`);
    return { success: false, status, error: message };
  }
}

if (typeof window !== 'undefined') {
  window.QuickRouteTester = QuickRouteTester;
  window.testRoute = testRoute;
  
  console.log(`
🧪 Tests de rutas cargados! Usa:

• QuickRouteTester.quickTest() - Test completo rápido
• testRoute('/endpoint', 'token') - Test de ruta específica

Ejemplo:
QuickRouteTester.quickTest()
  `);
}

export default QuickRouteTester;
