# Instrucciones para crear usuario Admin

Dado que se requiere el Service Role Key para crear usuarios mediante código, debes crear el usuario admin manualmente en el Dashboard de Supabase siguiendo estos pasos:

## Opción 1: Usar el Dashboard de Supabase (Recomendado)

1. Ve al Dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Authentication** → **Users**
4. Click en **Add user** → **Create new user**
5. Completa los datos:
   - **Email**: david.rueda@hotmail.es
   - **Password**: admin
   - **Auto Confirm User**: Activado (check)
6. Click en **Create user**
7. Copia el **User ID** que se muestra

## Opción 2: Usar SQL Editor (Alternativa)

Si prefieres usar SQL, sigue estos pasos:

1. Ve al Dashboard de Supabase → **SQL Editor**
2. Ejecuta esta consulta para obtener el ID del rol Admin:

```sql
SELECT id FROM roles WHERE name = 'Admin';
```

3. Copia el ID del rol
4. Crea el usuario manualmente en Authentication → Users (ver Opción 1, pasos 1-7)
5. Una vez creado el usuario, ejecuta esta consulta reemplazando los valores:

```sql
INSERT INTO user_roles (user_id, role_id)
VALUES (
  'USER_ID_AQUI',  -- Reemplaza con el ID del usuario creado
  '44034790-714b-4abd-8c9b-2d814a78062c'  -- ID del rol Admin
);
```

## Verificación

Para verificar que el usuario fue creado correctamente:

```sql
SELECT
  u.email,
  r.name as role_name
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'david.rueda@hotmail.es';
```

## Credenciales de acceso

Una vez creado el usuario, podrás iniciar sesión en la aplicación con:
- **Email**: david.rueda@hotmail.es
- **Password**: admin
