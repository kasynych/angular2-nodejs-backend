export interface Form{
    get(id: number);
    save(event: Event);
    delete(ids: number[]);
    onInit();
    goBack();
}