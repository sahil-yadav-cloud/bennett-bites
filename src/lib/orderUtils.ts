import { supabase } from '@/lib/supabase';
import { CartItem } from '@/src/context/CartContext';

export async function placeOrder(profileId: string | undefined, cart: CartItem[], totalAmount: number) {
  if (cart.length === 0) throw new Error("Cart is empty");

  // If profileId is not provided, try to get the first one (for demo purposes)
  let actualProfileId = profileId;
  if (!actualProfileId) {
    const { data } = await supabase.from('profiles').select('id').limit(1).single();
    actualProfileId = data?.id;
  }

  if (!actualProfileId) throw new Error("No profile found");

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: actualProfileId,
      total_amount: totalAmount,
      status: 'preparing',
      type: 'individual',
      pickup_token: `BB-${Math.floor(1000 + Math.random() * 9000)}-X`,
      pickup_location: 'Library Cafe Hub'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = cart.map(c => ({
    order_id: order.id,
    menu_item_id: c.item.id,
    quantity: c.qty,
    price_at_time: c.item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}
