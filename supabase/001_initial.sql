-- Run once in Supabase SQL Editor. All data belongs to auth.uid(); service key is server-only.
create table if not exists public.sela_operations (
 user_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null, payload jsonb not null,
 received_at timestamptz not null default now(),
 primary key(user_id,id),
 check (jsonb_typeof(payload)='object' and payload->>'id'=id::text),
 check (octet_length(payload::text)<32768)
);
alter table public.sela_operations enable row level security;
revoke all on public.sela_operations from anon, authenticated;
grant select,insert on public.sela_operations to authenticated;
create policy "Read own operations" on public.sela_operations for select to authenticated using ((select auth.uid())=user_id);
create policy "Append own operations" on public.sela_operations for insert to authenticated with check ((select auth.uid())=user_id);

create table if not exists public.ai_requests (
 user_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null, kind text not null check(kind in ('text','image')),
 input_hash text not null, status text not null check(status in ('pending','success','failed')),
 result jsonb, created_at timestamptz not null default now(),primary key(user_id,id)
);
create index if not exists ai_requests_day on public.ai_requests(created_at,user_id);
alter table public.ai_requests enable row level security;
revoke all on public.ai_requests from anon,authenticated;
grant select on public.ai_requests to authenticated;
create policy "Read own usage" on public.ai_requests for select to authenticated using ((select auth.uid())=user_id);
grant all on public.ai_requests to service_role;
create or replace function public.reserve_ai_request(p_user uuid,p_request uuid,p_kind text,p_hash text,p_user_limit integer,p_global_limit integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare existing public.ai_requests; start_day timestamptz := date_trunc('day',now() at time zone 'UTC') at time zone 'UTC';
begin
 perform pg_advisory_xact_lock(418173);
 select * into existing from public.ai_requests where user_id=p_user and id=p_request;
 if found then
  if existing.input_hash<>p_hash then return jsonb_build_object('status','mismatch'); end if;
  return jsonb_build_object('status',existing.status,'result',existing.result);
 end if;
 if (select count(*) from public.ai_requests where user_id=p_user and created_at>=start_day)>=p_user_limit or
    (select count(*) from public.ai_requests where created_at>=start_day)>=p_global_limit then
  return jsonb_build_object('status','quota');
 end if;
 insert into public.ai_requests(user_id,id,kind,input_hash,status) values(p_user,p_request,p_kind,p_hash,'pending');
 return jsonb_build_object('status','reserved');
end $$;
revoke all on function public.reserve_ai_request(uuid,uuid,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.reserve_ai_request(uuid,uuid,text,text,integer,integer) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('sela-media','sela-media',false,10000000,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy "Read own vocabulary images" on storage.objects for select to authenticated
using (bucket_id='sela-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
-- Uploads happen through authenticated, quota-limited server endpoints only.
