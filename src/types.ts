export interface Business {
    id: string;
    name: string;
    category: string;
    description: string;
    phone: string;
    image: string;
    status?: 'open' | 'closed' | 'busy';
    rating?: number;
    reviews?: number;
}
