-- ─── Phase 1: Client Portal ───────────────────────────────────────────────────
-- Run this in Supabase SQL Editor

-- Messages between client and SOZO team, per order
create table if not exists order_messages (
  id          uuid        primary key default gen_random_uuid(),
  order_id    uuid        not null references orders(id) on delete cascade,
  sender_id   uuid        references profiles(id),
  sender_name text        not null,
  sender_role text        not null check (sender_role in ('client', 'agent', 'admin')),
  body        text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists order_messages_order_id_idx on order_messages(order_id);
create index if not exists order_messages_created_at_idx on order_messages(created_at);

-- Artwork/mockups uploaded by SOZO for client approval
create table if not exists order_artworks (
  id             uuid        primary key default gen_random_uuid(),
  order_id       uuid        not null references orders(id) on delete cascade,
  uploaded_by    uuid        references profiles(id),
  file_url       text        not null,
  file_name      text,
  notes          text,
  version        int         not null default 1,
  status         text        not null default 'pending'
                             check (status in ('pending', 'approved', 'rejected')),
  client_comment text,
  reviewed_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists order_artworks_order_id_idx on order_artworks(order_id);

-- RLS policies (enable RLS on both tables first)
alter table order_messages enable row level security;
alter table order_artworks  enable row level security;

-- Clients can read messages for their own orders
create policy "clients_read_own_messages" on order_messages
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_messages.order_id
        and o.customer_email = auth.jwt() ->> 'email'
    )
  );

-- Clients can insert messages on their own orders
create policy "clients_insert_messages" on order_messages
  for insert with check (
    sender_role = 'client'
    and exists (
      select 1 from orders o
      where o.id = order_messages.order_id
        and o.customer_email = auth.jwt() ->> 'email'
    )
  );

-- Staff (agent/admin) can read and write all messages
create policy "staff_all_messages" on order_messages
  for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('agent', 'admin', 'producer')
    )
  );

-- Clients can read artworks for their orders
create policy "clients_read_artworks" on order_artworks
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_artworks.order_id
        and o.customer_email = auth.jwt() ->> 'email'
    )
  );

-- Clients can update (approve/reject) artworks on their orders
create policy "clients_review_artworks" on order_artworks
  for update using (
    exists (
      select 1 from orders o
      where o.id = order_artworks.order_id
        and o.customer_email = auth.jwt() ->> 'email'
    )
  ) with check (status in ('approved', 'rejected'));

-- Staff can manage artworks
create policy "staff_all_artworks" on order_artworks
  for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('agent', 'admin', 'producer')
    )
  );
