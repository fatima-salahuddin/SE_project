-- Script to apply new constraints to existing tables

-- Customer Constraints
ALTER TABLE Customer ADD CONSTRAINT chk_customer_email CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'));
ALTER TABLE Customer ADD CONSTRAINT chk_customer_dob CHECK (dob < SYSDATE);
ALTER TABLE Customer ADD CONSTRAINT chk_customer_age CHECK (age >= 0);

-- Product Constraints
UPDATE Product SET price = 10 WHERE price < 0;
ALTER TABLE Product ADD CONSTRAINT chk_product_price CHECK (price >= 0);
ALTER TABLE Product ADD CONSTRAINT chk_product_stock CHECK (stock_quantity >= 0);

-- Orders Constraints
ALTER TABLE Orders ADD CONSTRAINT chk_orders_total CHECK (total_amount >= 0);

-- Payment Constraints
ALTER TABLE Payment ADD CONSTRAINT chk_payment_amount CHECK (amount > 0);

COMMIT;
