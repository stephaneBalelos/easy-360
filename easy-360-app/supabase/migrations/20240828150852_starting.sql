CREATE EXTENSION IF NOT EXISTS pg_jsonschema SCHEMA extensions;

create table public.users (
    id            uuid not null primary key,
    auth_id       uuid not null references auth.users(id) on delete cascade,
    name          text not null,
    email         text not null unique,
    role          text not null default 'user',
    created_at    timestamp with time zone default now() not null
);
comment on table public.users is 'USER DATA';
alter table public.users enable row level security;

create table public.projects (
    id            uuid default uuid_generate_v4() primary key,
    name          text not null,
    description   text,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    owner        uuid not null references public.users(id) on delete cascade,
    published     boolean not null default false,
    settings      jsonb not null
);
comment on table public.projects is 'PROJECT DATA';
alter table public.projects add constraint check_settings check(
      extensions.jsonb_matches_schema(
    '{
        "type": "object",
        "properties": {
            "colors": {
                "type": "object",
                "properties": {
                    "primary": {
                        "type": "string",
                        "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    },
                    "secondary": {
                        "type": "string",
                        "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    },
                    "body": {
                        "type": "string",
                        "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    }
                }
            }
        }
    }',
    settings
  )
);
alter table public.projects enable row level security;


create table public.scenes (
    id            uuid default uuid_generate_v4() primary key,
    project_id    uuid not null references public.projects(id) on delete cascade,
    name          text not null,
    description   text not null,
    is_main_scene boolean not null default false,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    visible       boolean not null default true
);

comment on table public.scenes is 'SCENE DATA';
alter table public.scenes enable row level security;


create table public.points_of_interest (
    id            uuid default uuid_generate_v4() primary key,
    scene_id      uuid not null references public.scenes(id) on delete cascade,
    project_id    uuid not null references public.projects(id) on delete cascade,
    name          text not null,
    description   text not null,
    design_data   jsonb not null,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
    linked_scene_id  uuid references public.scenes(id) on delete set null,
    visible       boolean not null default true
);
comment on table public.points_of_interest is 'POI DATA';
alter table public.points_of_interest enable row level security;


-- Triggers
-- -- Delete Auth User when deleting a user
create or replace function public.delete_auth_user()
returns trigger as $$
begin
    delete from auth.users where id = old.id;
    return old;
end;
$$ language plpgsql;

create trigger delete_auth_user_trigger
before delete on public.users
for each row execute function public.delete_auth_user();


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
    insert into public.users (id, auth_id, name, email, role)
    values (new.id, new.id, new.raw_user_meta_data ->> 'name', new.email, 'user');
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


-- Policies
create policy "Users can read their own data" on public.users for select using (auth.uid() = id);
create policy "Users can update their own data" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can delete their own data" on public.users for delete using (auth.uid() = id);

create policy "Everyone can read projects" on public.projects for select using (true);
create policy "Project Owner can add a project" on public.projects for insert to authenticated with check (true);
create policy "Project Owner can update a project" on public.projects for update to authenticated using (public.authorize((select auth.uid()), id));
create policy "Project Owner can delete a project" on public.projects for delete to authenticated using (public.authorize((select auth.uid()), id));

create policy "Everyone can read scenes" on public.scenes for select using (true);
create policy "Project Owner can add a scene" on public.scenes for insert to authenticated with check (public.authorize((select auth.uid()), project_id));
create policy "Project Owner can update a scene" on public.scenes for update to authenticated using (public.authorize((select auth.uid()), project_id));
create policy "Project Owner can delete a scene" on public.scenes for delete to authenticated using (public.authorize((select auth.uid()), project_id));

create policy "Everyone can read points of interest" on public.points_of_interest for select using (true);
create policy "Project Owner can add a point of interest" on public.points_of_interest for insert to authenticated with check (public.authorize((select auth.uid()), project_id));
create policy "Project Owner can update a point of interest" on public.points_of_interest for update to authenticated using (public.authorize((select auth.uid()), project_id));
create policy "Project Owner can delete a point of interest" on public.points_of_interest for delete to authenticated using (public.authorize((select auth.uid()), project_id));


insert into storage.buckets
  (id, name, public)
values
  ('projects_scenes_files', 'Projects Scenes Files', true);
create policy "Everyone can read files" on storage.objects for select using (true);
create policy "Project Owner can add a file" on storage.objects for insert to authenticated with check (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));
create policy "Project Owner can update a file" on storage.objects for update to authenticated using (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid)) with check (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));
create policy "Project Owner can delete a file" on storage.objects for delete to authenticated using (public.authorize((select auth.uid()), ((storage.foldername(name))[2])::uuid));




