import { Controller, Get } from "@nestjs/common";

@Controller("/api")
export class AppController {
    @Get("/")
    checkRunning() {
        return "Api is running";
    }
}