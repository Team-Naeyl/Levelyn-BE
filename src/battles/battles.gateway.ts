import {
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({})
export class BattlesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

    async handleConnection(client: Socket) {
        
    }

    async handleDisconnect(client: Socket) {
        throw new Error("Method not implemented.");
    }

    afterInit(server: any) {
        throw new Error("Method not implemented.");
    }

    @SubscribeMessage("")
    async onSkill(
        @MessageBody() msg: any
    ) {

    }

}