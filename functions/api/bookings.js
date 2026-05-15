function json(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function cleanText(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeBooking(body) {
  const booking = {
    name: cleanText(body.name, 40),
    phone: cleanText(body.phone, 30),
    car: cleanText(body.car, 80),
    service: cleanText(body.service, 40),
    date: cleanText(body.date, 20),
    time: cleanText(body.time, 30),
    note: cleanText(body.note, 500)
  };

  if (!booking.name) {
    return { error: "请填写姓名" };
  }

  if (!booking.phone) {
    return { error: "请填写手机号" };
  }

  if (!/^[+0-9()\-\s]{6,30}$/.test(booking.phone)) {
    return { error: "手机号格式不正确" };
  }

  return { booking };
}

function assertDb(env) {
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured");
  }
}

function getBearerToken(request) {
  const auth = request.headers.get("Authorization") || "";
  const prefix = "Bearer ";

  if (!auth.startsWith(prefix)) {
    return "";
  }

  return auth.slice(prefix.length).trim();
}

function isAdminRequest(request, env) {
  return Boolean(env.ADMIN_TOKEN && getBearerToken(request) === env.ADMIN_TOKEN);
}

export async function onRequestGet(context) {
  assertDb(context.env);

  if (!isAdminRequest(context.request, context.env)) {
    return json({ message: "Unauthorized" }, 401);
  }

  const { results } = await context.env.DB.prepare(`
    SELECT
      id,
      name,
      phone,
      car,
      service,
      date,
      time,
      note,
      created_at AS createdAt
    FROM bookings
    ORDER BY id DESC
    LIMIT 50
  `).all();

  return json({ data: results || [] });
}

export async function onRequestPost(context) {
  assertDb(context.env);

  let body;

  try {
    body = await context.request.json();
  } catch (error) {
    return json({ message: "Invalid JSON body" }, 400);
  }

  const { booking, error } = normalizeBooking(body);

  if (error) {
    return json({ message: error }, 400);
  }

  const result = await context.env.DB.prepare(`
    INSERT INTO bookings (name, phone, car, service, date, time, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      booking.name,
      booking.phone,
      booking.car,
      booking.service,
      booking.date,
      booking.time,
      booking.note
    )
    .run();

  const id = result.meta.last_row_id;
  const saved = await context.env.DB.prepare(`
    SELECT
      id,
      name,
      phone,
      car,
      service,
      date,
      time,
      note,
      created_at AS createdAt
    FROM bookings
    WHERE id = ?
  `).bind(id).first();

  return json({
    message: "预约已保存",
    data: saved
  }, 201);
}
