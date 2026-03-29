
DROP POLICY "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT TO public
USING ((auth.uid() = user_id) OR (user_id IS NULL));
