import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { Operator } from "@prisma/client"
import { RequestWithOperator } from "src/types/request"

export const CurrentOperator = createParamDecorator(
  (data: keyof Operator, context: ExecutionContext) => {
    const operator = context
      .switchToHttp()
      .getRequest<RequestWithOperator>().user
    return data ? operator[data] : operator
  },
)
