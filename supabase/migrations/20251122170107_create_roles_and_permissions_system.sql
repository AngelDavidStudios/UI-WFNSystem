/*
  # Sistema de Roles y Permisos

  1. Nuevas Tablas
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Nombre del rol (Admin, Gerente, Jefe)
      - `description` (text) - Descripción del rol
      - `created_at` (timestamp)
    
    - `permissions`
      - `id` (uuid, primary key)
      - `resource` (text) - Recurso/página (dashboard, personas, empleados, etc.)
      - `action` (text) - Acción permitida (view, create, edit, delete)
      - `created_at` (timestamp)
    
    - `role_permissions`
      - `id` (uuid, primary key)
      - `role_id` (uuid, foreign key to roles)
      - `permission_id` (uuid, foreign key to permissions)
      - `created_at` (timestamp)
    
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role_id` (uuid, foreign key to roles)
      - `created_at` (timestamp)

  2. Seguridad
    - Enable RLS en todas las tablas
    - Políticas para admin pueden administrar todo
    - Usuarios autenticados pueden ver sus propios roles
    - Solo admin puede crear/modificar roles y permisos

  3. Datos Iniciales
    - Insertar los 3 roles base (Admin, Gerente, Jefe)
    - Insertar permisos para todos los recursos
    - Asignar permisos según el rol
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL,
  action text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage roles"
  ON roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage permissions"
  ON permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Anyone can view role_permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage role_permissions"
  ON role_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage user_roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

INSERT INTO roles (name, description) VALUES
  ('Admin', 'Administrador con acceso total al sistema'),
  ('Gerente', 'Gerente con acceso parcial a módulos de gestión'),
  ('Jefe', 'Jefe de departamento con acceso limitado')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (resource, action, description) VALUES
  ('dashboard', 'view', 'Ver dashboard'),
  ('personas', 'view', 'Ver personas'),
  ('personas', 'create', 'Crear personas'),
  ('personas', 'edit', 'Editar personas'),
  ('personas', 'delete', 'Eliminar personas'),
  ('empleados', 'view', 'Ver empleados'),
  ('empleados', 'create', 'Crear empleados'),
  ('empleados', 'edit', 'Editar empleados'),
  ('empleados', 'delete', 'Eliminar empleados'),
  ('departamentos', 'view', 'Ver departamentos'),
  ('departamentos', 'create', 'Crear departamentos'),
  ('departamentos', 'edit', 'Editar departamentos'),
  ('departamentos', 'delete', 'Eliminar departamentos'),
  ('bancos', 'view', 'Ver bancos'),
  ('bancos', 'create', 'Crear bancos'),
  ('bancos', 'edit', 'Editar bancos'),
  ('bancos', 'delete', 'Eliminar bancos'),
  ('direcciones', 'view', 'Ver direcciones'),
  ('direcciones', 'create', 'Crear direcciones'),
  ('direcciones', 'edit', 'Editar direcciones'),
  ('direcciones', 'delete', 'Eliminar direcciones'),
  ('provisiones', 'view', 'Ver provisiones'),
  ('provisiones', 'create', 'Crear provisiones'),
  ('provisiones', 'edit', 'Editar provisiones'),
  ('provisiones', 'delete', 'Eliminar provisiones'),
  ('workspaces', 'view', 'Ver workspaces'),
  ('workspaces', 'create', 'Crear workspaces'),
  ('workspaces', 'edit', 'Editar workspaces'),
  ('workspaces', 'delete', 'Eliminar workspaces'),
  ('nomina-novedades', 'view', 'Ver novedades de nómina'),
  ('nomina-novedades', 'create', 'Crear novedades de nómina'),
  ('nomina-novedades', 'edit', 'Editar novedades de nómina'),
  ('nomina-novedades', 'delete', 'Eliminar novedades de nómina'),
  ('nomina-parametros', 'view', 'Ver parámetros de nómina'),
  ('nomina-parametros', 'create', 'Crear parámetros de nómina'),
  ('nomina-parametros', 'edit', 'Editar parámetros de nómina'),
  ('nomina-parametros', 'delete', 'Eliminar parámetros de nómina'),
  ('users', 'view', 'Ver usuarios'),
  ('users', 'create', 'Crear usuarios'),
  ('users', 'edit', 'Editar usuarios'),
  ('users', 'delete', 'Eliminar usuarios')
ON CONFLICT (resource, action) DO NOTHING;

DO $$
DECLARE
  admin_role_id uuid;
  gerente_role_id uuid;
  jefe_role_id uuid;
BEGIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'Admin';
  SELECT id INTO gerente_role_id FROM roles WHERE name = 'Gerente';
  SELECT id INTO jefe_role_id FROM roles WHERE name = 'Jefe';

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT admin_role_id, id FROM permissions
  ON CONFLICT (role_id, permission_id) DO NOTHING;

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT gerente_role_id, id FROM permissions
  WHERE resource IN ('dashboard', 'personas', 'empleados', 'departamentos', 'workspaces', 'nomina-novedades', 'nomina-parametros')
  AND action IN ('view', 'create', 'edit')
  ON CONFLICT (role_id, permission_id) DO NOTHING;

  INSERT INTO role_permissions (role_id, permission_id)
  SELECT jefe_role_id, id FROM permissions
  WHERE resource IN ('dashboard', 'personas', 'empleados', 'workspaces')
  AND action = 'view'
  ON CONFLICT (role_id, permission_id) DO NOTHING;
END $$;
