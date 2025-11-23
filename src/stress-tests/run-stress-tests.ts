import axios from 'axios';

interface StressTestConfig {
  concurrentUsers: number;
  requestsPerUser: number;
  baseUrl: string;
}

interface TestResult {
  success: number;
  errors: number;
  totalTime: number;
  averageResponseTime: number;
  requestsPerSecond: number;
  successRate: number;
}

class AuthStressTester {
  private config: StressTestConfig;

  constructor(config: StressTestConfig) {
    this.config = config;
  }

  async runRegisterStressTest(): Promise<TestResult> {
    console.log('\n🚀 Iniciando prueba de estrés para REGISTER...');
    console.log(`👥 Usuarios concurrentes: ${this.config.concurrentUsers}`);
    console.log(`📊 Requests por usuario: ${this.config.requestsPerUser}`);
    
    const startTime = Date.now();
    const promises: Promise<any>[] = [];
    let success = 0;
    let errors = 0;

    for (let i = 0; i < this.config.concurrentUsers; i++) {
      for (let j = 0; j < this.config.requestsPerUser; j++) {
        const userIndex = i * this.config.requestsPerUser + j;
        const timestamp = Date.now();
        const promise = axios.post(`${this.config.baseUrl}/register`, {
          email: `stresstest${userIndex}_${timestamp}@test.com`,  // Email único
          password: 'StressTest123!',
          fullName: `Stress Test User ${userIndex}`,
          roles: 'user'
        }).then(() => {
          success++;
        }).catch(() => {
          errors++;
        });

        promises.push(promise);
      }
    }

    await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    const totalRequests = promises.length;

    return {
      success,
      errors,
      totalTime,
      averageResponseTime: totalTime / totalRequests,
      requestsPerSecond: totalRequests / (totalTime / 1000),
      successRate: (success / totalRequests) * 100
    };
  }

  async runLoginStressTest(): Promise<TestResult> {
    console.log('\n🔐 Iniciando prueba de estrés para LOGIN...');
    
    // Crear usuario de prueba
    try {
      await axios.post(`${this.config.baseUrl}/register`, {
        email: 'stresslogin@test.com',
        password: 'StressTest123!',
        fullName: 'Stress Login User',
        roles: 'user'
      });
    } catch (error) {
      // Usuario ya existe
    }

    const startTime = Date.now();
    const promises: Promise<any>[] = [];
    let success = 0;
    let errors = 0;

    for (let i = 0; i < this.config.concurrentUsers; i++) {
      for (let j = 0; j < this.config.requestsPerUser; j++) {
        const promise = axios.post(`${this.config.baseUrl}/login`, {
          email: 'stresslogin@test.com',
          password: 'StressTest123!'
        }).then(() => {
          success++;
        }).catch(() => {
          errors++;
        });

        promises.push(promise);
      }
    }

    await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    const totalRequests = promises.length;

    return {
      success,
      errors,
      totalTime,
      averageResponseTime: totalTime / totalRequests,
      requestsPerSecond: totalRequests / (totalTime / 1000),
      successRate: (success / totalRequests) * 100
    };
  }

  private printResults(testName: string, result: TestResult): void {
    console.log(`\n📈 === RESULTADOS ${testName.toUpperCase()} ===`);
    console.log(`✅ Exitosas: ${result.success}`);
    console.log(`❌ Errores: ${result.errors}`);
    console.log(`⏱️  Tiempo total: ${result.totalTime}ms`);
    console.log(`📊 Tiempo promedio de respuesta: ${result.averageResponseTime.toFixed(2)}ms`);
    console.log(`🚀 Requests por segundo: ${result.requestsPerSecond.toFixed(2)}`);
    console.log(`📈 Tasa de éxito: ${result.successRate.toFixed(2)}%`);
    
    if (result.successRate >= 90) {
      console.log('🎉 ¡Prueba EXITOSA! Tasa de éxito >= 90%');
    } else if (result.successRate >= 70) {
      console.log('⚠️  Prueba ACEPTABLE. Tasa de éxito >= 70%');
    } else {
      console.log('🚨 Prueba FALLIDA. Tasa de éxito < 70%');
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 === INICIANDO PRUEBAS DE ESTRÉS DE AUTENTICACIÓN ===');
    
    try {
      // Prueba de Register
      const registerResult = await this.runRegisterStressTest();
      this.printResults('REGISTER', registerResult);

      // Esperar un poco entre pruebas
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prueba de Login
      const loginResult = await this.runLoginStressTest();
      this.printResults('LOGIN', loginResult);

      console.log('\n🏁 === RESUMEN FINAL ===');
      console.log(`Register - Éxito: ${registerResult.successRate.toFixed(2)}%`);
      console.log(`Login - Éxito: ${loginResult.successRate.toFixed(2)}%`);
      
    } catch (error) {
      console.error('❌ Error durante las pruebas:', error);
    }
  }
}

// Configuración de las pruebas
const config: StressTestConfig = {
  concurrentUsers: 10,  // Reducido para evitar saturación
  requestsPerUser: 5,
  baseUrl: 'http://localhost:3001/auth'
};

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  const tester = new AuthStressTester(config);
  tester.runAllTests().then(() => {
    console.log('\n✨ Pruebas completadas');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { AuthStressTester, StressTestConfig, TestResult };