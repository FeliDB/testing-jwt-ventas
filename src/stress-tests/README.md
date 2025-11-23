# Pruebas de Estrés - Autenticación

Este directorio contiene pruebas de estrés automatizadas para los endpoints de autenticación del backend.

## 📋 Casos de Prueba

### 1. Register Stress Test
- **Objetivo**: Evaluar el rendimiento del endpoint `/auth/register` bajo carga
- **Configuración**: 50 usuarios concurrentes, 10 requests por usuario (500 requests total)
- **Criterios de éxito**: 
  - Tasa de éxito > 80%
  - Tiempo total < 30 segundos

### 2. Login Stress Test  
- **Objetivo**: Evaluar el rendimiento del endpoint `/auth/login` bajo carga
- **Configuración**: 50 usuarios concurrentes, 10 requests por usuario (500 requests total)
- **Criterios de éxito**:
  - Tasa de éxito > 95%
  - Tiempo total < 20 segundos
  - Todas las respuestas exitosas incluyen token JWT

## 🚀 Cómo Ejecutar

### Opción 1: Con Jest (Recomendado)
```bash
# Ejecutar pruebas de estrés con Jest
npm run test:stress
```

### Opción 2: Script Independiente
```bash
# Ejecutar script independiente con salida detallada
npm run stress:run
```

### Opción 3: Ejecución Manual
```bash
# Con ts-node
npx ts-node -r tsconfig-paths/register src/stress-tests/run-stress-tests.ts

# O compilar y ejecutar
npm run build
node dist/stress-tests/run-stress-tests.js
```

## ⚙️ Configuración

Puedes modificar los parámetros de las pruebas editando las constantes en los archivos:

```typescript
// En auth-stress.test.ts
const CONCURRENT_USERS = 50;      // Usuarios concurrentes
const REQUESTS_PER_USER = 10;     // Requests por usuario

// En run-stress-tests.ts
const config = {
  concurrentUsers: 25,
  requestsPerUser: 5,
  baseUrl: 'http://localhost:3001/auth'
};
```

## 📊 Métricas Evaluadas

- **Requests totales**: Número total de peticiones enviadas
- **Exitosas**: Peticiones que retornaron status 200/201
- **Errores**: Peticiones que fallaron o retornaron error
- **Tiempo total**: Duración completa de la prueba
- **Tiempo promedio de respuesta**: Tiempo promedio por request
- **Requests por segundo**: Throughput del servidor
- **Tasa de éxito**: Porcentaje de requests exitosas

## 🔧 Requisitos Previos

1. **Servidor ejecutándose**: El backend debe estar corriendo en `http://localhost:3001`
2. **Base de datos**: MySQL debe estar disponible y configurada
3. **Dependencias**: Todas las dependencias npm instaladas

```bash
# Iniciar el servidor
npm run start:dev

# En otra terminal, ejecutar las pruebas
npm run test:stress
```

## 🎯 Interpretación de Resultados

### ✅ Prueba Exitosa
- Tasa de éxito >= 90%
- Tiempos de respuesta consistentes
- Sin errores de conexión

### ⚠️ Prueba Aceptable  
- Tasa de éxito >= 70%
- Algunos errores menores
- Tiempos de respuesta variables

### 🚨 Prueba Fallida
- Tasa de éxito < 70%
- Muchos errores de conexión/timeout
- Rendimiento degradado

## 🐛 Troubleshooting

### Error de Conexión
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```
**Solución**: Verificar que el servidor esté ejecutándose en el puerto 3001

### Timeout en las Pruebas
```
Timeout - Async callback was not invoked within the 60000 ms timeout
```
**Solución**: Reducir el número de usuarios concurrentes o aumentar el timeout

### Errores de Base de Datos
```
Error: Too many connections
```
**Solución**: Configurar pool de conexiones en TypeORM o reducir la carga de prueba