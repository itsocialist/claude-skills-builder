
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const TARGET_EMAILS = [
    'brianvdawson@gmail.com',
    'dev-admin@getclaudeskills.local'
];

const NEW_PASSWORD = 'password';

async function resetPasswords() {
    console.log(`Resetting passwords for: ${TARGET_EMAILS.join(', ')}`);

    for (const email of TARGET_EMAILS) {
        try {
            // 1. Find user by email (Admin API needed)
            // Actually listUsers and filter is safest if we don't have ID
            // But updateUserById needs ID.
            // Let's try listUsers first.

            // Note: listUsers is paginated but likely fine for small set
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

            if (listError) {
                console.error(`Error listing users: ${listError.message}`);
                continue;
            }

            const user = users.find(u => u.email === email);

            if (!user) {
                console.warn(`User found not: ${email} (Have you signed up yet?)`);

                // Optional: Create if missing?
                /*
                console.log(`Creating user: ${email}...`);
                const { error: createError } = await supabase.auth.admin.createUser({
                  email,
                  password: NEW_PASSWORD,
                  email_confirm: true
                });
                if (createError) console.error('Failed to create:', createError.message);
                else console.log('Created successfully!');
                */
                continue;
            }

            console.log(`Found user ${email} (ID: ${user.id}). Resetting password...`);

            const { error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: NEW_PASSWORD }
            );

            if (updateError) {
                console.error(`Failed to update password for ${email}:`, updateError.message);
            } else {
                console.log(`✅ Password updated to '${NEW_PASSWORD}' for ${email}`);
            }

        } catch (e) {
            console.error(`Unexpected error for ${email}:`, e);
        }
    }
}

resetPasswords();
