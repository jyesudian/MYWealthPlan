-- 1. Profiles Table (linked to Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  age integer default 38,
  marital_status text default 'Single',
  financial_health_score integer default 78,
  net_worth numeric(12, 2) default 450000.00,
  savings_rate integer default 29,
  retirement_readiness integer default 84,
  monthly_inflow numeric(12, 2) default 12000.00,
  monthly_outflow numeric(12, 2) default 8500.00,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create view policy
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Create update policy
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. Assets & Liabilities Table
create table if not exists public.assets_liabilities (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('asset', 'liability')),
  category text not null, -- e.g., 'EPF', 'Property', 'Cash', 'Credit Card', 'Mortgage'
  name text not null,     -- e.g., 'Maybank Visa Signature', 'EPF Account 1'
  amount numeric(12, 2) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assets_liabilities enable row level security;

create policy "Users can manage their own assets/liabilities" on public.assets_liabilities
  for all using (auth.uid() = profile_id);

-- 3. Goals Table
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text not null, -- e.g., 'Education', 'Property', 'Travel', 'Wealth'
  target_amount numeric(12, 2) not null,
  target_year integer not null,
  current_savings numeric(12, 2) not null default 0.00,
  monthly_contribution numeric(12, 2) not null default 0.00,
  status text not null check (status in ('On Track', 'Needs Attention', 'Off Track')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

create policy "Users can manage their own goals" on public.goals
  for all using (auth.uid() = profile_id);

-- 4. Insurance Policies Table
create table if not exists public.insurance_policies (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('life', 'medical', 'critical_illness', 'disability')),
  coverage_amount numeric(12, 2) not null,
  need_amount numeric(12, 2) not null,
  status text not null,
  notes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.insurance_policies enable row level security;

create policy "Users can manage their own insurance" on public.insurance_policies
  for all using (auth.uid() = profile_id);

-- 5. Trigger Function to automatically seed a new user's profile and data
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert profile
  insert into public.profiles (id, full_name, age, marital_status, financial_health_score, net_worth, savings_rate, retirement_readiness)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Ahmad Razali'),
    38,
    'Married',
    78,
    450000.00,
    29,
    84
  );

  -- Insert dummy assets (EPF, Property, Cash, Investments)
  insert into public.assets_liabilities (profile_id, type, category, name, amount)
  values
    (new.id, 'asset', 'EPF', 'EPF & Retirement', 337500.00),
    (new.id, 'asset', 'Property', 'Real Estate (Property)', 225000.00),
    (new.id, 'asset', 'Cash', 'Cash & Equivalents', 75000.00),
    (new.id, 'asset', 'Investments', 'Equities & Investments', 112500.00),
    (new.id, 'liability', 'Credit Card', 'Maybank Visa Signature', 15000.00),
    (new.id, 'liability', 'Mortgage', 'Housing Mortgage Loan', 200000.00),
    (new.id, 'liability', 'Vehicle Loan', 'Car Loan', 85000.00);

  -- Insert dummy goals (Education, Upgrade Home)
  insert into public.goals (profile_id, name, category, target_amount, target_year, current_savings, monthly_contribution, status)
  values
    (new.id, 'Child''s Education', 'Education', 150000.00, 2035, 45000.00, 500.00, 'On Track'),
    (new.id, 'Upgrade Home', 'Property', 100000.00, 2028, 20000.00, 800.00, 'Needs Attention');

  -- Insert dummy insurance policies
  insert into public.insurance_policies (profile_id, type, coverage_amount, need_amount, status, notes)
  values
    (new.id, 'life', 500000.00, 1200000.00, 'Underinsured', 'Shortfall of RM 700,000 based on the 10x annual expenses rule. Consider term life for cost-effective coverage.'),
    (new.id, 'medical', 1500000.00, 1000000.00, 'Adequate', 'Company plus personal standalone plan provides comprehensive coverage against medical inflation.'),
    (new.id, 'critical_illness', 1000000.00, 360000.00, 'Action Needed', 'Recommended 3 years of income replacement (RM 360k) for recovery period.'),
    (new.id, 'disability', 500000.00, 500000.00, 'Adequate', 'Current basic life policy includes a matching TPD rider which meets minimum requirements.');

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
