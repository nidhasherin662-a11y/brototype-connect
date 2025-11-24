# 🔐 Admin Account Setup Instructions

## IMPORTANT: Follow These Steps Exactly

### Step 1: Create Your Admin Account

1. Open your app and go to the **Student Login** page at `/auth`
2. Click on "Sign Up" 
3. Use these credentials:
   - **Email**: `admin@studentvoice.com`
   - **Password**: `Admin2024!Secure`
   - **Name**: `System Administrator`
   - **Department**: `Administration`
   - **Roll No**: `ADMIN001`

4. Complete the signup process

### Step 2: Assign Super Admin Role

After creating the account above, you need to assign the super admin role. Go to your backend database and run this SQL:

```sql
-- First, find your user ID
SELECT id, email, name FROM profiles WHERE email = 'admin@studentvoice.com';

-- Copy the ID from the result, then run this (replace YOUR_USER_ID with the actual ID):
INSERT INTO admin_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

### Step 3: Login to Admin Portal

1. Go to `/admin-auth`
2. Login with:
   - **Email**: `admin@studentvoice.com`
   - **Password**: `Admin2024!Secure`

You should now have full admin access! 🎉

---

## Quick SQL Script (All-in-One)

If you want to set up the admin after signup, run this complete script:

```sql
-- Get the user ID and assign super admin role in one go
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the admin email
    SELECT id INTO admin_user_id 
    FROM profiles 
    WHERE email = 'admin@studentvoice.com';
    
    -- If user exists, assign super admin role
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO admin_roles (user_id, role)
        VALUES (admin_user_id, 'super_admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'super_admin';
        
        RAISE NOTICE 'Super admin role assigned successfully to %', admin_user_id;
    ELSE
        RAISE NOTICE 'User not found. Please create the account first at /auth';
    END IF;
END $$;
```

---

## Alternative: Create Additional Admins

To create more admin accounts:

1. Have them sign up normally at `/auth`
2. Get their user ID from the profiles table
3. Run: 
```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('their-user-id-here', 'super_admin');
-- Or use 'moderator' or 'admin' for different permission levels
```

---

## Troubleshooting

### "Can't login to admin portal"
- Make sure you created the account at `/auth` first (NOT `/admin-auth`)
- Verify the super admin role was assigned in the database
- Check you're using the correct email and password
- Try clearing browser cache

### "Access denied" message
- The admin role might not be assigned
- Run the SQL script again to assign the role
- Make sure you're using the admin_roles table, not trying to add a column to profiles

### "User not found"
- You must sign up at `/auth` BEFORE running the SQL
- The account must exist in the auth.users and profiles tables first

---

## Security Notes

🔒 **Change the default password** after first login!

🔐 **Never share admin credentials** with unauthorized users

🛡️ **Use strong passwords** for production environments

---

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Verify your database connection
3. Make sure RLS policies are enabled
4. Visit the FAQ page at `/faq` for more help
