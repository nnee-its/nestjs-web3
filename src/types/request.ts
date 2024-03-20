import { Operator } from "@prisma/client"
import { Request } from "express"

export interface RequestWithOperator extends Request {
  operator: Operator
}
