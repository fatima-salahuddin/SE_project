-- ================================
-- Seed Data (Safe for multiple runs)
-- ================================

-- ================================
-- Categories
-- ================================
MERGE INTO Category c
USING (SELECT 'Electronics' AS name, 'Gadgets, devices, and accessories' AS description FROM dual) src
ON (c.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, description) VALUES (src.name, src.description);

MERGE INTO Category c
USING (SELECT 'Clothing' AS name, 'Apparel for men, women, and kids' AS description FROM dual) src
ON (c.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, description) VALUES (src.name, src.description);

MERGE INTO Category c
USING (SELECT 'Books' AS name, 'Fiction, Non-fiction, educational, and more' AS description FROM dual) src
ON (c.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, description) VALUES (src.name, src.description);

MERGE INTO Category c
USING (SELECT 'Home & Kitchen' AS name, 'Furniture, decor, and kitchenware' AS description FROM dual) src
ON (c.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, description) VALUES (src.name, src.description);

MERGE INTO Category c
USING (SELECT 'Sports' AS name, 'Equipment and gear for various sports' AS description FROM dual) src
ON (c.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, description) VALUES (src.name, src.description);

-- ================================
-- Sellers
-- ================================
MERGE INTO Seller s
USING (SELECT 'TechWorld' AS name, '1234567890' AS phone FROM dual) src
ON (s.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, phone) VALUES (src.name, src.phone);

MERGE INTO Seller s
USING (SELECT 'FashionHub' AS name, '0987654321' AS phone FROM dual) src
ON (s.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, phone) VALUES (src.name, src.phone);

MERGE INTO Seller s
USING (SELECT 'BookNook' AS name, '1122334455' AS phone FROM dual) src
ON (s.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, phone) VALUES (src.name, src.phone);

MERGE INTO Seller s
USING (SELECT 'HomeStyle' AS name, '5566778899' AS phone FROM dual) src
ON (s.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, phone) VALUES (src.name, src.phone);

MERGE INTO Seller s
USING (SELECT 'SportsPro' AS name, '9988776655' AS phone FROM dual) src
ON (s.name = src.name)
WHEN NOT MATCHED THEN
  INSERT (name, phone) VALUES (src.name, src.phone);

-- ================================
-- Customers
-- ================================
MERGE INTO Customer c
USING (SELECT 'John Doe' AS name, 'john@example.com' AS email, 'password123' AS password, TO_DATE('1990-05-15','YYYY-MM-DD') AS dob, '555-0101' AS phone FROM dual) src
ON (c.email = src.email)
WHEN NOT MATCHED THEN
  INSERT (name, email, password, dob, phone) 
  VALUES (src.name, src.email, src.password, src.dob, src.phone);

MERGE INTO Customer c
USING (SELECT 'Jane Smith' AS name, 'jane@example.com' AS email, 'password456' AS password, TO_DATE('1995-08-20','YYYY-MM-DD') AS dob, '555-0102' AS phone FROM dual) src
ON (c.email = src.email)
WHEN NOT MATCHED THEN
  INSERT (name, email, password, dob, phone) 
  VALUES (src.name, src.email, src.password, src.dob, src.phone);

-- ================================
-- Addresses
-- ================================
MERGE INTO Address a
USING (
    SELECT 
        (SELECT customer_id FROM Customer WHERE email='john@example.com') AS customer_id,
        '123 Main St' AS street, 'Apt 4B' AS apartment, 'New York' AS city, 'NY' AS state, '10001' AS pincode
    FROM dual
) src
ON (a.customer_id = src.customer_id AND a.street = src.street)
WHEN NOT MATCHED THEN
  INSERT (customer_id, street, apartment, city, state, pincode)
  VALUES (src.customer_id, src.street, src.apartment, src.city, src.state, src.pincode);

MERGE INTO Address a
USING (
    SELECT 
        (SELECT customer_id FROM Customer WHERE email='jane@example.com') AS customer_id,
        '456 Oak Ave' AS street, 'Suite 10' AS apartment, 'Los Angeles' AS city, 'CA' AS state, '90001' AS pincode
    FROM dual
) src
ON (a.customer_id = src.customer_id AND a.street = src.street)
WHEN NOT MATCHED THEN
  INSERT (customer_id, street, apartment, city, state, pincode)
  VALUES (src.customer_id, src.street, src.apartment, src.city, src.state, src.pincode);

-- ================================
-- Reviews
-- ================================
MERGE INTO Review r
USING (
    SELECT 
        (SELECT product_id FROM Product WHERE name='Smartphone X') AS product_id,
        (SELECT customer_id FROM Customer WHERE email='john@example.com') AS customer_id,
        5 AS rating, 'Great phone! Highly recommended.' AS comment_text
    FROM dual
) src
ON (r.product_id = src.product_id AND r.customer_id = src.customer_id)
WHEN NOT MATCHED THEN
  INSERT (product_id, customer_id, rating, comment_text)
  VALUES (src.product_id, src.customer_id, src.rating, src.comment_text);

MERGE INTO Review r
USING (
    SELECT 
        (SELECT product_id FROM Product WHERE name='Wireless Headphones') AS product_id,
        (SELECT customer_id FROM Customer WHERE email='jane@example.com') AS customer_id,
        4 AS rating, 'Good sound quality but a bit tight on the ears.' AS comment_text
    FROM dual
) src
ON (r.product_id = src.product_id AND r.customer_id = src.customer_id)
WHEN NOT MATCHED THEN
  INSERT (product_id, customer_id, rating, comment_text)
  VALUES (src.product_id, src.customer_id, src.rating, src.comment_text);

COMMIT;


