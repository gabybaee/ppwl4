import { Elysia, t } from "elysia"
import { openapi } from "@elysiajs/openapi"

const app = new Elysia()
  .use(openapi())

app.onRequest(({ request }) => {
  console.log("📥", request.method, request.url)
  console.log("🕒", new Date().toISOString())
})

app.get("/", () => "Hello Middleware")

// /admin dengan beforeHandle dan response schema
app.get(
  "/admin",
  () => ({ stats: 99 }),
  {
    beforeHandle({ headers, set }) {
      if (!headers.authorization || headers.authorization !== "Bearer 123") {
        set.status = 401
        return { success: false, message: "Unauthorized" }
      }
    },
    description: "Admin stats endpoint",
    // Response schema supaya OpenAPI mengenali route
    response: {
      200: t.Object({ stats: t.Number() }),
      401: t.Object({ success: t.Boolean(), message: t.String() })
    }
  }
)

app.listen(3000)
console.log("Server running at http://localhost:3000")