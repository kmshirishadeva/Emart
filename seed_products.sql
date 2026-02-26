-- Seed Products
-- Run this in Supabase SQL Editor AFTER running database_setup.sql

-- Insert products
INSERT INTO "Product" ("id", "name", "category", "price", "imageUrl", "createdAt", "updatedAt") VALUES
('clx1', 'Fresh Bananas', 'Fruits', 49.0, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx2', 'Red Apples', 'Fruits', 89.0, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx3', 'Sweet Mangoes', 'Fruits', 120.0, 'https://images.unsplash.com/photo-1605027990121-1c8e0c5e5e5e?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx4', 'Fresh Oranges', 'Fruits', 75.0, 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx5', 'Basmati Rice 1kg', 'Groceries', 95.0, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx6', 'Toor Dal 1kg', 'Groceries', 125.0, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx7', 'Wheat Flour 1kg', 'Groceries', 45.0, 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx8', 'Sugar 1kg', 'Groceries', 42.0, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx9', 'Lay''s Classic Salted', 'Snacks', 20.0, 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx10', 'Kurkure Masala Munch', 'Snacks', 20.0, 'https://images.unsplash.com/photo-1612929633733-8d8c7c9e5b5e?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx11', 'Parle-G Biscuits', 'Snacks', 10.0, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx12', 'Maggi Noodles', 'Snacks', 14.0, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

