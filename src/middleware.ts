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
    }
  }
)
 
// Praktikum 6 - afterHandle
app.onAfterHandle(({ response }) => {
  return {
    success: true,
    message: "data tersedia",
    data: response
  }
})

app.get("/product", () => ({
  id: 1,
  name: "Laptop"
}))

// PRAKTIKUM 7 - Custom Validation Error
app.post(
  "/login",
  ({ body }) => {
    return {
      message: "Login success",
      user: body.email
    }
  },
  {
    body: t.Object({
      email: t.String(), 
      password: t.String({ minLength: 8 })
    })
  }
)

app.onError(({ code, error, set }) => {

  if (code === "VALIDATION") {
    set.status = 400

    return {
      success: false,
      message: "Validation Error",
      detail: error.message
    }
  }
})


app.listen(3000)
console.log("Server running at http://localhost:3000")