export interface Article {
    id: number;
    title: string;
    slug: string;
    category_id: number;
    thumbnail_url: string;
    content: string;
    excerpt: string;
    is_publish: boolean;
    read_duration: number;
    psychologist_name: string;
    hashtags: string[]; 
    created_at: string;
    category_name?: string;
}

export type NewArticle = Omit<Article, 'id' | 'created_at'>;

export type UpdateArticle = Partial<Omit<Article, 'id' | 'created_at'>> & {
    id: number;
};