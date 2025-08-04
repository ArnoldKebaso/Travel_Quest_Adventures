export const ok = (body: unknown = {}, status = 200) => ({ statusCode: status, body: JSON.stringify(body) });
export const fail = (msg = "Server error", status = 500) => ({ statusCode: status, body: JSON.stringify({ message: msg }) });
export const unauth = () => fail("Unauthorized", 401);