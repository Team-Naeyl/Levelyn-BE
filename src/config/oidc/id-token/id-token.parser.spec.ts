import { IdTokenParser } from "./id-token.parser";
import { IdTokenHeader, IdTokenPayload } from "../dto";
import { faker } from "@faker-js/faker/locale/ko";
import { Buffer } from "node:buffer";

describe("IdTokenParser", () => {
    const idTokenParser = new IdTokenParser();

    it("Return a tuple of header, payload and signature, if valid token given", () => {

        const header: IdTokenHeader = {
            kid: faker.string.alphanumeric(32),
            typ: "RSA",
            alg: "RSA256"
        };

        const payload: IdTokenPayload = {
            iss: faker.internet.url(),
            aud: faker.internet.url(),
            sub: faker.person.fullName(),
            nonce: faker.string.alphanumeric(64),
            iat: Date.now() - 10000,
            exp: Date.now() + 10000
        };

        const signature = "test-signature";

        const idToken = [header, payload]
            .map(obj => JSON.stringify(obj))
            .map(s => Buffer.from(s).toString("base64"))
            .concat([signature])
            .join('.');

        expect(idTokenParser.parseIdToken(idToken)).toEqual([header, payload, signature]);
    });

    it.each(["a.b", "a.b.c.d"])(
        'Throw error, if token not split into 3 parts',
        token => {
            expect(() => idTokenParser.parseIdToken(token))
                .toThrow();
        }
    );

    it('Throw exception if header or payload malformed', () => {
        const idToken = ['???', '!!!', 'signature'].join('.');
        expect(() => idTokenParser.parseIdToken(idToken)).toThrow();
    })


})