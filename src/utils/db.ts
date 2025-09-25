// Prueba de conexión: SELECT * FROM KanbanProject.Users
export async function testDBConnection() {
	try {
		const db = await GetDB();
		const result = await db.request().query('SELECT TOP 1 * FROM KanbanProject.Users');
		console.log('Conexión exitosa. Primer usuario:', result.recordset[0]);
		return result.recordset[0];
	} catch (error) {
		console.error('Error de conexión o consulta:', error);
		throw error;
	}
}
import sql from 'mssql';

export async function GetDB() {
	const server = process.env.DB_SERVER;
	const user = process.env.DB_USER;
	const password = process.env.DB_PWD;
	const database = process.env.DB_NAME;
	if (!server || !user || !password || !database) throw new Error('Faltan variables de entorno para la conexión');

	const config: sql.config = {
		server: server.replace('tcp:', ''),
		database,
		user,
		password,
		options: {
			encrypt: true,
			trustServerCertificate: false,
		},
		port: 1433,
	};
	config.options = {
		encrypt: true,
		trustServerCertificate: false,
	};
	config.port = 1433;

	// Crear y retornar la conexión
	try {
		const pool = await sql.connect(config);
		return pool;
	} catch (err) {
		throw new Error('DB connection failed: ' + err);
	}
}