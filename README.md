# Mocks API – Entregable

API en Express + Mongoose para practicar mocks y carga de datos:
- Router de mocks bajo `/api/mocks`.
- Migración del endpoint `/mockingpets`.
- Generación de usuarios mock (password encriptada `coder123`, role `user/admin`, `pets: []`).
- Inserción masiva de usuarios y mascotas.

## Requisitos
- Node.js 18+
- (Opcional) MongoDB. Sin `MONGODB_URI` se usa una base en memoria para la demo.

## Instalación
```bash
npm install
```

## Configuración (opcional)
Si querés persistir datos, creá `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mocksdb
PORT=3000
```

## Ejecutar
```bash
npm run dev
```
Servidor: http://127.0.0.1:3000  
Pruebas rápidas: http://127.0.0.1:3000/test.html

## Swagger (Users)
Documentación Swagger UI:
- http://127.0.0.1:3000/api-docs

## Docker
Este proyecto incluye `Dockerfile` para construir y ejecutar la API en un contenedor.

### Build
```bash
docker build -t guillorro/adopciones-api:latest .
```

### Run
```bash
docker run --rm -p 3000:3000 --name adopciones-api guillorro/adopciones-api:latest
```

Endpoints útiles:
- http://127.0.0.1:3000/health
- http://127.0.0.1:3000/test.html
- http://127.0.0.1:3000/api-docs

### Dockerhub
Link/imagen pública:
- https://hub.docker.com/r/guillorro/adopciones-api

Pull:
```bash
docker pull guillorro/adopciones-api:latest
```

Push (para publicar en Docker Hub):
```bash
docker login
docker push guillorro/adopciones-api:latest
```

## Endpoints
- GET `/api/mocks/mockingusers?qty=50` → Genera usuarios (no inserta).
- GET `/api/mocks/mockingpets?qty=20` → Genera mascotas (no inserta).
- POST `/api/mocks/generateData` → Inserta. Body: `{ "users": number, "pets": number }`.
- GET `/api/users` → Lista usuarios insertados.
- GET `/api/pets` → Lista mascotas insertadas.

## Verificación rápida
```bash
# Inserción
curl -X POST http://127.0.0.1:3000/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users":10,"pets":5}'

# Listados
curl http://127.0.0.1:3000/api/users
curl http://127.0.0.1:3000/api/pets
```

## Notas
- Proyecto listo para la entrega; no requiere push a ningún remoto.
- `.env.example` incluido como referencia.
