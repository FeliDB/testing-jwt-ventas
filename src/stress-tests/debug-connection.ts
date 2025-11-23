import axios from 'axios';

async function debugConnection() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Diagnosticando conexión...\n');
  
  // 1. Verificar si el servidor responde
  try {
    console.log('1️⃣ Probando conexión básica...');
    const response = await axios.get(`${baseUrl}`, { timeout: 5000 });
    console.log(`✅ Servidor responde: ${response.status}`);
  } catch (error: any) {
    console.log(`❌ Error de conexión: ${error.code || error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log('🚨 El servidor NO está ejecutándose en el puerto 3001');
      return;
    }
  }

  // 2. Probar endpoint de auth específico
  try {
    console.log('\n2️⃣ Probando endpoint /auth...');
    const response = await axios.get(`${baseUrl}/auth`, { timeout: 5000 });
    console.log(`✅ Auth endpoint responde: ${response.status}`);
  } catch (error: any) {
    console.log(`⚠️ Auth endpoint error: ${error.response?.status || error.message}`);
  }

  // 3. Probar un registro simple
  try {
    console.log('\n3️⃣ Probando registro simple...');
    const response = await axios.post(`${baseUrl}/auth/register`, {
      email: 'debug@test.com',
      password: 'DebugTest123!',
      fullName: 'Debug User',
      roles: 'user'
    }, { timeout: 10000 });
    console.log(`✅ Registro exitoso: ${response.status}`);
    console.log(`📄 Respuesta:`, response.data);
  } catch (error: any) {
    console.log(`❌ Error en registro:`);
    console.log(`   Status: ${error.response?.status || 'N/A'}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Data:`, error.response?.data);
  }

  // 4. Probar login simple
  try {
    console.log('\n4️⃣ Probando login simple...');
    const response = await axios.post(`${baseUrl}/auth/login`, {
      email: 'debug@test.com',
      password: 'DebugTest123!'
    }, { timeout: 10000 });
    console.log(`✅ Login exitoso: ${response.status}`);
    console.log(`🔑 Token presente:`, !!response.data.token);
  } catch (error: any) {
    console.log(`❌ Error en login:`);
    console.log(`   Status: ${error.response?.status || 'N/A'}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Data:`, error.response?.data);
  }
}

debugConnection().catch(console.error);