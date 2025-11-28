/*
  # Fix Admin Full Access to All Tables

  1. Changes
    - Update all table policies to give Admin unrestricted full access
    - Simplify Admin role checks
    - Ensure Admin can perform all operations (SELECT, INSERT, UPDATE, DELETE)
  
  2. Security
    - Admin role bypasses all restrictions
    - Other roles maintain their current permissions
*/

-- ============================================
-- WORKSPACES TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin and Gerente can delete workspaces" ON workspaces;
DROP POLICY IF EXISTS "Admin and Gerente can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Admin and Gerente can update workspaces" ON workspaces;
DROP POLICY IF EXISTS "Authenticated users can view all workspaces" ON workspaces;

CREATE POLICY "Authenticated users can view all workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and Gerente can insert workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'Gerente')
    )
  );

CREATE POLICY "Admin and Gerente can update workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'Gerente')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'Gerente')
    )
  );

CREATE POLICY "Admin and Gerente can delete workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('Admin', 'Gerente')
    )
  );

-- ============================================
-- ROLES TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin can delete roles" ON roles;
DROP POLICY IF EXISTS "Admin can insert roles" ON roles;
DROP POLICY IF EXISTS "Admin can update roles" ON roles;
DROP POLICY IF EXISTS "Anyone can view roles" ON roles;

CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert roles"
  ON roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can update roles"
  ON roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can delete roles"
  ON roles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

-- ============================================
-- PERMISSIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin can delete permissions" ON permissions;
DROP POLICY IF EXISTS "Admin can insert permissions" ON permissions;
DROP POLICY IF EXISTS "Admin can update permissions" ON permissions;
DROP POLICY IF EXISTS "Anyone can view permissions" ON permissions;

CREATE POLICY "Authenticated users can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert permissions"
  ON permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can update permissions"
  ON permissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can delete permissions"
  ON permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

-- ============================================
-- ROLE_PERMISSIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin can delete role_permissions" ON role_permissions;
DROP POLICY IF EXISTS "Admin can insert role_permissions" ON role_permissions;
DROP POLICY IF EXISTS "Admin can update role_permissions" ON role_permissions;
DROP POLICY IF EXISTS "Anyone can view role_permissions" ON role_permissions;

CREATE POLICY "Authenticated users can view role_permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert role_permissions"
  ON role_permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can update role_permissions"
  ON role_permissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can delete role_permissions"
  ON role_permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

-- ============================================
-- USER_ROLES TABLE
-- ============================================
DROP POLICY IF EXISTS "Admin can delete user_roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can insert user_roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can update user_roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view all user_roles" ON user_roles;

CREATE POLICY "Authenticated users can view all user_roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert user_roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can update user_roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE POLICY "Admin can delete user_roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'Admin'
    )
  );
