// CommonJS to avoid ESM issues
module.exports = (req, res) => {
  res.status(200).json({ ok: true, now: new Date().toISOString() });
};
