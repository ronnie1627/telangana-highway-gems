-- Auto-grant admin role on signup for the KK Realtors business email
create or replace function public.handle_new_user_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'kkrealtors02@gmail.com' then
    insert into public.user_roles(user_id, role)
    values (new.id, 'admin'::app_role)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_admin on auth.users;
create trigger on_auth_user_created_admin
after insert on auth.users
for each row execute function public.handle_new_user_admin();