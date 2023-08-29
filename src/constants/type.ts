export interface RegisterRequestBody {
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  password: string;
}
export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface ErrorType {
  message: string;
  status: number;
}
export interface UpdateReqeustBody {
  firstname: string;
  lastname: string;
  mobile: string;
}
export interface UpdateInfo {
  firstname: string;
  lastname: string
  mobile: string
  address: string
}

export interface RatingType {
  star: number
  comment: string
  postedBy: string
}
export interface imageUrl {
  url: string
}
// CLASS
export class ErrroWithStatus {
  message: string
  status: number
  constructor({ message, status }: ErrorType) {
    this.message = message
    this.status = status
  }
}
