const db = require('./lib/db').default;

console.log('Testing Database...');
try {
    const stmt = db.prepare('INSERT INTO entries (name, calories, date) VALUES (?, ?, ?)');
    const info = stmt.run('Test Meal', 500, '2024-01-01');
    console.log('Insert successful, ID:', info.lastInsertRowid);

    const row = db.prepare('SELECT * FROM entries WHERE id = ?').get(info.lastInsertRowid);
    console.log('Read successful:', row);

    const del = db.prepare('DELETE FROM entries WHERE id = ?');
    del.run(info.lastInsertRowid);
    console.log('Delete successful');
} catch (error) {
    console.error('Database Error:', error);
}
