import { supabase } from '../lib/supabase';
import { menuItems, profiles } from '../src/lib/seedData';

async function seed() {
  console.log('Seeding menu items...');
  const { error: menuError } = await supabase
    .from('menu_items')
    .upsert(menuItems, { onConflict: 'name' });

  if (menuError) console.error('Error seeding menu:', menuError);
  else console.log('Menu items seeded successfully.');

  console.log('Seeding profiles...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profiles, { onConflict: 'student_id' });

  if (profileError) console.error('Error seeding profiles:', profileError);
  else console.log('Profiles seeded successfully.');
}

seed();
