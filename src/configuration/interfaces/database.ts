export interface Database {
  user?: string;
  password?: string;
  database?: string;
  server?: string;
  port?: number;
  synchronize?: boolean;
  ssl?: boolean;
  rejectUnauthorized?: boolean;
}
