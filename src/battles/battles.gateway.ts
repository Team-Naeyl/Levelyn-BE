import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway()
export class BattlesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private _server: Socket;

    handleConnection(client: Socket, ...args: any[]) {
        throw new Error("Method not implemented.");
    }

    handleDisconnect(client: Socket): any {
    }

    afterInit(server: Socket) {
        this._server = server;
    }

}