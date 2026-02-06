// Ejecuta con: npm run smoke (servidor debe estar corriendo)
const base = `http://127.0.0.1:${process.env.PORT || 3000}`;

async function run() {
  const out = {};
  const j = async (res) => ({ status: res.status, data: await res.json().catch(() => ({})) });
  try {
    out.health = await j(await fetch(`${base}/health`));
    out.mockingpets = await j(await fetch(`${base}/api/mocks/mockingpets?qty=3`));
    out.mockingusers = await j(await fetch(`${base}/api/mocks/mockingusers?qty=5`));
    out.insert = await j(await fetch(`${base}/api/mocks/generateData`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ users: 5, pets: 3 })
    }));
    out.users = await j(await fetch(`${base}/api/users`));
    out.pets = await j(await fetch(`${base}/api/pets`));
  } catch (err) {
    console.error('Smoke error:', err.message);
  }
  console.log(JSON.stringify(out, null, 2));
}

run();
