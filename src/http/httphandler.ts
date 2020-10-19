import { RequestHandler } from "express";
import {
  HandlerProps,
  HandlerDeps,
  ValidationError,
  DuplicateEntryError,
} from "../types";

interface HTTPHandler {
  (props: HandlerProps<any>): Promise<any> | any;
}

export default (props: HandlerDeps) => {
  const { logger } = props;
  return (handler: HTTPHandler): RequestHandler => {
    return async (req, res) => {
      try {
        const result = await handler({
          context: {
            body: req.body,
            params: req.params,
            query: req.query,
          },
          ...props,
        });

        res.send(result);
      } catch (e) {
        logger.error(e);

        if (e.name == "ValidationError") {
          return res.status(422).send({
            status: 422,
            message: e.message,
            error: e.error,
          });
        } else if (e.name == "DuplicateEntryError") {
          return res.status(422).send({
            status: 422,
            message: e.message,
            entity: e.entity,
          });
        }

        return res.status(500).send({
          status: 500,
          error: "Internal server error",
        });
      }
    };
  };
};
