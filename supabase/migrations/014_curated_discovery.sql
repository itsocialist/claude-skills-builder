-- Add featured column to market_listings for Staff Picks
alter table market_listings 
add column featured boolean default false;

-- Create index for faster filtering of featured items
create index idx_market_listings_featured on market_listings(featured);

-- Only admins can update the featured status (policies already cover update based on user_id, 
-- but we might want a specific policy for admins if we had a strict admin role in RLS.
-- For now, we rely on the implementation that only our admin dashboard (or manual DB update) changes this.)
