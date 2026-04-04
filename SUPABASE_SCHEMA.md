# Supabase Database Schema

## Tables

### profiles
- `id`: uuid, primary key, references auth.users
- `full_name`: text
- `avatar_url`: text
- `student_id`: text, unique
- `budget_balance`: numeric, default: 500
- `points`: integer, default: 0
- `updated_at`: timestamp with time zone

### menu_items
- `id`: uuid, primary key, default: uuid_generate_v4()
- `name`: text, not null
- `description`: text
- `price`: numeric, not null
- `calories`: integer
- `protein`: integer
- `carbs`: integer
- `fats`: integer
- `is_veg`: boolean, default: true
- `category`: text
- `image_url`: text
- `prep_time`: integer (minutes)
- `created_at`: timestamp with time zone

### orders
- `id`: uuid, primary key, default: uuid_generate_v4()
- `user_id`: uuid, references profiles.id
- `status`: text (pending, preparing, ready, completed, cancelled)
- `total_amount`: numeric
- `type`: text (individual, group)
- `pickup_token`: text
- `pickup_location`: text
- `created_at`: timestamp with time zone

### order_items
- `id`: uuid, primary key, default: uuid_generate_v4()
- `order_id`: uuid, references orders.id
- `menu_item_id`: uuid, references menu_items.id
- `quantity`: integer, not null
- `price_at_time`: numeric, not null

### group_orders
- `id`: uuid, primary key, default: uuid_generate_v4()
- `host_id`: uuid, references profiles.id
- `status`: text (open, closed, completed)
- `split_strategy`: text (equal, item-based)
- `created_at`: timestamp with time zone

### group_order_members
- `id`: uuid, primary key, default: uuid_generate_v4()
- `group_order_id`: uuid, references group_orders.id
- `user_id`: uuid, references profiles.id
- `status`: text (browsing, ready)

### nutrition_logs
- `id`: uuid, primary key, default: uuid_generate_v4()
- `user_id`: uuid, references profiles.id
- `calories`: integer
- `protein`: integer
- `carbs`: integer
- `fats`: integer
- `logged_at`: date, default: current_date
