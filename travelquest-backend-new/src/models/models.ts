export interface Destination { destId: string; name: string; region: string; category: string; priceFrom: number; rating: number; heroImg: string; shortDesc: string; longDesc: string; }
// helpers for PK/SK
export const pkDestination = (id: string) => `DEST#${id}`;
export const pkBlog = (id: string) => `BLOG#${id}`;
export const pkUser = (sub: string) => `USER#${sub}`;