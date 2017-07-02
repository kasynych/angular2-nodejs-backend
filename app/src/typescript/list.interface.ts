export interface List{
  get(page: number): void;
  delete(ids: number[]): void;
  onInit(): void;
}