/*
  # Update Workspaces Policies for Authenticated Users

  1. Changes
    - Remove existing anon policies
    - Add policies for authenticated users to view all workspaces
    - Admin and Gerente can create, update, and delete workspaces
    - All authenticated users can view workspaces
  
  2. Security
    - Authenticated users can SELECT all workspaces
    - Only Admin and Gerente roles can INSERT, UPDATE, DELETE
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all delete for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow all insert for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow all select for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow all update for anon" ON workspaces;

-- Allow all authenticated users to view workspaces
CREATE POLICY "Authenticated users can view all workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (true);

-- Allow Admin and Gerente to create workspaces
CREATE POLICY "Admin and Gerente can create workspaces"
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

-- Allow Admin and Gerente to update workspaces
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

-- Allow Admin and Gerente to delete workspaces
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
