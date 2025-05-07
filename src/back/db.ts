import fs from "fs"
import path from "path"
import { Database, Statement } from "sqlite3";
export class DB {
    private static dbClass: DB;
    private db: Database | null;
    private dbPath: string;

    private constructor() {
        this.db = null;
        this.dbPath = path.resolve(__dirname, "../data.db");
        path.join()
    }
    public static getDB(): DB {
        if (!DB.dbClass) {
            DB.dbClass = new DB();
        }
        return DB.dbClass;
    }

    public checkOrCreateDB(): void {
        const existsdb: boolean = fs.existsSync(this.dbPath);
        if (!existsdb) {
            const fd = fs.openSync(this.dbPath, "w");
            fs.closeSync(fd);
            console.log("DB created at: ", this.dbPath);
        }
        this.connectDB();
    }
    public connectDB(): void {
        const db = new Database(this.dbPath);
        this.db = db;
    }
    public createOrCheckTables(): void {
        const masterTableSqlScript = `
            CREATE TABLE IF NOT EXISTS mainPassword(
               id INTEGER PRIMARY KEY CHECK (id=1),
               password_hash TEXT NOT NULL,
                key_salt TEXT NOT NULL,      
               enforce_single_row INTEGER DEFAULT 1 CHECK (enforce_single_row=1)
            );
        `
        this.db?.exec(masterTableSqlScript);
        const passwordsTableSqlScript: string = `
       CREATE TABLE IF NOT EXISTS passwords(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
       );
       `
        this.db?.exec(passwordsTableSqlScript);
    }
    public execQuery(sql: string): boolean {
        if (this.db === null) {
            return false;
        }
        else {
            try {
                this.db.exec(sql);
                return true;
            } catch (error) {
                console.error("Error at running sql: ", error)
                return false;
            }
        }
    }
    public execQueryReturn<T = unknown>(sql: string): Promise<T[] | null> | null {
        if (this.db === null) {
            return null;
        }
        try {
            return new Promise<T[]>((resolve, reject) => {
                this.db?.all(sql, (err: Error, rows: T[]) => {
                    if (err) reject(null);
                    else resolve(rows)
                });
            });
        } catch (error) {
            console.error("Error at running sql: ", error)
            return null;
        }
    }
    public preparedQuery(sql: string, ...values: string[]): boolean {
        try {
            if (values.length === 0) return false;
            const stmt = this.db?.prepare(sql);
            stmt?.run(...values);
            stmt?.finalize();
            return true;
        } catch (error) {
            console.error("Error ocurred doing query")
            return false;
        }
    }
    public preparedQueryReturn<T = unknown>(sql: string, ...values: string[]): Promise<T[] | null> | null {
        try {
            return new Promise<T[]>((resolve, reject) => {
                if (values.length === 0) reject(null);
                const stmt = this.db?.prepare(sql);
                // Otra forma de hacer lo mismo
                // stmt?.all(...values, ((err: Error, rows: T[]) => {
                //     stmt.finalize((finalizeErr) => {
                //         if (finalizeErr) {
                //             console.error("Error finalizing statement:", finalizeErr);
                //         }
                //     });
                //     if (err) reject(null);
                //     else resolve(rows);
                // }))
                stmt?.bind(...values);            
                stmt?.all<T>((err:Error,rows:T[])=>{
                    stmt.finalize((finalizeErr) => {
                        if (finalizeErr) {
                            console.error("Error finalizing statement:", finalizeErr);
                        }
                    });
                    if(err) reject(null);
                    else resolve(rows);
                })

            })
        } catch (error) {
            console.error("Error ocurred doing query")
            return null;
        }
    }
}