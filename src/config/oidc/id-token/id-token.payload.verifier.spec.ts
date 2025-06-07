import { IdTokenPayloadVerifier } from './id-token.payload.verifier';
import { IdTokenPayload, PayloadOptions } from '../dto';

describe('IdTokenPayloadVerifier', () => {
    let verifier: IdTokenPayloadVerifier;

    const options: PayloadOptions = {
        iss: 'test-issuer',
        aud: 'test-audience',
        nonce: 'test-nonce'
    };
    beforeEach(async () => {
        verifier = new IdTokenPayloadVerifier(options);
    });

    it('Pass for a valid payload', () => {

        const payload: IdTokenPayload = {
            ...options,
            sub: 'test-subject',
            iat: Date.now() - 10000,
            exp: Date.now() + 10000
        };

        expect(() => verifier.verifyPayload(payload)).not.toThrow();
    });

    it('Throw for mismatched payload properties', () => {

        const payload: IdTokenPayload = {
            ...options,
            sub: 'test-subject',
            iat: Date.now() - 10000,
            exp: Date.now() + 10000
        };

        payload.aud = 'wrong-aud';
        expect(() => verifier.verifyPayload(payload)).toThrow(/Invalid payload/);
    });

    it('should throw for expired token', () => {

        const payload: IdTokenPayload = {
           ...options,
            sub: "test-sub",
            iat: Date.now() - 30000,
            exp: Date.now() - 10000
        };

        expect(() => verifier.verifyPayload(payload)).toThrow(/Expired token/);
    });
});