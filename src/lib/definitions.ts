export type Boletos = {
    id: number;
    name: string;
    email: string;
    phone?: string | null; // Phone number can be optional (null or blank)
    created_at: Date;
    paypal_id_transaction: string;
    total?: string | null; // Total can be optional (null or blank)
};

