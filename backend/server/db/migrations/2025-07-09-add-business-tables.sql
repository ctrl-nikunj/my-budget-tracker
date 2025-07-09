-- Active: 1748243009863@@localhost@5432@budget_db
CREATE TABLE contacts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    name text NOT NULL,
    email text,
    phone text,
    address text,
    type text CHECK (type IN ('customer', 'vendor')),
    gstin text, -- optional for business tax
    created_at timestamp DEFAULT now()
);

CREATE TABLE vouchers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    type text NOT NULL CHECK (type IN ('payment', 'receipt', 'journal', 'contra', 'sales', 'purchase')),
    date date DEFAULT CURRENT_DATE,
    reference_no text,
    note text,
    created_at timestamp DEFAULT now()
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    name text NOT NULL,
    sku text UNIQUE, -- Stock Keeping Unit
    description text,
    unit text DEFAULT 'pcs', -- pcs, kg, ltr etc
    price numeric(12, 2),    -- default selling price
    cost_price numeric(12, 2), -- default purchase price
    tax_rate numeric(5, 2) DEFAULT 0.00, -- GST/VAT %
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE TABLE inventory (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id),
    user_id uuid NOT NULL REFERENCES users(id),
    quantity numeric(12, 2) DEFAULT 0.00,
    last_updated timestamp DEFAULT now()
);

CREATE TABLE inventory_movements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id),
    user_id uuid NOT NULL REFERENCES users(id),
    type text CHECK (type IN ('purchase', 'sale', 'adjustment', 'transfer')),
    reference_id uuid, -- links to invoice or voucher
    quantity numeric(12, 2) NOT NULL,
    rate numeric(12, 2) NOT NULL, -- price per unit
    total_value numeric(12, 2) GENERATED ALWAYS AS (quantity * rate) STORED,
    transaction_date date DEFAULT CURRENT_DATE,
    note text,
    created_at timestamp DEFAULT now()
);

CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    contact_id uuid NOT NULL REFERENCES contacts(id),
    total_amount numeric(12, 2) NOT NULL,
    tax_amount numeric(12, 2) DEFAULT 0.00,
    status text CHECK (status IN ('draft', 'sent', 'paid', 'overdue')) DEFAULT 'draft',
    due_date date,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);


ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES contacts(id),
ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES invoices(id),
ADD COLUMN IF NOT EXISTS voucher_id uuid REFERENCES vouchers(id),
ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES products(id),
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'completed' CHECK (
    payment_status IN ('pending', 'partial', 'completed', 'overdue', 'failed')
),
ADD COLUMN IF NOT EXISTS currency char(3) DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS tax_amount numeric(12, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS meta jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();
