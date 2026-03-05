import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // POST dengan body validation Praktikum 1
  .post(
    "/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )
    // PRAKTIKUM 2 - VALIDASI PARAMS & QUERY
  .get(
    "/products/:id",
    ({ params, query }) => {
      return {
        productId: params.id,
        sort: query.sort
      }
    },
    {
      params: t.Object({
        id: t.Number()
      }),
      query: t.Object({
        sort: t.Union([
          t.Literal("asc"),
          t.Literal("desc")
        ])
      })
    }
  )

 
  .get(
    "/ping",
    () => {
      return {
        success: true,
        message: "Server OK"
      }
    },
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )

  // Praktikum 3 - VALIDASI RESPONSE
  .get("/stats", () => {
    return {
      total: 100,
      active: 80
    }
  },
  {
    response: t.Object({
      total: t.Number(),
      active: t.Number()
    })
  }
)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);