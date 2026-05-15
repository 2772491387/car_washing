function handle(req, res, { sendJson }) {
  sendJson(res, 200, {
    status: "ok",
    service: "car-washing-site"
  });
}

module.exports = { handle };
