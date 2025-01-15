export interface OrderBlocks{
    lineNo:number[]|number;
    ProductCode:string;
}

export interface Item{
    orderID:string;
    orderInvoiceNo:string;
    OrderBlocks:OrderBlocks[];
}


export interface RequestBody{
    items:Item[];
}