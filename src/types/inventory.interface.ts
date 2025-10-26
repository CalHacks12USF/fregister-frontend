export interface InventoryItem {
  name: string;
  quantity: number;
}

export interface InventoryData {
  id: number;
  timestamp: string;
  inventory: InventoryItem[];
  created_at: string;
  updated_at: string;
}

export interface InventoryResponse {
  success: boolean;
  data: InventoryData;
  cached: boolean;
}
