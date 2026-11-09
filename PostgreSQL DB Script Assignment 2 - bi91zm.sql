/*
The objects are dropped and created in this order:
- Types            (Starts at line 13 at the time of subsmission)
- Tables           (Starts at line 59 at the time of subsmission)
- Procedure        (Starts at line 132 at the time of subsmission)
- Functions        (Starts at line 180 at the time of subsmission)
- Triggers         (Starts at line 217 at the time of subsmission)
- Sample Dataset   (Starts at line 241 at the time of subsmission)
*/

-- USER DEFINED TYPES

DROP TYPE IF EXISTS order_item_type CASCADE;
DROP TYPE IF EXISTS variant_type CASCADE;
DROP TYPE IF EXISTS shipping_address_type CASCADE;
DROP TYPE IF EXISTS address_type CASCADE;

-- Soft deletion is implemented with "active" fields in Types and Tables to prevent invalid data in past orders

CREATE TYPE address_type AS (
    address_id INTEGER,
    recipient_name varchar(25),
    street VARCHAR(100),
    city VARCHAR(60),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(56),
    active BOOLEAN);

CREATE TYPE shipping_address_type AS (
    recipient_name varchar(25),
    street VARCHAR(100),
    city VARCHAR(60),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(56));

CREATE TYPE variant_type AS (
    variant_id INTEGER,
    sku VARCHAR(50),
    size VARCHAR(25),
    color VARCHAR(25),
    price_adjustment DECIMAL(10,2),
    stock_quantity INTEGER,
    active BOOLEAN);

-- The orders table has a slightly different address type as it only stores one address
CREATE TYPE order_item_type AS (
    item_id INTEGER,
    variant_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2));


-- TABLES

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products_categories_links CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS pet_products CASCADE;
DROP TABLE IF EXISTS electronics_products CASCADE;
DROP TABLE IF EXISTS clothing_products CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS base_entity CASCADE;

-- Base entity table for inheriting temporal data to all entities. It has an entity ID not shown in the UML as it is of no use but each table inheriting this would have a unique entity ID that could be used to generate database logs with this table
CREATE TABLE base_entity (
    entity_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- User table. The default_address_id is meant for fetching address for auto filling the shipping information in orders.
CREATE TABLE users (
    user_id INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(50) NOT NULL,
    forenames VARCHAR(25),
    last_name VARCHAR(25) NOT NULL,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    default_address_id INTEGER,
    addresses address_type[]) INHERITS (base_entity);

-- Products has three subtypes for this demonstration, only two are published and have orders. There would be as many subtypes as needed in real world application
CREATE TABLE products (
    product_id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    variants variant_type[] NOT NULL) INHERITS (base_entity);

CREATE TABLE clothing_products (
    size_chart VARCHAR(1000) NOT NULL,
    fabric_type VARCHAR(100) NOT NULL) INHERITS (products);

CREATE TABLE electronics_products (
    warranty_period VARCHAR(25) NOT NULL,
    voltage_requirements VARCHAR(25) NOT NULL) INHERITS (products);

CREATE TABLE pet_products (
    pet_type VARCHAR(50) NOT NULL,
    material VARCHAR(100) NOT NULL) INHERITS (products);

-- There is only one categories table to keep things simple and within the given limits, otherwise it might have other subtypes as well
CREATE TABLE categories (
    category_id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    description TEXT) INHERITS (base_entity);

-- The following table holds relations between products and categories. This way multiple links can be made without having to add a new field in products or categories for each link
CREATE TABLE products_categories_links (
    product_id INTEGER NOT NULL ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE) INHERITS (base_entity);

-- This last order table is a bit basic but I did not want to complicate things more than necessary.
CREATE TABLE orders (
    order_id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    item order_item_type NOT NULL,
    status VARCHAR(25) NOT NULL,
    total_amount DECIMAL(12,2),
    shipping_address shipping_address_type NOT NULL) INHERITS (base_entity);


-- STORED PROCEDURES

DROP PROCEDURE IF EXISTS update_variant_price;

-- Prodedure for updating additional price of a variant
CREATE OR REPLACE PROCEDURE update_variant_price
(
	pid INTEGER,
	vid INTEGER,
	price DECIMAL(10,2)
)
AS
$$
BEGIN

	IF pid IS NULL THEN
		RAISE EXCEPTION 'product_id must have a value';
	END IF;
	IF vid IS NULL THEN
		RAISE EXCEPTION 'vairant_id must have a value';
	END IF;
	IF price IS NULL THEN
		RAISE EXCEPTION 'price can not be null';
	END IF;
    IF price < 0 THEN
        RAISE EXCEPTION 'price can not be negative';
    END IF;

	WITH variant_for_update AS (
	SELECT
	p.product_id AS p_id,
	p.variants[vid].variant_id AS v_id
	FROM products p
	WHERE p.product_id = pid
	FOR UPDATE)
	
	UPDATE products 
	SET variants[variant_for_update.v_id].price_adjustment = price
	FROM variant_for_update
	WHERE products.product_id = variant_for_update.p_id;
	
END;
$$
LANGUAGE plpgsql;




-- STORED FUNCTIONS

DROP FUNCTION IF EXISTS update_last_modified CASCADE;
DROP FUNCTION IF EXISTS most_frequent_buyer;

-- Function to get the most frequent buyer of a single product variant
CREATE OR REPLACE FUNCTION most_frequent_buyer(pid INTEGER, vid INTEGER)
RETURNS INTEGER
AS
$$
DECLARE uid INTEGER;
BEGIN
	SELECT o.user_id INTO uid
	FROM orders o
	WHERE (o.item).product_id = pid AND (o.item).variant_id = vid
	GROUP BY o.user_id
	ORDER BY count(o.user_id) DESC, o.user_id
	LIMIT 1;
	RETURN uid;
END;
$$
LANGUAGE plpgsql;

-- Trigger Function
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS TRIGGER 
AS
$$
BEGIN
    NEW.last_modified := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;


-- TRIGGERS
-- Update the last_modified when an update happens on a product

DROP TRIGGER IF EXISTS clothing_prod_update ON clothing_products;
DROP TRIGGER IF EXISTS electronics_prod_update ON electronics_products;
DROP TRIGGER IF EXISTS pet_prod_update ON pet_products;

CREATE OR REPLACE TRIGGER pet_prod_update
BEFORE UPDATE ON pet_products
FOR EACH ROW
EXECUTE PROCEDURE update_last_modified();

CREATE OR REPLACE TRIGGER electronics_prod_update
BEFORE UPDATE ON electronics_products
FOR EACH ROW
EXECUTE PROCEDURE update_last_modified();

CREATE OR REPLACE TRIGGER clothing_prod_update
BEFORE UPDATE ON clothing_products
FOR EACH ROW
EXECUTE PROCEDURE update_last_modified();



-- SAMPLE DATASET

-- Users
INSERT INTO users (user_id, username, email, password_hash, forenames, last_name, last_login, is_active, default_address_id, addresses, created_at, last_modified) VALUES
    (1, 'john_smith', 'smith.j@domain.com', 'a1b2c3d4e5f6g7h8i9j0', 'John', 'Smith', '2025-02-15 10:30:00', TRUE, 2, 
    ARRAY[
      (1, 'John Smith', '10 Downing Street', 'London', 'England', 'SW1A 2AA', 'UK', FALSE)::address_type,
      (2, 'John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK', TRUE)::address_type
    ], '2024-06-06 09:15:22', '2024-06-9 17:13:55'),

    (2, 'sarah_jones', 'jones.s@domain.com', 'b2c3d4e5f6g7h8i9j0k1', 'Sarah', 'Jones', '2025-03-20 14:45:00', TRUE, 1, 
    ARRAY[
      (1, 'Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK', TRUE)::address_type
    ], '2024-06-15 11:20:33', '2024-07-05 11:20:33'),

    (3, 'david_wilson', 'wilson.d@domain.com', 'c3d4e5f6g7h8i9j0k1l2', 'David', 'Wilson', '2024-12-10 16:20:00', FALSE, 1, 
    ARRAY[
      (1, 'David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK', FALSE)::address_type
    ], '2024-07-03 14:05:44', '2024-12-10 18:05:44'),

    (4, 'emma_brown', 'brown.e@domain.com', 'd4e5f6g7h8i9j0k1l2m3', 'Emma', 'Brown', '2025-04-25 09:10:00', TRUE, 2, 
    ARRAY[
      (1, 'Emma Brown', '15 Regent Street', 'London', 'England', 'W1B 5AH', 'UK', FALSE)::address_type,
      (2, 'Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK', TRUE)::address_type,
      (3, 'Robert Brown', '8 Bond Street', 'London', 'England', 'W1S 1YF', 'UK', TRUE)::address_type
    ], '2024-08-01 10:30:55', '2024-11-15 12:40:00'),

    (5, 'michael_taylor', 'taylor.m@domain.com', 'e5f6g7h8i9j0k1l2m3n4', 'Michael', 'Taylor', '2025-03-24 18:30:00', TRUE, 1, 
    ARRAY[
      (1, 'Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK', TRUE)::address_type,
      (2, 'Lisa Taylor', '12 Camden High Street', 'London', 'England', 'NW1 0JH', 'UK', TRUE)::address_type
    ], '2024-09-02 16:45:11', '2024-12-20 09:15:00'),

    (6, 'olivia_williams', 'williams.o@domain.com', 'f6g7h8i9j0k1l2m3n4o5', 'Olivia', 'Williams', '2025-05-16 11:20:00', TRUE, 2, 
    ARRAY[
      (1, 'Olivia Williams', '25 Knightsbridge', 'London', 'England', 'SW1X 7LY', 'UK', FALSE)::address_type,
      (2, 'Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK', TRUE)::address_type
    ], '2024-10-02 13:25:33', '2025-01-20 14:50:00'),

    (7, 'james_johnson', 'johnson.j@domain.com', 'g7h8i9j0k1l2m3n4o5p6', 'James', 'Johnson', '2025-05-17 14:30:00', TRUE, 1, 
    ARRAY[
      (1, 'James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK', TRUE)::address_type
    ], '2024-11-20 15:40:22', '2024-11-20 15:40:22'),

    (8, 'sophia_davis', 'davis.s@domain.com', 'h8i9j0k1l2m3n4o5p6q7', 'Sophia', 'Davis', '2025-05-14 10:15:00', TRUE, 2, 
    ARRAY[
      (1, 'Sophia Davis', '9 Covent Garden', 'London', 'England', 'WC2E 8RA', 'UK', FALSE)::address_type,
      (2, 'Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK', TRUE)::address_type,
      (3, 'William Davis', '33 Shaftesbury Avenue', 'London', 'England', 'W1D 7EH', 'UK', TRUE)::address_type
    ], '2024-12-15 12:55:44', '2025-01-10 11:30:00'),

    (9, 'robert_miller', 'miller.r@domain.com', 'i9j0k1l2m3n4o5p6q7r8', 'Robert', 'Miller', '2025-05-05 13:45:00', TRUE, 2, 
    ARRAY[
      (1, 'Robert Miller', '5 Carnaby Street', 'London', 'England', 'W1F 9PB', 'UK', FALSE)::address_type,
      (2, 'Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK', TRUE)::address_type
    ], '2025-01-08 10:10:11', '2025-02-01 16:20:00'),

    (10, 'amelia_wilson', 'wilson.a@domain.com', 'j0k1l2m3n4o5p6q7r8s9', 'Amelia', 'Wilson', '2025-05-18 16:50:00', TRUE, 1, 
    ARRAY[
      (1, 'Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK', TRUE)::address_type
    ], '2025-01-20 14:30:33', '2025-01-20 14:30:33'),

    (11, 'william_moore', 'moore.w@domain.com', 'k1l2m3n4o5p6q7r8s9t0', 'William', 'Moore', '2025-05-15 09:30:00', TRUE, 3, 
    ARRAY[
      (1, 'William Moore', '27 Baker Street', 'London', 'England', 'NW1 6XE', 'UK', FALSE)::address_type,
      (2, 'Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK', TRUE)::address_type,
      (3, 'William Moore', '8 Paddington Street', 'London', 'England', 'W1U 5QH', 'UK', TRUE)::address_type,
      (4, 'George Moore', '15 Harley Street', 'London', 'England', 'W1G 9QQ', 'UK', TRUE)::address_type
    ], '2025-02-10 11:45:55', '2025-02-26 10:15:00'),

    (12, 'isabella_taylor', 'taylor.i@domain.com', 'l2m3n4o5p6q7r8s9t0u1', 'Isabella', 'Taylor', '2025-03-15 11:20:00', FALSE, 1, 
    ARRAY[
      (1, 'Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK', FALSE)::address_type
    ], '2025-02-25 16:20:22', '2025-03-15 16:20:22'),

    (13, 'thomas_anderson', 'anderson.t@domain.com', 'm3n4o5p6q7r8s9t0u1v2', 'Thomas', 'Anderson', '2025-05-18 14:10:00', TRUE, 1, 
    ARRAY[
      (1, 'Thomas Anderson', '9 The Strand', 'London', 'England', 'WC2N 5HR', 'UK', TRUE)::address_type,
      (2, 'Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK', TRUE)::address_type
    ], '2025-03-05 09:35:33', '2025-03-18 15:45:00'),

    (14, 'charlotte_thomas', 'thomas.c@domain.com', 'n4o5p6q7r8s9t0u1v2w3', 'Charlotte', 'Thomas', '2025-05-16 10:45:00', TRUE, 1, 
    ARRAY[
      (1, 'Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK', TRUE)::address_type
    ], '2025-03-15 13:50:44', '2025-03-15 13:50:44'),

    (15, 'daniel_white', 'white.d@domain.com', 'o5p6q7r8s9t0u1v2w3x4', 'Daniel', 'White', '2025-05-17 15:30:00', TRUE, 2, 
    ARRAY[
      (1, 'Daniel White', '4 St James''s Square', 'London', 'England', 'SW1Y 4JU', 'UK', FALSE)::address_type,
      (2, 'Daniel White', '12 Haymarket', 'London', 'England', 'SW1Y 4DQ', 'UK', TRUE)::address_type,
      (3, 'Lucy White', '25 Cockspur Street', 'London', 'England', 'SW1Y 5BN', 'UK', TRUE)::address_type
    ], '2025-04-01 08:25:55', '2025-04-10 14:20:00'),

    (16, 'matthew_martin', 'martin.m@domain.com', 'p6q7r8s9t0u1v2w3x4y5', 'Matthew', 'Martin', '2025-05-14 09:15:00', TRUE, 2, 
    ARRAY[
      (1, 'Matthew Martin', '8 Berkeley Square', 'London', 'England', 'W1J 6DA', 'UK', FALSE)::address_type,
      (2, 'Matthew Martin', '15 Grosvenor Square', 'London', 'England', 'W1K 6JP', 'UK', TRUE)::address_type
    ], '2025-04-10 11:30:11', '2025-04-20 10:45:00'),

    (17, 'emily_thompson', 'thompson.e@domain.com', 'q7r8s9t0u1v2w3x4y5z6', 'Emily', 'Thompson', '2025-05-15 11:50:00', TRUE, 1, 
    ARRAY[
      (1, 'Emily Thompson', '22 Mount Street', 'London', 'England', 'W1K 2RD', 'UK', TRUE)::address_type
    ], '2025-04-18 14:40:22', '2025-04-18 14:40:22'),

    (18, 'andrew_robinson', 'robinson.a@domain.com', 'r8s9t0u1v2w3x4y5z6a7', 'Andrew', 'Robinson', '2025-05-18 14:20:00', TRUE, 2, 
    ARRAY[
      (1, 'Andrew Robinson', '7 Curzon Street', 'London', 'England', 'W1J 5HG', 'UK', FALSE)::address_type,
      (2, 'Andrew Robinson', '14 Park Lane', 'London', 'England', 'W1K 7AN', 'UK', TRUE)::address_type,
      (3, 'Grace Robinson', '21 South Audley Street', 'London', 'England', 'W1K 2PW', 'UK', TRUE)::address_type
    ], '2025-04-25 16:55:33', '2025-05-01 13:10:00'),

    (19, 'sophie_clark', 'clark.s@domain.com', 's9t0u1v2w3x4y5z6a7b8', 'Sophie', 'Clark', '2025-05-17 10:10:00', TRUE, 1, 
    ARRAY[
      (1, 'Sophie Clark', '5 Bruton Street', 'London', 'England', 'W1J 6PT', 'UK', TRUE)::address_type
    ], '2025-05-01 10:20:44', '2025-05-01 10:20:44'),

    (20, 'joseph_rodriguez', 'rodriguez.j@domain.com', 't0u1v2w3x4y5z6a7b8c9', 'Joseph', 'Rodriguez', '2025-05-20 16:40:00', TRUE, 1, 
    ARRAY[
      (1, 'Joseph Rodriguez', '12 Dover Street', 'London', 'England', 'W1S 4LQ', 'UK', TRUE)::address_type,
      (2, 'Mia Rodriguez', '18 Grafton Street', 'London', 'England', 'W1S 4ER', 'UK', TRUE)::address_type
    ], '2025-05-05 13:15:55', '2025-05-08 09:30:00'),

    (21, 'jef_keller', 'keller.j@domain.com', 't0u1v2w3x4y5z6a7b8c9', 'Jef', 'Keller', '2025-05-20 16:40:00', TRUE, 1, 
    ARRAY[
      (1, 'Jef Keller', '31 Lantington Ave', 'London', 'England', 'W1S 8NE', 'UK', TRUE)::address_type
    ], '2025-05-20 13:15:55', '2025-05-20 09:30:00'),

    (22, 'mary_potter', 'potter.m@domain.com', 't0u1v2w3x4y5z6a7b8c9', 'Mary', 'Potter', '2025-05-23 16:40:00', TRUE, 1, NULL, '2025-05-22 13:15:55', '2025-05-23 09:30:00');


-- Clothing Products
INSERT INTO clothing_products (product_id, name, description, base_price, variants, size_chart, fabric_type, created_at, last_modified) VALUES
    (101, 'Mens Jeans', 'This is a jeans for men', 14.99,
    ARRAY[
      (1, 'INV1001', 'Small', 'White',  0.00,  47, TRUE)::variant_type,
      (2, 'INV1002', 'Small', 'Black',  0.00,  38, TRUE)::variant_type,
      (3, 'INV1003', 'Medium', 'White', 1.00, 65, TRUE)::variant_type,
      (4, 'INV1004', 'Medium', 'Black', 1.00, 52, TRUE)::variant_type,
      (5, 'INV1005', 'Large', 'White',  2.00, 29, TRUE)::variant_type,
      (6, 'INV1006', 'Large', 'Black',  2.00, 71, TRUE)::variant_type
    ], 'Small: 30 Waist: 80cm Seat: 100cm Thigh: 56cm\nMedium: 35 Waist: 93cm Seat: 113cm Thigh: 62cm\nLarge: 40 Waist: 105cm Seat: 124cm Thigh: 68cm', 'Jeans', '2024-05-25 09:15:00', '2025-03-10 14:30:00'),

    (102, 'Womens Jeans', 'This is a jeans for women', 19.99,
    ARRAY[
      (1, 'INV1007', 'Small', 'White',  0.00,  42, TRUE)::variant_type,
      (2, 'INV1008', 'Small', 'Black',  0.00,  56, TRUE)::variant_type,
      (3, 'INV1009', 'Medium', 'White', 1.00, 33, TRUE)::variant_type,
      (4, 'INV1010', 'Medium', 'Black', 1.00, 68, TRUE)::variant_type,
      (5, 'INV1011', 'Large', 'White',  2.00, 24, TRUE)::variant_type,
      (6, 'INV1012', 'Large', 'Black',  2.00, 59, TRUE)::variant_type
    ], 'Small: 25 Waist: 62cm Seat: 82cm Thigh: 45cm\nMedium: 29 Waist: 80cm Seat: 100cm Thigh: 50cm\nLarge: 34 Waist: 95cm Seat: 115cm Thigh: 60cm', 'Jeans', '2024-05-25 10:30:00', '2025-02-05 11:45:00'),

    (103, 'Mens Shirt', 'This is a shirt for men', 9.99,
    ARRAY[
      (1, 'INV1013', 'Small', 'White',  0.00,  88, TRUE)::variant_type,
      (2, 'INV1014', 'Small', 'Black',  0.00,  72, TRUE)::variant_type,
      (3, 'INV1015', 'Medium', 'White', 1.00, 64, TRUE)::variant_type,
      (4, 'INV1016', 'Medium', 'Black', 1.00, 51, TRUE)::variant_type,
      (5, 'INV1017', 'Large', 'White',  2.00, 37, TRUE)::variant_type,
      (6, 'INV1018', 'Large', 'Black',  2.00, 43, TRUE)::variant_type
    ], 'Small: Width: 45cm Length: 70cm Chest-to-fit: 91cm - 99cm\nMedium: Width: 50cm Length: 75cm Chest-to-fit: 99cm - 106cm\nLarge: Width: 55cm Length: 80cm Chest-to-fit: 106cm - 114cm', 'Cotton', '2024-05-25 14:20:00', '2025-03-15 10:10:00'),

    (104, 'Womens Shirt', 'This is a shirt for women', 14.99,
    ARRAY[
      (1, 'INV1019', 'Small', 'White',  0.00,  53, TRUE)::variant_type,
      (2, 'INV1020', 'Small', 'Black',  0.00,  67, TRUE)::variant_type,
      (3, 'INV1021', 'Medium', 'White', 1.00, 48, TRUE)::variant_type,
      (4, 'INV1022', 'Medium', 'Black', 1.00, 39, TRUE)::variant_type,
      (5, 'INV1023', 'Large', 'White',  2.00, 26, TRUE)::variant_type,
      (6, 'INV1024', 'Large', 'Black',  2.00, 58, TRUE)::variant_type
    ], 'Small: Width: 40cm Length: 58cm Waist: 38cm\nMedium: Width: 43cm Length: 61cm Waist: 41cm\nLarge: Width: 46cm Length: 63cm Waist: 44cm', 'Cotton', '2024-05-25 16:45:00', '2025-03-20 13:25:00'),

    (105, 'Scarf', 'This is a unisex scarf', 11.99,
    ARRAY[
      (1, 'INV1025', 'Small', 'White',  0.00,  92, TRUE)::variant_type,
      (2, 'INV1026', 'Small', 'Black',  0.00,  85, TRUE)::variant_type,
      (3, 'INV1027', 'Medium', 'White', 1.00, 77, TRUE)::variant_type,
      (4, 'INV1028', 'Medium', 'Black', 1.00, 63, TRUE)::variant_type,
      (5, 'INV1029', 'Large', 'White',  2.00, 41, TRUE)::variant_type,
      (6, 'INV1030', 'Large', 'Black',  2.00, 34, TRUE)::variant_type
    ], 'Small: Width: 40cm Length: 60cm\nMedium: Width: 40cm Length: 90cm\nLarge: Width: 40cm Length: 120cm', 'Wool', '2024-05-25 17:20:00', '2024-12-15 09:40:00');


-- Electronics Products
INSERT INTO electronics_products (product_id, name, description, base_price, variants, warranty_period, voltage_requirements, created_at, last_modified) VALUES
    (201, 'iPhone Charger', 'This is an iPhone charger', 24.99,
    ARRAY[
      (1, 'INV1031', NULL, 'Black',        0.00, 42, TRUE)::variant_type,
      (2, 'INV1032', NULL, 'White',        0.00, 35, TRUE)::variant_type,
      (3, 'INV1033', NULL, 'Navy Blue',    0.00, 28, TRUE)::variant_type,
      (4, 'INV1034', NULL, 'Emerald Green', 0.00, 19, TRUE)::variant_type,
      (5, 'INV1035', NULL, 'Rose Gold',    0.00, 31, TRUE)::variant_type,
      (6, 'INV1036', NULL, 'Dark Grey',    0.00, 24, TRUE)::variant_type
    ], '6 months', '110V - 240V 60W', '2024-05-26 10:15:00', '2024-11-12 14:30:00'),

    (202, 'Android Charger', 'This is an android charger', 14.99,
    ARRAY[
      (1, 'INV1037', NULL, 'Black',        0.00, 58, TRUE)::variant_type,
      (2, 'INV1038', NULL, 'White',        0.00, 47, TRUE)::variant_type,
      (3, 'INV1039', NULL, 'Navy Blue',    0.00, 36, TRUE)::variant_type,
      (4, 'INV1040', NULL, 'Emerald Green', 0.00, 29, TRUE)::variant_type,
      (5, 'INV1041', NULL, 'Rose Gold',    0.00, 41, TRUE)::variant_type,
      (6, 'INV1042', NULL, 'Dark Grey',    0.00, 33, TRUE)::variant_type
    ], '6 months', '110V - 240V 60W', '2024-05-26 11:30:00', '2024-10-05 10:45:00'),

    (203, 'Earbuds', 'High Quality Bluetooth Earbuds', 9.99,
    ARRAY[
      (1, 'INV1043', NULL, 'Black',        0.00, 72, TRUE)::variant_type,
      (2, 'INV1044', NULL, 'White',        0.00, 65, TRUE)::variant_type,
      (3, 'INV1045', NULL, 'Navy Blue',    0.00, 53, TRUE)::variant_type,
      (4, 'INV1046', NULL, 'Emerald Green', 0.00, 48, TRUE)::variant_type,
      (5, 'INV1047', NULL, 'Rose Gold',    0.00, 57, TRUE)::variant_type,
      (6, 'INV1048', NULL, 'Dark Grey',    0.00, 39, TRUE)::variant_type
    ], '12 months', '5V 1A', '2024-05-26 14:20:00', '2025-04-15 11:10:00'),

    (204, 'Headphones', 'High Quality Bluetooth Headphones', 19.99,
    ARRAY[
      (1, 'INV1049', NULL, 'Black',        0.00, 38, TRUE)::variant_type,
      (2, 'INV1050', NULL, 'White',        0.00, 29, TRUE)::variant_type,
      (3, 'INV1051', NULL, 'Navy Blue',    0.00, 25, TRUE)::variant_type,
      (4, 'INV1052', NULL, 'Emerald Green', 0.00, 18, TRUE)::variant_type,
      (5, 'INV1053', NULL, 'Rose Gold',    0.00, 31, TRUE)::variant_type,
      (6, 'INV1054', NULL, 'Dark Grey',    0.00, 22, TRUE)::variant_type
    ], '12 months', '5V 1A', '2024-05-26 16:45:00', '2024-12-20 13:25:00'),

    (205, 'Smartwatch', 'High Quality Smartwatch. Phone companion and health monitor.', 19.99,
    ARRAY[
      (1, 'INV1055', NULL, 'Black',        0.00, 51, TRUE)::variant_type,
      (2, 'INV1056', NULL, 'White',        0.00, 43, TRUE)::variant_type,
      (3, 'INV1057', NULL, 'Navy Blue',    0.00, 37, TRUE)::variant_type,
      (4, 'INV1058', NULL, 'Emerald Green', 0.00, 29, TRUE)::variant_type,
      (5, 'INV1059', NULL, 'Rose Gold',    0.00, 48, TRUE)::variant_type,
      (6, 'INV1060', NULL, 'Dark Grey',    0.00, 32, TRUE)::variant_type
    ], '12 months', '5V 1A', '2024-05-26 17:30:00', '2024-09-15 09:40:00');


-- Pet Products
INSERT INTO pet_products (product_id, name, description, base_price, pet_type, material, variants, created_at, last_modified) VALUES
    (301, 'Cat Food', 'This is a great choice of food for a healthy cat', 4.99, 'Cats', 'Fish, Chicken, Beef, Vegetables',
    ARRAY[
      (1, 'INV1061', 'Kitten 0.5 kg', NULL, 0.00, 0, FALSE)::variant_type,
      (2, 'INV1062', 'Adult 0.5 kg', NULL, 0.00, 0, FALSE)::variant_type,
      (3, 'INV1063', 'Kitten 1.0 kg', NULL, 3.00, 0, FALSE)::variant_type,
      (4, 'INV1064', 'Adult 1.0 kg', NULL, 3.00, 0, FALSE)::variant_type,
      (5, 'INV1065', 'Kitten 1.5 kg', NULL, 5.00, 0, FALSE)::variant_type,
      (6, 'INV1066', 'Adult 1.5 kg', NULL, 5.00, 0, FALSE)::variant_type
    ], '2025-05-15 08:00:00', '2025-05-16 09:15:22'),

    (302, 'Cat Snacks', 'Delicious snacks for your cat', 2.99, 'Cats', 'Fish, Chicken, Beef, Vegetables',
    ARRAY[
      (1, 'INV1067', '5 Treets', NULL, 0.00, 0, FALSE)::variant_type,
      (2, 'INV1068', '10 Treets', NULL, 2.00, 0, FALSE)::variant_type,
      (3, 'INV1069', '15 Treets', NULL, 3.50, 0, FALSE)::variant_type,
      (4, 'INV1070', '20 Treets', NULL, 5.00, 0, FALSE)::variant_type,
      (5, 'INV1071', '25 Treets', NULL, 6.00, 0, FALSE)::variant_type,
      (6, 'INV1072', '30 Treets', NULL, 7.00, 0, FALSE)::variant_type
    ], '2025-05-15 10:00:00', '2025-05-16 10:30:45'),

    (303, 'Dog Food', 'This is a great choice of food for a healthy dog', 4.99, 'Dogs', 'Fish, Chicken, Beef, Vegetables',
    ARRAY[
      (1, 'INV1073', 'Puppy 0.5 kg', NULL, 0.00, 0, FALSE)::variant_type,
      (2, 'INV1074', 'Adult 0.5 kg', NULL, 0.00, 0, FALSE)::variant_type,
      (3, 'INV1075', 'Puppy 1.0 kg', NULL, 3.00, 0, FALSE)::variant_type,
      (4, 'INV1076', 'Adult 1.0 kg', NULL, 3.00, 0, FALSE)::variant_type,
      (5, 'INV1077', 'Puppy 1.5 kg', NULL, 5.00, 0, FALSE)::variant_type,
      (6, 'INV1078', 'Adult 1.5 kg', NULL, 5.00, 0, FALSE)::variant_type
    ], '2025-05-15 12:00:00', '2025-05-16 11:45:18'),

    (304, 'Dog Snacks', 'Delicious snacks for your dog', 2.99, 'Dogs', 'Fish, Chicken, Beef, Vegetables',
    ARRAY[
      (1, 'INV1079', '5 Treets', NULL, 0.00, 0, FALSE)::variant_type,
      (2, 'INV1080', '10 Treets', NULL, 2.00, 0, FALSE)::variant_type,
      (3, 'INV1081', '15 Treets', NULL, 3.50, 0, FALSE)::variant_type,
      (4, 'INV1082', '20 Treets', NULL, 5.00, 0, FALSE)::variant_type,
      (5, 'INV1083', '25 Treets', NULL, 6.00, 0, FALSE)::variant_type,
      (6, 'INV1084', '30 Treets', NULL, 7.00, 0, FALSE)::variant_type
    ], '2025-05-15 14:00:00', '2025-05-16 14:20:33'),

    (305, 'Chew Toy', 'Great chew toy for dental health and lowering stress', 1.99, 'Dogs, Cats', 'Natural Rubber',
    ARRAY[
      (1, 'INV1085', 'Small Bone', NULL, 0.00, 0, FALSE)::variant_type,
      (2, 'INV1086', 'Medium Bone', NULL, 2.00, 0, FALSE)::variant_type,
      (3, 'INV1087', 'Large Bone', NULL, 3.00, 0, FALSE)::variant_type,
      (4, 'INV1088', 'Small Fish', NULL, 0.00, 0, FALSE)::variant_type,
      (5, 'INV1089', 'Medium Fish', NULL, 2.00, 0, FALSE)::variant_type,
      (6, 'INV1090', 'Large Fish', NULL, 3.00, 0, FALSE)::variant_type
    ], '2025-05-15 16:00:00', '2025-05-16 16:40:15');


-- Categories
INSERT INTO categories (category_id, name, description, created_at, last_modified) VALUES
    (001, 'Clothing', 'These are all of the clothing items available on the store', '2024-05-27 09:30:00', '2024-05-27 09:30:00'),
    (002, 'Mens Clothing', 'These clothing items are for men', '2024-05-27 09:45:00', '2024-05-27 09:45:00'),
    (003, 'Womens Clothing', 'These clothing items are for women', '2024-05-27 10:01:00', '2024-05-27 10:01:00'),
    (004, 'Clothing Accessories', 'These are accessories for your outfits', '2024-05-27 10:17:00', '2024-05-27 10:17:00'),
    (005, 'Winter Wear', 'These are winter clothing items', '2024-05-27 10:33:00', '2024-05-27 10:33:00'),
    (006, 'Electronics', 'These are all of the electronic items available on the store', '2024-05-27 11:30:00', '2024-05-27 11:30:00'),
    (007, 'Electronic Accessories', 'These are accessories for your smart devices/phones', '2024-05-27 11:48:00', '2024-05-27 11:48:00'),
    (008, 'Smart Devices', 'These are smart IoT devices that work with your smart phone', '2024-05-27 12:23:00', '2024-05-27 12:23:00'),
    (009, 'Health', 'These electronic items help monitoring Health', '2024-05-27 14:45:00', '2024-05-27 14:45:00'),
    (010, 'Audio', 'These are all of the equipments available on the store', '2024-05-27 16:56:00', '2024-05-27 16:56:00'),
    (011, 'Pets', 'These are all of the pet items available on the store', '2024-12-27 16:56:00', '2024-12-27 16:56:00'),
    (012, 'Cat Food', 'These are all of the cat food options available on the store', '2024-12-27 16:56:00', '2024-12-27 16:56:00'),
    (013, 'Dog Food', 'These are all of the dog food options available on the store', '2024-12-27 16:56:00', '2024-12-27 16:56:00'),
    (014, 'Pet Toys', 'These are all of the pet toys options on the store', '2024-12-27 16:56:00', '2024-12-27 16:56:00'),
    (015, 'Pet Snacks', 'These are all of the pet snacks options on the store', '2024-12-27 16:56:00', '2024-12-27 16:56:00');


-- Products x Category Relations
INSERT INTO products_categories_links (product_id, category_id, is_primary, created_at, last_modified) VALUES
    (101, 001, FALSE, '2024-05-28 08:10:00', '2024-05-28 08:10:00'),
    (102, 001, FALSE, '2024-05-28 08:13:00', '2024-05-28 08:13:00'),
    (103, 001, FALSE, '2024-05-28 08:16:00', '2024-05-28 08:16:00'),
    (104, 001, FALSE, '2024-05-28 08:22:00', '2024-05-28 08:22:00'),
    (105, 001, FALSE, '2024-05-28 08:25:00', '2024-05-28 08:25:00'),
    (201, 006, FALSE, '2024-05-28 08:27:00', '2024-05-28 08:27:00'),
    (202, 006, FALSE, '2024-05-28 08:38:00', '2024-05-28 08:38:00'),
    (203, 006, FALSE, '2024-05-28 08:42:00', '2024-05-28 08:42:00'),
    (204, 006, FALSE, '2024-05-28 08:51:00', '2024-05-28 08:51:00'),
    (205, 006, FALSE, '2024-05-28 08:52:00', '2024-05-28 08:52:00'),
    (101, 002, TRUE, '2024-05-28 09:14:00', '2024-05-28 09:14:00'),
    (103, 002, TRUE, '2024-05-28 09:18:00', '2024-05-28 09:18:00'),
    (102, 003, TRUE, '2024-05-28 09:25:00', '2024-05-28 09:25:00'),
    (104, 003, TRUE, '2024-05-28 09:28:00', '2024-05-28 09:28:00'),
    (105, 004, FALSE, '2024-05-28 09:29:00', '2024-05-28 09:29:00'),
    (105, 005, TRUE, '2024-05-28 09:46:00', '2024-05-28 09:46:00'),
    (201, 007, TRUE, '2024-05-28 10:33:00', '2024-05-28 10:33:00'),
    (202, 007, TRUE, '2024-05-28 10:35:00', '2024-05-28 10:35:00'),
    (205, 008, TRUE, '2024-05-28 10:39:00', '2024-05-28 10:39:00'),
    (205, 009, FALSE, '2024-05-28 10:48:00', '2024-05-28 10:48:00'),
    (203, 010, TRUE, '2024-05-28 10:52:00', '2024-05-28 10:52:00'),
    (204, 010, TRUE, '2024-05-28 10:55:00', '2024-05-28 10:55:00');


-- Orders
INSERT INTO orders (order_id, user_id, item, status, total_amount, shipping_address, created_at, last_modified) VALUES
-- June 2024
(1, 1, (1, 3, 101, 1, 15.99, 0.00)::order_item_type, 'delivered', 15.99, ('John Smith', '10 Downing Street', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-06-06 09:15:22', '2024-06-13 09:15:22'),
(2, 1, (1, 1, 201, 1, 24.99, 4.75)::order_item_type, 'delivered', 20.24, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-06-08 14:30:00', '2024-06-15 14:30:00'),
(3, 2, (1, 2, 102, 2, 19.99, 4.20)::order_item_type, 'delivered', 35.78, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-06-15 11:45:33', '2024-06-22 11:45:33'),
(4, 2, (1, 4, 104, 1, 15.99, 0.00)::order_item_type, 'delivered', 15.99, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-06-17 16:20:18', '2024-06-24 16:20:18'),
(5, 1, (1, 3, 103, 1, 10.99, 2.10)::order_item_type, 'delivered', 8.89, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-06-20 10:30:45', '2024-06-27 10:30:45'),
-- July 2024
(6, 1, (1, 5, 101, 1, 16.99, 0.00)::order_item_type, 'delivered', 16.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-07-03 11:20:15', '2024-07-10 11:20:15'),
(7, 2, (1, 6, 102, 1, 21.99, 4.80)::order_item_type, 'delivered', 17.19, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-07-05 14:45:00', '2024-07-12 14:45:00'),
(8, 3, (1, 1, 203, 1, 9.99, 1.80)::order_item_type, 'delivered', 8.19, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-07-07 09:30:33', '2024-07-14 09:30:33'),
(9, 1, (1, 2, 104, 2, 15.99, 3.60)::order_item_type, 'delivered', 28.38, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-07-09 16:15:18', '2024-07-16 16:15:18'),
(10, 1, (1, 3, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-07-11 13:20:45', '2024-07-18 13:20:45'),
(11, 2, (1, 4, 201, 1, 24.99, 4.25)::order_item_type, 'delivered', 20.74, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-07-14 10:10:30', '2024-07-21 10:10:30'),
(12, 3, (1, 5, 202, 1, 14.99, 0.00)::order_item_type, 'delivered', 14.99, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-07-17 15:30:15', '2024-07-24 15:30:15'),
-- August 2024
(13, 4, (1, 6, 203, 1, 9.99, 2.25)::order_item_type, 'delivered', 7.74, ('Emma Brown', '15 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2024-08-02 09:45:00', '2024-08-09 09:45:00'),
(14, 1, (1, 1, 204, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-08-04 14:20:33', '2024-08-11 14:20:33'),
(15, 2, (1, 2, 205, 1, 19.99, 4.50)::order_item_type, 'delivered', 15.49, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-08-06 11:15:18', '2024-08-13 11:15:18'),
(16, 2, (1, 3, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-08-08 16:30:45', '2024-08-15 16:30:45'),
(17, 4, (1, 4, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Emma Brown', '15 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2024-08-10 10:40:30', '2024-08-17 10:40:30'),
(18, 1, (1, 5, 103, 1, 10.99, 1.90)::order_item_type, 'delivered', 9.09, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-08-12 13:25:15', '2024-08-19 13:25:15'),
(19, 2, (1, 6, 104, 1, 15.99, 3.40)::order_item_type, 'delivered', 12.59, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-08-15 09:50:00', '2024-08-22 09:50:00'),
(20, 4, (1, 1, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Emma Brown', '15 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2024-08-18 15:35:45', '2024-08-25 15:35:45'),
-- September 2024
(21, 4, (1, 2, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-09-01 11:10:30', '2024-09-08 11:10:30'),
(22, 5, (1, 3, 202, 1, 14.99, 0.00)::order_item_type, 'delivered', 14.99, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-09-03 14:45:15', '2024-09-10 14:45:15'),
(23, 1, (1, 4, 203, 2, 9.99, 1.75)::order_item_type, 'delivered', 18.23, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-09-05 10:20:00', '2024-09-12 10:20:00'),
(24, 2, (1, 5, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-09-07 16:55:45', '2024-09-14 16:55:45'),
(25, 1, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-09-09 09:30:30', '2024-09-16 09:30:30'),
(26, 4, (1, 1, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-09-11 13:15:15', '2024-09-18 13:15:15'),
(27, 5, (1, 2, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-09-14 10:40:00', '2024-09-21 10:40:00'),
(28, 5, (1, 3, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Lisa Taylor', '12 Camden High Street', 'London', 'England', 'NW1 0JH', 'UK')::shipping_address_type, '2024-09-16 15:25:45', '2024-09-23 15:25:45'),
(29, 1, (1, 4, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-09-18 11:50:30', '2024-09-25 11:50:30'),
(30, 2, (1, 5, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-09-20 14:35:15', '2024-09-27 14:35:15'),
(31, 3, (1, 6, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-09-22 09:10:00', '2024-09-29 09:10:00'),
(32, 4, (1, 1, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-09-24 16:45:45', '2024-10-01 16:45:45'),
(33, 5, (1, 2, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-09-26 12:20:30', '2024-10-03 12:20:30'),
(34, 5, (1, 3, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Lisa Taylor', '12 Camden High Street', 'London', 'England', 'NW1 0JH', 'UK')::shipping_address_type, '2024-09-28 10:55:15', '2024-10-05 10:55:15'),
(35, 1, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-09-30 15:30:00', '2024-10-07 15:30:00'),
-- October 2024
(36, 2, (1, 5, 101, 1, 15.99, 3.50)::order_item_type, 'delivered', 12.49, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-10-02 11:05:45', '2024-10-09 11:05:45'),
(37, 4, (1, 6, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-10-04 14:40:30', '2024-10-11 14:40:30'),
(38, 4, (1, 1, 103, 2, 10.99, 2.10)::order_item_type, 'delivered', 19.88, ('Robert Brown', '8 Bond Street', 'London', 'England', 'W1S 1YF', 'UK')::shipping_address_type, '2024-10-06 09:15:15', '2024-10-13 09:15:15'),
(39, 5, (1, 2, 104, 1, 15.99, 3.60)::order_item_type, 'delivered', 12.39, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-10-08 16:50:00', '2024-10-15 16:50:00'),
(40, 6, (1, 3, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Olivia Williams', '25 Knightsbridge', 'London', 'England', 'SW1X 7LY', 'UK')::shipping_address_type, '2024-10-10 12:25:45', '2024-10-17 12:25:45'),
(41, 6, (1, 4, 201, 1, 24.99, 4.25)::order_item_type, 'delivered', 20.74, ('Olivia Williams', '25 Knightsbridge', 'London', 'England', 'SW1X 7LY', 'UK')::shipping_address_type, '2024-10-12 10:00:30', '2024-10-19 10:00:30'),
(42, 1, (1, 5, 202, 1, 14.99, 2.90)::order_item_type, 'delivered', 12.09, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-10-14 15:35:15', '2024-10-21 15:35:15'),
(43, 2, (1, 6, 203, 1, 9.99, 1.85)::order_item_type, 'delivered', 8.14, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-10-16 11:10:00', '2024-10-23 11:10:00'),
(44, 4, (1, 1, 204, 1, 19.99, 4.35)::order_item_type, 'delivered', 15.64, ('Robert Brown', '8 Bond Street', 'London', 'England', 'W1S 1YF', 'UK')::shipping_address_type, '2024-10-18 14:45:45', '2024-10-25 14:45:45'),
(45, 4, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-10-20 09:20:30', '2024-10-27 09:20:30'),
(46, 5, (1, 3, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-10-22 16:55:15', '2024-10-29 16:55:15'),
(47, 6, (1, 4, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Olivia Williams', '25 Knightsbridge', 'London', 'England', 'SW1X 7LY', 'UK')::shipping_address_type, '2024-10-24 12:30:00', '2024-10-31 12:30:00'),
(48, 4, (1, 5, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-10-26 10:05:45', '2024-11-02 10:05:45'),
(49, 1, (1, 6, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-10-28 15:40:30', '2024-11-04 15:40:30'),
(50, 2, (1, 1, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-10-30 11:15:15', '2024-11-06 11:15:15'),
-- November 2024
(51, 3, (1, 2, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-11-03 14:20:00', '2024-11-10 14:20:00'),
(52, 4, (1, 3, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-11-05 09:45:45', '2024-11-12 09:45:45'),
(53, 5, (1, 4, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-11-07 16:30:30', '2024-11-14 16:30:30'),
(54, 6, (1, 5, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2024-11-09 12:05:15', '2024-11-16 12:05:15'),
(55, 5, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-11-11 10:40:00', '2024-11-18 10:40:00'),
(56, 5, (1, 1, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-11-13 15:15:45', '2024-11-20 15:15:45'),
(57, 1, (1, 2, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-11-15 11:50:30', '2024-11-22 11:50:30'),
(58, 2, (1, 3, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-11-17 14:25:15', '2024-11-24 14:25:15'),
(59, 3, (1, 4, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-11-19 09:00:00', '2024-12-10 09:00:00'),
(60, 4, (1, 5, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-11-21 16:35:45', '2024-11-28 16:35:45'),
(61, 7, (1, 6, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2024-11-23 12:10:30', '2024-11-30 12:10:30'),
(62, 6, (1, 1, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2024-11-25 10:45:15', '2024-12-02 10:45:15'),
(63, 7, (1, 2, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2024-11-27 15:20:00', '2024-12-04 15:20:00'),
(64, 7, (1, 3, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2024-11-29 11:55:45', '2024-12-06 11:55:45'),
(65, 1, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-11-30 14:30:30', '2024-12-07 14:30:30'),
-- December 2024
(66, 7, (1, 2, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2024-12-01 13:50:30', '2024-12-08 13:50:30'),
(67, 2, (1, 5, 101, 1, 15.99, 3.50)::order_item_type, 'delivered', 12.49, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-12-02 09:05:15', '2024-12-09 09:05:15'),
(68, 1, (1, 3, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-12-03 08:25:15', '2024-12-10 08:25:15'),
(69, 3, (1, 6, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('David Wilson', '7 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2024-12-04 16:40:00', '2024-12-10 16:40:00'),
(70, 2, (1, 4, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-12-05 15:00:00', '2024-12-12 15:00:00'),
(71, 4, (1, 1, 103, 2, 10.99, 2.10)::order_item_type, 'delivered', 19.88, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-12-06 12:15:45', '2024-12-13 12:15:45'),
(72, 2, (1, 5, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-12-07 10:35:45', '2024-12-14 10:35:45'),
(73, 5, (1, 2, 104, 1, 15.99, 3.60)::order_item_type, 'delivered', 12.39, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-12-08 10:50:30', '2024-12-15 10:50:30'),
(74, 1, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-12-09 14:10:30', '2024-12-16 14:10:30'),
(75, 6, (1, 3, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2024-12-10 15:25:15', '2024-12-17 15:25:15'),
(76, 7, (1, 4, 201, 1, 24.99, 4.25)::order_item_type, 'delivered', 20.74, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2024-12-12 11:00:00', '2024-12-19 11:00:00'),
(77, 2, (1, 1, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-12-11 11:45:15', '2024-12-18 11:45:15'),
(78, 1, (1, 2, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-12-13 16:20:00', '2024-12-20 16:20:00'),
(79, 1, (1, 5, 202, 1, 14.99, 2.90)::order_item_type, 'delivered', 12.09, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-12-14 14:35:45', '2024-12-21 14:35:45'),
(80, 4, (1, 3, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-12-15 09:55:45', '2024-12-22 09:55:45'),
(81, 8, (1, 6, 203, 1, 9.99, 1.85)::order_item_type, 'delivered', 8.14, ('Sophia Davis', '9 Covent Garden', 'London', 'England', 'WC2E 8RA', 'UK')::shipping_address_type, '2024-12-16 09:10:30', '2024-12-23 09:10:30'),
(82, 5, (1, 4, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-12-17 14:30:30', '2024-12-24 14:30:30'),
(83, 8, (1, 1, 204, 1, 19.99, 4.35)::order_item_type, 'delivered', 15.64, ('Sophia Davis', '9 Covent Garden', 'London', 'England', 'WC2E 8RA', 'UK')::shipping_address_type, '2024-12-18 16:45:15', '2024-12-25 16:45:15'),
(84, 6, (1, 5, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2024-12-19 12:05:15', '2024-12-26 12:05:15'),
(85, 1, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2024-12-20 12:20:00', '2024-12-27 12:20:00'),
(86, 2, (1, 3, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2024-12-22 10:55:45', '2024-12-29 10:55:45'),
(87, 8, (1, 4, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Sophia Davis', '9 Covent Garden', 'London', 'England', 'WC2E 8RA', 'UK')::shipping_address_type, '2024-12-24 15:30:30', '2024-12-31 15:30:30'),
(88, 4, (1, 5, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2024-12-26 11:05:15', '2025-01-02 11:05:15'),
(89, 5, (1, 6, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2024-12-28 14:40:00', '2025-01-04 14:40:00'),
(90, 6, (1, 1, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2024-12-30 09:15:45', '2025-01-06 09:15:45'),
-- January 2025
(91, 1, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2025-01-02 11:50:30', '2025-01-09 11:50:30'),
(92, 7, (1, 6, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-01-03 09:40:00', '2025-01-10 09:40:00'),
(93, 2, (1, 3, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2025-01-04 14:25:15', '2025-01-11 14:25:15'),
(94, 8, (1, 1, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK')::shipping_address_type, '2025-01-05 14:15:45', '2025-01-12 14:15:45'),
(95, 2, (1, 4, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2025-01-06 09:00:00', '2025-01-13 09:00:00'),
(96, 6, (1, 2, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-01-07 11:50:30', '2025-01-14 11:50:30'),
(97, 9, (1, 3, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Robert Miller', '5 Carnaby Street', 'London', 'England', 'W1F 9PB', 'UK')::shipping_address_type, '2025-01-09 16:25:15', '2025-01-16 16:25:15'),
(98, 10, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-01-11 10:00:00', '2025-01-18 10:00:00'),
(99, 4, (1, 5, 101, 1, 15.99, 3.50)::order_item_type, 'delivered', 12.49, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-01-13 13:35:45', '2025-01-20 13:35:45'),
(100, 5, (1, 6, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Lisa Taylor', '12 Camden High Street', 'London', 'England', 'NW1 0JH', 'UK')::shipping_address_type, '2025-01-15 08:10:30', '2025-01-22 08:10:30'),
(101, 10, (1, 1, 103, 2, 10.99, 2.10)::order_item_type, 'delivered', 19.88, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-01-17 14:45:15', '2025-01-24 14:45:15'),
(102, 1, (1, 2, 104, 1, 15.99, 3.60)::order_item_type, 'delivered', 12.39, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2025-01-19 11:20:00', '2025-01-26 11:20:00'),
(103, 9, (1, 3, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Robert Miller', '5 Carnaby Street', 'London', 'England', 'W1F 9PB', 'UK')::shipping_address_type, '2025-01-21 15:55:45', '2025-01-28 15:55:45'),
(104, 4, (1, 4, 201, 1, 24.99, 4.25)::order_item_type, 'delivered', 20.74, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-01-23 10:30:30', '2025-01-30 10:30:30'),
(105, 5, (1, 5, 202, 1, 14.99, 2.90)::order_item_type, 'delivered', 12.09, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2025-01-25 13:05:15', '2025-02-01 13:05:15'),
(106, 8, (1, 6, 203, 1, 9.99, 1.85)::order_item_type, 'delivered', 8.14, ('William Davis', '33 Shaftesbury Avenue', 'London', 'England', 'W1D 7EH', 'UK')::shipping_address_type, '2025-01-27 08:40:00', '2025-02-03 08:40:00'),
(107, 5, (1, 1, 204, 1, 19.99, 4.35)::order_item_type, 'delivered', 15.64, ('Lisa Taylor', '12 Camden High Street', 'London', 'England', 'NW1 0JH', 'UK')::shipping_address_type, '2025-01-29 16:15:45', '2025-02-05 16:15:45'),
-- February 2025
(108, 4, (1, 5, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-02-01 15:35:45', '2025-02-08 15:35:45'),
(109, 8, (1, 1, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK')::shipping_address_type, '2025-02-02 08:45:15', '2025-02-09 08:45:15'),
(110, 5, (1, 6, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2025-02-03 12:10:30', '2025-02-10 12:10:30'),
(111, 10, (1, 2, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-02-04 14:20:00', '2025-02-11 14:20:00'),
(112, 6, (1, 1, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-02-05 08:45:15', '2025-02-12 08:45:15'),
(113, 5, (1, 3, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2025-02-06 10:55:45', '2025-02-13 10:55:45'),
(114, 7, (1, 2, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-02-07 14:20:00', '2025-02-14 14:20:00'),
(115, 1, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('John Smith', '22 Park Lane', 'London', 'England', 'SW1A 2AA', 'UK')::shipping_address_type, '2025-02-08 17:30:30', '2025-02-15 17:30:30'),
(116, 8, (1, 3, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('William Davis', '33 Shaftesbury Avenue', 'London', 'England', 'W1D 7EH', 'UK')::shipping_address_type, '2025-02-09 10:55:45', '2025-02-16 10:55:45'),
(117, 2, (1, 5, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2025-02-10 13:05:15', '2025-02-17 13:05:15'),
(118, 9, (1, 4, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-02-11 17:30:30', '2025-02-18 17:30:30'),
(119, 10, (1, 5, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-02-13 13:05:15', '2025-02-20 13:05:15'),
(120, 11, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('William Moore', '27 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2025-02-15 09:40:00', '2025-02-22 09:40:00'),
(121, 9, (1, 1, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-02-17 16:15:45', '2025-02-24 16:15:45'),
(122, 10, (1, 2, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-02-19 11:50:30', '2025-02-26 11:50:30'),
(123, 11, (1, 3, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('William Moore', '27 Baker Street', 'London', 'England', 'NW1 6XE', 'UK')::shipping_address_type, '2025-02-21 14:25:15', '2025-02-28 14:25:15'),
(124, 10, (1, 4, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-02-23 09:00:00', '2025-03-02 09:00:00'),
(125, 12, (1, 5, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK')::shipping_address_type, '2025-02-25 15:35:45', '2025-03-04 15:35:45'),
(126, 12, (1, 6, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK')::shipping_address_type, '2025-02-27 12:10:30', '2025-03-06 12:10:30'),
-- March 2025
(127, 10, (1, 6, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-03-01 09:40:00', '2025-03-08 09:40:00'),
(128, 11, (1, 3, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('William Moore', '8 Paddington Street', 'London', 'England', 'W1U 5QH', 'UK')::shipping_address_type, '2025-03-02 14:25:15', '2025-03-09 14:25:15'),
(129, 4, (1, 1, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-03-03 16:15:45', '2025-03-10 16:15:45'),
(130, 11, (1, 4, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('George Moore', '15 Harley Street', 'London', 'England', 'W1G 9QQ', 'UK')::shipping_address_type, '2025-03-04 09:00:00', '2025-03-11 09:00:00'),
(131, 5, (1, 2, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2025-03-05 11:50:30', '2025-03-12 11:50:30'),
(132, 13, (1, 5, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Thomas Anderson', '9 The Strand', 'London', 'England', 'WC2N 5HR', 'UK')::shipping_address_type, '2025-03-06 15:35:45', '2025-03-13 15:35:45'),
(133, 6, (1, 3, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-03-07 14:25:15', '2025-03-14 14:25:15'),
(134, 13, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK')::shipping_address_type, '2025-03-08 12:10:30', '2025-03-15 12:10:30'),
(135, 7, (1, 4, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-03-09 09:00:00', '2025-03-16 09:00:00'),
(136, 2, (1, 1, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Sarah Jones', '35 Oxford Street', 'Manchester', 'England', 'M1 1AA', 'UK')::shipping_address_type, '2025-03-10 08:45:15', '2025-03-17 08:45:15'),
(137, 8, (1, 5, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK')::shipping_address_type, '2025-03-11 15:35:45', '2025-03-18 15:35:45'),
(138, 13, (1, 2, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK')::shipping_address_type, '2025-03-12 14:20:00', '2025-03-19 14:20:00'),
(139, 9, (1, 6, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-03-13 12:10:30', '2025-03-20 12:10:30'),
(140, 4, (1, 3, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-03-14 10:55:45', '2025-03-21 10:55:45'),
(141, 10, (1, 1, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-03-15 08:45:15', '2025-03-22 08:45:15'),
(142, 5, (1, 4, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Michael Taylor', '3 Abbey Road', 'London', 'England', 'NW8 9AY', 'UK')::shipping_address_type, '2025-03-16 17:30:30', '2025-03-23 17:30:30'),
(143, 11, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('William Moore', '8 Paddington Street', 'London', 'England', 'W1U 5QH', 'UK')::shipping_address_type, '2025-03-17 14:20:00', '2025-03-24 14:20:00'),
(144, 6, (1, 5, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-03-18 13:05:15', '2025-03-25 13:05:15'),
(145, 12, (1, 3, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK')::shipping_address_type, '2025-03-19 10:55:45', '2025-03-26 10:55:45'),
(146, 13, (1, 4, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK')::shipping_address_type, '2025-03-21 17:30:30', '2025-03-28 17:30:30'),
(147, 14, (1, 5, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-03-23 13:05:15', '2025-03-30 13:05:15'),
(148, 11, (1, 6, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK')::shipping_address_type, '2025-03-25 09:40:00', '2025-04-01 09:40:00'),
(149, 14, (1, 1, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-03-27 16:15:45', '2025-04-03 16:15:45'),
(150, 14, (1, 2, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-03-29 11:50:30', '2025-04-05 11:50:30'),
-- April 2025
(151, 15, (1, 5, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Daniel White', '4 St James''s Square', 'London', 'England', 'SW1Y 4JU', 'UK')::shipping_address_type, '2025-04-01 08:35:45', '2025-04-08 08:35:45'),
(152, 7, (1, 6, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-04-01 09:30:00', '2025-04-08 09:30:00'),
(153, 15, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Daniel White', '4 St James''s Square', 'London', 'England', 'SW1Y 4JU', 'UK')::shipping_address_type, '2025-04-02 13:50:30', '2025-04-09 13:50:30'),
(154, 8, (1, 1, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK')::shipping_address_type, '2025-04-03 14:15:45', '2025-04-10 14:15:45'),
(155, 11, (1, 6, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK')::shipping_address_type, '2025-04-03 15:10:30', '2025-04-10 15:10:30'),
(156, 13, (1, 3, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('Thomas Anderson', '9 The Strand', 'London', 'England', 'WC2N 5HR', 'UK')::shipping_address_type, '2025-04-04 08:25:15', '2025-04-11 08:25:15'),
(157, 11, (1, 1, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('William Moore', '8 Paddington Street', 'London', 'England', 'W1U 5QH', 'UK')::shipping_address_type, '2025-04-05 10:45:15', '2025-04-12 10:45:15'),
(158, 9, (1, 2, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-04-05 10:50:30', '2025-04-12 10:50:30'),
(159, 11, (1, 4, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK')::shipping_address_type, '2025-04-06 15:00:00', '2025-04-13 15:00:00'),
(160, 10, (1, 3, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-04-07 16:25:15', '2025-04-14 16:25:15'),
(161, 4, (1, 5, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Emma Brown', '22 Piccadilly', 'London', 'England', 'W1J 0BH', 'UK')::shipping_address_type, '2025-04-08 10:35:45', '2025-04-15 10:35:45'),
(162, 11, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK')::shipping_address_type, '2025-04-09 11:00:00', '2025-04-16 11:00:00'),
(163, 16, (1, 6, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Matthew Martin', '8 Berkeley Square', 'London', 'England', 'W1J 6DA', 'UK')::shipping_address_type, '2025-04-10 14:10:30', '2025-04-17 14:10:30'),
(164, 12, (1, 5, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK')::shipping_address_type, '2025-04-11 13:35:45', '2025-04-18 13:35:45'),
(165, 6, (1, 1, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-04-12 11:45:15', '2025-04-19 11:45:15'),
(166, 13, (1, 6, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK')::shipping_address_type, '2025-04-13 08:10:30', '2025-04-20 08:10:30'),
(167, 7, (1, 2, 201, 1, 24.99, 4.60)::order_item_type, 'delivered', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-04-14 16:20:00', '2025-04-21 16:20:00'),
(168, 14, (1, 1, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-04-15 14:45:15', '2025-04-22 14:45:15'),
(169, 8, (1, 3, 202, 1, 14.99, 2.75)::order_item_type, 'delivered', 12.24, ('Sophia Davis', '21 Leicester Square', 'London', 'England', 'WC2H 7LE', 'UK')::shipping_address_type, '2025-04-16 12:55:45', '2025-04-23 12:55:45'),
(170, 15, (1, 2, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('Lucy White', '25 Cockspur Street', 'London', 'England', 'SW1Y 5BN', 'UK')::shipping_address_type, '2025-04-17 10:20:00', '2025-04-24 10:20:00'),
(171, 9, (1, 4, 203, 2, 9.99, 1.80)::order_item_type, 'delivered', 18.18, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-04-18 09:30:30', '2025-04-25 09:30:30'),
(172, 16, (1, 3, 105, 1, 11.99, 0.00)::order_item_type, 'delivered', 11.99, ('Matthew Martin', '8 Berkeley Square', 'London', 'England', 'W1J 6DA', 'UK')::shipping_address_type, '2025-04-19 15:55:45', '2025-04-26 15:55:45'),
(173, 10, (1, 5, 204, 1, 19.99, 4.30)::order_item_type, 'delivered', 15.69, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-04-20 14:05:15', '2025-04-27 14:05:15'),
(174, 17, (1, 4, 201, 1, 24.99, 4.90)::order_item_type, 'delivered', 20.09, ('Emily Thompson', '22 Mount Street', 'London', 'England', 'W1K 2RD', 'UK')::shipping_address_type, '2025-04-21 11:30:30', '2025-04-28 11:30:30'),
(175, 11, (1, 6, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('George Moore', '15 Harley Street', 'London', 'England', 'W1G 9QQ', 'UK')::shipping_address_type, '2025-04-22 10:40:00', '2025-04-29 10:40:00'),
(176, 18, (1, 5, 202, 1, 14.99, 2.80)::order_item_type, 'delivered', 12.19, ('Andrew Robinson', '7 Curzon Street', 'London', 'England', 'W1J 5HG', 'UK')::shipping_address_type, '2025-04-23 16:05:15', '2025-04-30 16:05:15'),
(177, 12, (1, 1, 101, 1, 15.99, 3.25)::order_item_type, 'delivered', 12.74, ('Isabella Taylor', '22 Jermyn Street', 'London', 'England', 'SW1Y 6HL', 'UK')::shipping_address_type, '2025-04-24 15:15:45', '2025-05-01 15:15:45'),
(178, 16, (1, 6, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('Matthew Martin', '15 Grosvenor Square', 'London', 'England', 'W1K 6JP', 'UK')::shipping_address_type, '2025-04-25 12:40:00', '2025-05-02 12:40:00'),
(179, 13, (1, 2, 102, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Sophie Anderson', '31 Trafalgar Square', 'London', 'England', 'WC2N 5DN', 'UK')::shipping_address_type, '2025-04-26 11:50:30', '2025-05-03 11:50:30'),
(180, 18, (1, 1, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Andrew Robinson', '14 Park Lane', 'London', 'England', 'W1K 7AN', 'UK')::shipping_address_type, '2025-04-27 09:15:45', '2025-05-04 09:15:45'),
(181, 14, (1, 3, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-04-28 16:25:15', '2025-05-05 16:25:15'),
(182, 15, (1, 4, 104, 2, 15.99, 3.75)::order_item_type, 'delivered', 28.23, ('Daniel White', '12 Haymarket', 'London', 'England', 'SW1Y 4DQ', 'UK')::shipping_address_type, '2025-04-30 13:00:00', '2025-05-07 13:00:00'),
-- May 2025
(183, 19, (1, 2, 203, 1, 9.99, 0.00)::order_item_type, 'delivered', 9.99, ('Sophie Clark', '5 Bruton Street', 'London', 'England', 'W1J 6PT', 'UK')::shipping_address_type, '2025-05-01 14:20:00', '2025-05-08 14:20:00'),
(184, 9, (1, 3, 204, 1, 19.99, 4.40)::order_item_type, 'delivered', 15.59, ('Robert Miller', '18 Regent Street', 'London', 'England', 'W1B 5AH', 'UK')::shipping_address_type, '2025-05-03 09:55:45', '2025-05-10 09:55:45'),
(185, 16, (1, 4, 205, 1, 19.99, 0.00)::order_item_type, 'delivered', 19.99, ('Matthew Martin', '15 Grosvenor Square', 'London', 'England', 'W1K 6JP', 'UK')::shipping_address_type, '2025-05-05 16:30:30', '2025-05-12 16:30:30'),
(186, 8, (1, 5, 101, 2, 15.99, 3.80)::order_item_type, 'delivered', 28.18, ('William Davis', '33 Shaftesbury Avenue', 'London', 'England', 'W1D 7EH', 'UK')::shipping_address_type, '2025-05-07 12:05:15', '2025-05-14 12:05:15'),
(187, 11, (1, 6, 102, 1, 19.99, 4.45)::order_item_type, 'delivered', 15.54, ('Charlotte Moore', '36 Marylebone High Street', 'London', 'England', 'W1U 4QE', 'UK')::shipping_address_type, '2025-05-09 08:40:00', '2025-05-16 08:40:00'),
(188, 20, (1, 1, 103, 1, 10.99, 0.00)::order_item_type, 'delivered', 10.99, ('Joseph Rodriguez', '12 Dover Street', 'London', 'England', 'W1S 4LQ', 'UK')::shipping_address_type, '2025-05-11 15:15:45', '2025-05-18 15:15:45'),
(189, 17, (1, 2, 104, 1, 15.99, 3.30)::order_item_type, 'delivered', 12.69, ('Emily Thompson', '22 Mount Street', 'London', 'England', 'W1K 2RD', 'UK')::shipping_address_type, '2025-05-13 10:50:30', '2025-05-20 10:50:30'),
(190, 6, (1, 3, 105, 1, 11.99, 2.15)::order_item_type, 'delivered', 9.84, ('Olivia Williams', '40 Sloane Street', 'London', 'England', 'SW1X 9LT', 'UK')::shipping_address_type, '2025-05-15 14:25:15', '2025-05-22 14:25:15'),
(191, 14, (1, 5, 103, 1, 10.99, 2.20)::order_item_type, 'delivered', 8.79, ('Charlotte Thomas', '17 Pall Mall', 'London', 'England', 'SW1Y 5LA', 'UK')::shipping_address_type, '2025-05-15 18:05:15', '2025-05-22 10:05:15'),
(192, 7, (1, 4, 201, 1, 24.99, 4.60)::order_item_type, 'shipped', 20.39, ('James Johnson', '17 Fleet Street', 'London', 'England', 'EC4Y 1AA', 'UK')::shipping_address_type, '2025-05-17 11:00:00', '2025-05-20 11:00:00'),
(193, 15, (1, 5, 202, 1, 14.99, 2.75)::order_item_type, 'shipped', 12.24, ('Daniel White', '12 Haymarket', 'London', 'England', 'SW1Y 4DQ', 'UK')::shipping_address_type, '2025-05-17 14:35:45', '2025-05-20 14:35:45'),
(194, 13, (1, 4, 102, 1, 19.99, 0.00)::order_item_type, 'shipped', 19.99, ('Thomas Anderson', '9 The Strand', 'London', 'England', 'WC2N 5HR', 'UK')::shipping_address_type, '2025-05-17 16:30:30', '2025-05-20 16:30:30'),
(195, 18, (1, 6, 203, 2, 9.99, 1.80)::order_item_type, 'shipped', 18.18, ('Andrew Robinson', '14 Park Lane', 'London', 'England', 'W1K 7AN', 'UK')::shipping_address_type, '2025-05-18 09:10:30', '2025-05-21 09:10:30'),
(196, 10, (1, 1, 204, 1, 19.99, 4.30)::order_item_type, 'shipped', 15.69, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-05-18 12:45:15', '2025-05-21 12:45:15'),
(197, 18, (1, 6, 104, 2, 15.99, 3.75)::order_item_type, 'shipped', 28.23, ('Grace Robinson', '21 South Audley Street', 'London', 'England', 'W1K 2PW', 'UK')::shipping_address_type, '2025-05-18 13:40:00', '2025-05-21 13:40:00'),
(198, 10, (1, 2, 205, 1, 19.99, 0.00)::order_item_type, 'shipped', 19.99, ('Amelia Wilson', '14 Oxford Street', 'London', 'England', 'W1D 1AS', 'UK')::shipping_address_type, '2025-05-18 14:20:00', '2025-05-21 08:20:00'),
(199, 20, (1, 1, 105, 1, 11.99, 0.00)::order_item_type, 'shipped', 11.99, ('Mia Rodriguez', '18 Grafton Street', 'London', 'England', 'W1S 4ER', 'UK')::shipping_address_type, '2025-05-19 09:15:45', '2025-05-22 09:15:45'),
(200, 20, (1, 3, 101, 1, 15.99, 3.25)::order_item_type, 'shipped', 12.74, ('Joseph Rodriguez', '12 Dover Street', 'London', 'England', 'W1S 4LQ', 'UK')::shipping_address_type, '2025-05-19 11:55:45', '2025-05-22 11:55:45');
