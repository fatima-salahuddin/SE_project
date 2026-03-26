CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE address_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE category_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seller_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE product_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE cart_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE orders_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE orderitem_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE review_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE Customer (
    customer_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password VARCHAR2(100) NOT NULL,
    dob DATE,
    phone VARCHAR2(15),
    age NUMBER,
    CONSTRAINT chk_customer_email CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')),
    CONSTRAINT chk_customer_dob CHECK (dob < SYSDATE),
    CONSTRAINT chk_customer_age CHECK (age >= 0)
);

CREATE OR REPLACE TRIGGER trg_customer_ai
BEFORE INSERT ON Customer
FOR EACH ROW
BEGIN
    IF :NEW.customer_id IS NULL THEN
        :NEW.customer_id := customer_seq.NEXTVAL;
    END IF;

    IF :NEW.dob IS NOT NULL THEN
        :NEW.age := FLOOR(MONTHS_BETWEEN(SYSDATE, :NEW.dob) / 12);
    END IF;
END;
/


CREATE TABLE Address (
    address_id NUMBER PRIMARY KEY,
    customer_id NUMBER REFERENCES Customer(customer_id) ON DELETE CASCADE,
    street VARCHAR2(255),
    apartment VARCHAR2(100),
    city VARCHAR2(100),
    state VARCHAR2(100),
    pincode VARCHAR2(20)
);

CREATE OR REPLACE TRIGGER trg_address_ai
BEFORE INSERT ON Address
FOR EACH ROW
BEGIN
    IF :NEW.address_id IS NULL THEN
        :NEW.address_id := address_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Category (
    category_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500)
);

CREATE OR REPLACE TRIGGER trg_category_ai
BEFORE INSERT ON Category
FOR EACH ROW
BEGIN
    IF :NEW.category_id IS NULL THEN
        :NEW.category_id := category_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Seller (
    seller_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    phone VARCHAR2(15),
    total_sales NUMBER DEFAULT 0
);

CREATE OR REPLACE TRIGGER trg_seller_ai
BEFORE INSERT ON Seller
FOR EACH ROW
BEGIN
    IF :NEW.seller_id IS NULL THEN
        :NEW.seller_id := seller_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Product (
    product_id NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    description VARCHAR2(1000),
    price NUMBER(10,2) NOT NULL,
    stock_quantity NUMBER DEFAULT 0,
    brand VARCHAR2(100),
    category_id NUMBER REFERENCES Category(category_id),
    seller_id NUMBER REFERENCES Seller(seller_id),
    image_url VARCHAR2(500),
    CONSTRAINT chk_product_price CHECK (price >= 0),
    CONSTRAINT chk_product_stock CHECK (stock_quantity >= 0)
);

CREATE OR REPLACE TRIGGER trg_product_ai
BEFORE INSERT ON Product
FOR EACH ROW
BEGIN
    IF :NEW.product_id IS NULL THEN
        :NEW.product_id := product_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Cart (
    cart_id NUMBER PRIMARY KEY,
    customer_id NUMBER REFERENCES Customer(customer_id) ON DELETE CASCADE,
    product_id NUMBER REFERENCES Product(product_id) ON DELETE CASCADE,
    quantity NUMBER DEFAULT 1
);

CREATE OR REPLACE TRIGGER trg_cart_ai
BEFORE INSERT ON Cart
FOR EACH ROW
BEGIN
    IF :NEW.cart_id IS NULL THEN
        :NEW.cart_id := cart_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Orders (
    order_id NUMBER PRIMARY KEY,
    customer_id NUMBER REFERENCES Customer(customer_id),
    order_date DATE DEFAULT SYSDATE,
    total_amount NUMBER(10,2),
    status VARCHAR2(50) DEFAULT 'Pending',
    shipping_address_id NUMBER REFERENCES Address(address_id),
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0)
);

CREATE OR REPLACE TRIGGER trg_orders_ai
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    IF :NEW.order_id IS NULL THEN
        :NEW.order_id := orders_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE OrderItem (
    order_item_id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES Orders(order_id) ON DELETE CASCADE,
    product_id NUMBER REFERENCES Product(product_id),
    quantity NUMBER NOT NULL,
    price_at_purchase NUMBER(10,2) NOT NULL
);

CREATE OR REPLACE TRIGGER trg_orderitem_ai
BEFORE INSERT ON OrderItem
FOR EACH ROW
BEGIN
    IF :NEW.order_item_id IS NULL THEN
        :NEW.order_item_id := orderitem_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Payment (
    payment_id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES Orders(order_id) ON DELETE CASCADE,
    payment_date DATE DEFAULT SYSDATE,
    amount NUMBER(10,2) NOT NULL,
    payment_method VARCHAR2(50),
    status VARCHAR2(50),
    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

CREATE OR REPLACE TRIGGER trg_payment_ai
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    IF :NEW.payment_id IS NULL THEN
        :NEW.payment_id := payment_seq.NEXTVAL;
    END IF;
END;
/


CREATE TABLE Review (
    review_id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES Product(product_id) ON DELETE CASCADE,
    customer_id NUMBER REFERENCES Customer(customer_id) ON DELETE CASCADE,
    rating NUMBER(1) CHECK (rating BETWEEN 1 AND 5),
    comment_text VARCHAR2(1000),
    review_date DATE DEFAULT SYSDATE
);

CREATE OR REPLACE TRIGGER trg_review_ai
BEFORE INSERT ON Review
FOR EACH ROW
BEGIN
    IF :NEW.review_id IS NULL THEN
        :NEW.review_id := review_seq.NEXTVAL;
    END IF;
END;
/



