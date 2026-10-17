# ⚡ PokéVault Web — Frontend Full-Stack

Aplicación web profesional para **PokéVault** (Tienda de Coleccionables y Cartas Pokémon TCG). Desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **React**, conectada a la API RESTful de PokéVault.

---

## 👨‍💻 Información del Proyecto y Estudiante

- **Estudiante:** Andrés Felipe Ortega Solano
- **Institución:** Universidad de Medellín
- **Materia:** Desarrollo Web Full-Stack / Aplicaciones Web
- **Proyecto:** PokéVault (Entrega 3 - Full-Stack E-Commerce)

---

## 🌐 Enlaces de Despliegue

| Servicio         | Plataforma     | URL                                                                                |
| :--------------- | :------------- | :--------------------------------------------------------------------------------- |
| **API Backend**  | Render         | [https://pokevault-api-zo59.onrender.com](https://pokevault-api-zo59.onrender.com) |
| **Frontend Web** | Vercel / Local | [https://pokevault-web-bice.vercel.app/](https://pokevault-web-bice.vercel.app/)  |

---

## 📦 Stack Tecnológico

- **Framework:** Next.js (App Router, Turbopack)
- **Biblioteca UI:** React
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estilos & Diseño:** Tailwind CSS (Paleta personalizada PokéVault y soporte modo oscuro)
- **Iconografía:** Lucide React
- **Gestión de Estado:** React Context API (`AuthContext`) + Hooks personalizados (`useAuth`)
- **Cliente HTTP:** `httpClient` centralizado con interceptor de autenticación JWT y manejo de sesiones

---

## 🏛️ Arquitectura Modular Basada en Características (Feature-Driven)

El frontend está estructurado mediante un enfoque **Feature-Driven**, organizando la lógica por dominios de negocio para máxima escalabilidad y separación de responsabilidades:

```text
src/
├── app/                                 # 1. CAPA DE ENRUTAMIENTO (App Router)
│   ├── layout.tsx                       # Layout raíz con AuthProvider, Navbar y Footer
│   ├── page.tsx                         # Landing page temática con Hero y ventajas
│   ├── login/page.tsx                   # Vista pública de inicio de sesión
│   ├── registro/page.tsx                # Vista pública de registro de usuarios
│   ├── catalogo/                        # Catálogo de productos
│   │   ├── page.tsx                     # Vista con filtros, buscador y <Suspense>
│   │   └── [id]/page.tsx                # Vista dinámica con detalle de producto
│   ├── mis-pedidos/page.tsx             # Historial de compras privado para USER
│   ├── admin/page.tsx                   # Panel de gestión exclusivo para ADMIN
│   └── not-found.tsx                    # Página 404 personalizada con temática Pokémon
│
├── features/                            # 2. CAPA DE DOMINIO Y LÓGICA DE NEGOCIO
│   ├── auth/                            # Módulo de Autenticación
│   │   ├── domain/auth.types.ts         # Modelos TypeScript de usuario y credenciales
│   │   ├── services/auth.service.ts     # Llamadas a endpoints /api/auth/*
│   │   ├── hooks/useAuth.tsx            # Contexto global y hook reactivo de sesión
│   │   └── components/                  # LoginForm y RegisterForm con feedback visual
│   │
│   ├── productos/                       # Módulo de Catálogo e Inventario
│   │   ├── domain/producto.types.ts     # Interfaces de Producto y Paginación
│   │   ├── services/producto.service.ts # Consumo de /api/productos (CRUD y filtros)
│   │   └── components/ProductCard.tsx   # Tarjeta con imagen, precio y badge de categoría
│   │
│   ├── pedidos/                         # Módulo de Órdenes y Compras
│   │   ├── domain/pedido.types.ts       # Interfaces de Pedido y payloads
│   │   ├── services/pedido.service.ts   # Creación y actualización de pedidos
│   │   └── components/PedidoForm.tsx    # Modal de confirmación y cálculo de totales
│   │
│   └── common/                          # Utilidades Compartidas
│       ├── config.ts                    # Resolución de URL base (Local vs Render)
│       ├── http.ts                      # Cliente HTTP con inyección automática de Bearer token
│       └── components/                  # Navbar y Footer globales
```

---

## 🔑 Credenciales de Prueba

| Rol       | Nombre       | Correo Electrónico    | Contraseña  | Permisos en la Plataforma                                                                                  |
| :-------- | :----------- | :-------------------- | :---------- | :--------------------------------------------------------------------------------------------------------- |
| **ADMIN** | Profesor Oak | `admin@pokevault.com` | `Admin123*` | Gestión total de inventario (Crear, Editar, Eliminar productos) y cambio de estado de pedidos en `/admin`. |
| **USER**  | Ash Ketchum  | `ash@pokevault.com`   | `User123*`  | Exploración del catálogo, realización de compras y consulta de pedidos personales en `/mis-pedidos`.       |

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio y navegar a la carpeta:

```bash
git clone https://github.com/Andres7852/pokevault-web.git
cd pokevault-web
```

### 2. Instalar dependencias:

```bash
npm install
```

### 3. Configurar variables de entorno:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_HOST=http://localhost:4000/api
```

> _(Para apuntar al backend en la nube en lugar del local, usa `NEXT_PUBLIC_API_HOST=https://pokevault-api-zo59.onrender.com/api`)_.

### 4. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Preguntas Técnicas

### 1. ¿Cómo se gestiona el estado de autenticación y la persistencia de sesión?

El estado de sesión se administra mediante **React Context (`AuthContext`)**. Al iniciar sesión o registrarse:

1. El backend responde con el payload del usuario y el token JWT firmado.
2. `AuthContext` guarda el token y el perfil serializado en `localStorage` (`pokevault_token` y `pokevault_user`).
3. Al recargar la aplicación, un `useEffect` hidrata el estado global para mantener la sesión activa sin parpadeos.
4. Cada petición saliente a través de `httpClient` extrae dicho token e inyecta la cabecera:
   ```http
   Authorization: Bearer <token_jwt>
   ```
5. Si el servidor responde con un código `401 Unauthorized` (por token vencido o manipulado), el interceptor centralizado borra las credenciales locales y redirige al usuario a `/login?expired=true`.

### 2. ¿Cómo se implementa el control de acceso basado en roles (RBAC)?

- **Nivel de Interfaz:** El componente `Navbar` evalúa reactivamente la propiedad `user.role`. Si el rol es `ADMIN`, se renderiza el enlace exclusivo hacia el panel de `⭐ Administración`.
- **Nivel de Vistas:** En la página `/admin`, se ejecuta una verificación antes del renderizado; si un usuario no autenticado o con rol `USER` intenta acceder directamente por URL, es redirigido inmediatamente a la página principal.
- **Nivel de API (Defensa en Profundidad):** Aunque un usuario eluda el frontend, el backend valida criptográficamente el token con el middleware `requireAdmin`, bloqueando cualquier mutación no autorizada con código `403 Forbidden`.

### 3. ¿Por qué es obligatorio el `<Suspense>` boundary en la página de catálogo?

En **Next.js App Router**, la función `useSearchParams()` lee parámetros dinámicos de la URL en tiempo de ejecución (`?categoria=tcg-boxes&page=2`).
Durante la fase de construcción (`next build`), Next.js intenta prerenderizar las páginas estáticamente. Si un Client Component utiliza `useSearchParams()` sin estar encapsulado dentro de un límite de suspensión (`<Suspense fallback={...}>`), el compilador no puede determinar el valor en tiempo de compilación y aborta el build con un error fatal. El `<Suspense>` delimita el componente dinámico y permite renderizar un esqueleto de carga instantáneo.

### 4. Riesgos de Seguridad de `localStorage` vs `httpOnly Cookies`

- **Riesgo en `localStorage`:** Los datos almacenados son accesibles mediante cualquier script ejecutado en el contexto de la ventana (`window.localStorage`). Si la aplicación sufriera una vulnerabilidad de Cross-Site Scripting (XSS), un atacante podría extraer el token JWT mediante inyección de código.
- **Ventaja de `httpOnly Cookies`:** No son legibles por JavaScript del navegador; el navegador las envía automáticamente en el encabezado `Cookie`.
- **Mitigación implementada:** Para mitigar los riesgos de XSS con `localStorage`, todo el renderizado de datos utiliza componentes React puros (que escapan caracteres HTML peligrosos por defecto evitando inyecciones de script), se usa sanitización estricta y se implementan políticas CORS restrictivas en el servidor.

---

## 🔍 Inspección de Red (Network Tab) — Evidencia de Cabecera Authorization

Para verificar empíricamente que las solicitudes protegidas viajan con el token JWT:

1. Inicia sesión en la aplicación web como `ash@pokevault.com` o `admin@pokevault.com`.
2. Abre las herramientas de desarrollo del navegador (**F12** o clic derecho -> _Inspeccionar_).
3. Selecciona la pestaña **Network** (Red) y filtra por peticiones tipo **Fetch/XHR**.
4. Haz clic en **Mis Pedidos** (o en cualquier acción del panel de administración).
5. Selecciona la petición enviada a `/api/pedidos/mias` o `/api/pedidos`.
6. En la pestaña lateral **Headers**, desplázate a la sección **Request Headers** (Cabeceras de Solicitud).
7. Se evidenciará la cabecera:
   ```text
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Evidencia:
![Evidencia de Red (Network Tab)](image.png)

---

## 🤖 Uso de Inteligencia Artificial

Se utilizo la IA para poder entender y realizar los archivos de la aplicacion, se usó para optimizar, corregir errores y dudas que se presentaron durante el desarrollo. Tambien se uso para la trancision del proyecto de java a next.js. Se usaron principalmente 2 IA, ChatGPT y Gemini. Y por ultimo se uso para realizar el CSS y toda la parte visual del proyecto.
