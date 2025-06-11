import { IdTokenSignatureVerifier } from './id-token.signature.verifier';
import { UnauthorizedException } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { Jwk } from '../dto';

jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

describe('IdTokenSignatureVerifier', () => {
    let verifier: IdTokenSignatureVerifier;

    const mockJwtVerify = jwtVerify as jest.Mock;
    const validSignature = 'valid.jwt.token';

    const jwk: Jwk = {
        alg: 'RS256',
        e: 'AQAB',
        kid: 'test-key-id',
        kty: 'RSA',
        n: 'test-modulus',
        use: 'sig'
    };

    beforeEach(() => {
        verifier = new IdTokenSignatureVerifier();
        mockJwtVerify.mockReset();
    });

    it('Verify a valid signature without throwing', async () => {
        mockJwtVerify.mockResolvedValue({ payload: {} });

        await expect(verifier.verifySignature(validSignature, jwk)).resolves.toBeUndefined();
    });

    it('Throw UnauthorizedException on verification failure', async () => {
        mockJwtVerify.mockRejectedValue(new Error('invalid signature'));
        await expect(verifier.verifySignature(validSignature, jwk)).rejects.toThrow(UnauthorizedException);
    });
});