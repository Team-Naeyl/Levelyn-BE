export interface GetUserItemsDTO {
    userId: number;
    equipped?: boolean;
    itemIds?: number[];
    typeIds?: number[];
}