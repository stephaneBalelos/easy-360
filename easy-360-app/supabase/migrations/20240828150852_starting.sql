create table public.projects (
    id            uuid default uuid_generate_v4() primary key,
    name          text not null,
    description   text,
    created_at    timestamp with time zone default now() not null,
    last_updated  timestamp with time zone default now() not null,
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



create or replace function public.handle_new_project()
returns trigger as $$
begin
    insert into public.scenes (project_id, name, description, is_main_scene)
    values (new.id, 'Main Scene', 'The main scene for the project', true);
    return new;
end;
$$ language plpgsql;

create trigger handle_new_project_trigger
after insert on public.projects
for each row execute function public.handle_new_project();


insert into storage.buckets
  (id, name, public)
values
  ('projects_scenes', 'Projects Scenes', true);




