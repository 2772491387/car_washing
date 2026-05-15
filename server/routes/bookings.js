const { createBooking, getRecentBookings } = require("../db/bookingsRepository");

function cleanText(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
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
    throw badRequest("请填写姓名");
  }

  if (!booking.phone) {
    throw badRequest("请填写手机号");
  }

  if (!/^[+0-9()\-\s]{6,30}$/.test(booking.phone)) {
    throw badRequest("手机号格式不正确");
  }

  return booking;
}

async function create(req, res, { readJson, sendJson }) {
  const body = await readJson(req);
  const booking = createBooking(normalizeBooking(body));

  sendJson(res, 201, {
    message: "预约已保存",
    data: booking
  });
}

function list(req, res, { sendJson }) {
  sendJson(res, 200, {
    data: getRecentBookings()
  });
}

module.exports = { create, list };
