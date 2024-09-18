create table public.users (
    id            uuid references auth.users on delete cascade not null primary key,
    name          text not null,
    email         text not null unique,
    role          text not null default 'user',
    created_at    timestamp with time zone default now() not null
);

create table public.projects (
    id            uuid default uuid_generate_v4() primary key,
    name          text not null,
    description   text,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    owner        uuid not null references public.users(id),
    published     boolean not null default false
);

create table public.scenes (
    id            uuid default uuid_generate_v4() primary key,
    project_id    uuid not null references public.projects(id),
    name          text not null,
    description   text not null,
    is_main_scene boolean not null default false,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    visible       boolean not null default true
);

comment on table public.scenes is 'SCENE DATA';

create table public.points_of_interest (
    id            uuid default uuid_generate_v4() primary key,
    scene_id      uuid not null references public.scenes(id),
    name          text not null,
    description   text not null,
    design_data   jsonb not null,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    visible       boolean not null default true
);

comment on table public.points_of_interest is 'POI DATA';

create or replace function public.update_last_updated_column()
returns trigger as $$
begin
    new.last_updated = now();
    return new;
end;
$$ language plpgsql;

create trigger update_last_updated_trigger
before update on public.projects
for each row execute function public.update_last_updated_column();

create trigger update_last_updated_trigger
before update on public.scenes
for each row execute function public.update_last_updated_column();

create trigger update_last_updated_trigger
before update on public.points_of_interest
for each row execute function public.update_last_updated_column();



create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, name, email, role)
    values (new.id, new.raw_user_meta_data ->> 'name', new.email, 'user');
    return new;
end;
$$ language plpgsql security definer set search_path = auth, public;;

create trigger handle_new_user_trigger
after insert on auth.users
for each row execute function public.handle_new_user();




create or replace function public.handle_new_project()
returns trigger as $$
begin
    insert into public.scenes (project_id, name, description, is_main_scene)
    values (new.id, 'Main Scene', 'The main scene for the project', true);
    return new;
end;
$$ language plpgsql security definer set search_path = auth, public;

create trigger handle_new_project_trigger
after insert on public.projects
for each row execute function public.handle_new_project();



create or replace function public.authorize(user_id uuid, project_id uuid)
returns boolean as $$
declare
    project_owner uuid;
begin
    select owner from public.projects where id = project_id into project_owner;
    if project_owner = user_id then
        return true;
    end if;
    return false;
end;
$$ language plpgsql security definer set search_path = public;;


insert into storage.buckets
  (id, name, public)
values
  ('projects_scenes_files', 'Projects Scenes Files', true);
create policy "Everyone can read files" on storage.objects for select using (true);
create policy "Project Owner can add a file" on storage.objects for insert to authenticated with check (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));
create policy "Project Owner can update a file" on storage.objects for update to authenticated using (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid)) with check (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));
create policy "Project Owner can delete a file" on storage.objects for delete to authenticated using (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));




