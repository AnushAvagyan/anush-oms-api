CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "categories"
(
    "id"          UUID                   DEFAULT uuid_generate_v4() NOT NULL,
    "name"        TEXT                                              NOT NULL,
   CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shipments"
(
    "id"              UUID                     DEFAULT uuid_generate_v4() NOT NULL,
    "created"         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()           NOT NULL,
    "order_id"        UUID                                                NOT NULL,
    "tracking_company" TEXT,
    "tracking_number"  TEXT,
    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

CREATE TYPE product_status_type AS ENUM ('active', 'retired');

CREATE TYPE order_status_type AS ENUM ('processing', 'cancelled', 'delivered');

CREATE TABLE "products"
(
    "id"           UUID                  DEFAULT uuid_generate_v4() NOT NULL,
    "name"         TEXT                                             NOT NULL,
    "description"  TEXT,
    "inventory"    NUMERIC                                          NOT NULL,
    "price"        NUMERIC                                          NOT NULL,
    "status"       PRODUCT_STATUS_TYPE                               NOT NULL,
    "category_id"  UUID                                              NOT NULL,
    "created"      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()        NOT NULL,
    "updated"      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()        NOT NULL,
	"image_url"    TEXT,
	"thumbnail"      TEXT,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "orders_category_fkey" FOREIGN KEY ("category_id")
      REFERENCES "categories" ("id")
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "orders"
(
    "id"           UUID                     DEFAULT uuid_generate_v4() NOT NULL,
    "status"       ORDER_STATUS_TYPE                                   NOT NULL,
    "created"      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()           NOT NULL,
    "updated"      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()           NOT NULL,
    "shipment_id"  UUID,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "orders_shipping_fkey" FOREIGN KEY ("shipment_id")
        REFERENCES "shipments" ("id")
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION mod_updated()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated
    BEFORE UPDATE
    ON products
    FOR EACH ROW
EXECUTE PROCEDURE mod_updated();

CREATE TRIGGER set_updated
    BEFORE UPDATE
    ON orders
    FOR EACH ROW
EXECUTE PROCEDURE mod_updated();

CREATE TABLE "orderproducts"
(
    "id"          UUID                   DEFAULT uuid_generate_v4() NOT NULL,
    "order_id"    UUID                                              NOT NULL,
    "product_id"  UUID                                              NOT NULL,
    "quantity"    NUMERIC                                           NOT NULL,
   CONSTRAINT "orderproducts_pkey" PRIMARY KEY ("id"),
   CONSTRAINT "orders_fkey" FOREIGN KEY ("order_id")
    REFERENCES "orders" ("id")
    ON UPDATE CASCADE ON DELETE CASCADE,
   CONSTRAINT "products_fkey" FOREIGN KEY ("product_id")
    REFERENCES "products" ("id")
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE UNIQUE INDEX order_shipment_ukey ON shipments(order_id);
