export interface ItemForm {
  items: Item[];
  total: number;
}

export interface Item {
  name: string | null;
  amount: number | null;
  price: number | null;
  total: number | null;
}
