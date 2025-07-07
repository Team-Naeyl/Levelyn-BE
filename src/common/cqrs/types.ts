import { Result } from "neverthrow";
import { HttpException } from "@nestjs/common";

export type CommandResult<T> = Result<T, HttpException>;
export type CommandExecutionResult<T> = Promise<CommandResult<T>>;