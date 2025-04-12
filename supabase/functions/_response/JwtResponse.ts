

export interface JwtResponse{
    id:number;
    message:string,
    token:string
    issuedAt:Date,
    expiredAt:Date
}