export async function addUser(request, reply) {
  const { username } = request.body;

  try {
    const stmt = request.server.db.prepare("INSERT INTO users (username) VALUES (?)");
    const info = stmt.run(username);

    reply.code(201).send({ id: info.lastInsertRowid, username });
  } catch (err) {
    request.log.error(err);
    reply.code(500).send({ error: "Failed to add user" });
  }
}
