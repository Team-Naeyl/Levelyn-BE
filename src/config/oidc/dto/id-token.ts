export interface IdTokenHeader {
    alg: string;
    typ: string;
    kid: string;
}

export interface IdTokenPayload {
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
    nonce: string;
    nickname: string;
}