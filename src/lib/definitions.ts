export type User= {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;   
};

export type Exhibitor = {
    id: number;
    name: string;
    lastname: string;
    email: string;    
    position: string;
    nationality: string;
};

export type Lead = {
    id: number;
    uuid: string;
    name: string;
    paternSurname: string;
    maternSurname: string;
    email: string;
    phone: string;    
    nationality: string;
    company: string;
    position: string;
    country: string;
    municipality: string;
    state: string;
    city: string;
    created_at: Date; 
};
