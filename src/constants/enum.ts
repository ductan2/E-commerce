export enum ErrorStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  FORBIDDEN = 403,
  UNPROCESSABLE_ENTITY = 422,
}
export enum BrandType {
  APPLE = "Apple",
  SAMSUNG = "Samsung",
  LENOVO = "Lenovo",
  XIAOMI = "Xiaomi",
  NO_BRAND = "No brand",
}
export enum statusOrder {
  NOT_PROCESSED = "Not processed",
  CASH_ON_DELIVERY = "Cash on delivery",
  PROCESSING = "Processing",
  DISPATCHED = "Dispatched",
  CANCELLED = "Cancelled",
  DELIVERED = "Delivered",
}
export enum statusContact {
  IN_PROCESSED = "In processed",
  SUBMITTED = "Submitted",
  CONTACTED = "Contacted",
}