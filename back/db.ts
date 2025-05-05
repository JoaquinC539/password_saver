import fs from "fs"
import path from "path"
import { Database } from "sqlite3";
export class DB{
    private db:Database | null;
    private dbPath:string;
    constructor(){
        this.db=null;
        this.dbPath=path.resolve(__dirname,"../data.db");
    }

    public  checkOrCreateDB():void{             
        const existsdb:boolean=fs.existsSync(this.dbPath);
        if(!existsdb){
           const fd=fs.openSync(this.dbPath,"w");
            fs.closeSync(fd);
            console.log("DB created at: ",this.dbPath);            
        }
        this.connectDB();
    }
    public connectDB():void{
        const db=new Database(this.dbPath);
        this.db=db;

    }
    public  createOrCheckTables():void{
        const masterTableSqlScript=`
            CREATE TABLE IF NOT EXISTS mainPassword(
               id INTEGER PRIMARY KEY CHECK (id=1),
               password TEXT NOT NULL,
               enforce_single_row INTEGER DEFAULT 1 CHECK (enforce_single_row=1)
            );
        `
        this.db?.exec(masterTableSqlScript);
       const passwordsTableSqlScript:string=`
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
    public execQuery(sql:string):boolean{
        if(this.db===null){
            return false;
        }
        else{
            try {
                this.db.exec(sql);
                return true;
            } catch (error) {
                console.error("Error at running sql: ",error)
                return false;
            }
        }
    }
}