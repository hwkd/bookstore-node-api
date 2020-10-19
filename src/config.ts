// import path from "path";
import fs from "fs";
import { merge } from "lodash";

interface ConfigProps {
  app: {
    port?: number | string;
  };
  mysql: {
    // Mysql user's username. usernameFile will take precedence if both values are populated.
    username?: string;
    // Mysql user's password. passwordFile will take precedence if both values are populated.
    password?: string;
    // Path to file containing mysql user's username.
    usernameFile?: string;
    // Path to file containing mysql user's password.
    passwordFile?: string;
    // Mysql host name.
    host?: string;
    // Mysql database name.
    database?: string;
  };
}

interface IConfig {
  mysqlUser: string;
  mysqlPassword: string;
  mysqlHost: string;
  mysqlDatabase: string;
  appPort: number;
}

const defaultConfigProps = {
  mysql: {
    usernameFile: "/run/secrets/MYSQL_USER",
    passwordFile: "/run/secrets/MYSQL_PASSWORD",
    host: "mysql",
    database: "bookstore",
  },
  app: {
    port: 3000,
  },
};

// Constructs a config object based on the parameters.
export const getConfig = (props: ConfigProps): IConfig => {
  const { app, mysql } = merge(defaultConfigProps, props);

  if (!mysql.username) {
    mysql.username = readFromFile(mysql.usernameFile);
  }

  if (!mysql.password) {
    mysql.password = readFromFile(mysql.passwordFile);
  }

  return {
    mysqlUser: mysql.username,
    mysqlPassword: mysql.password,
    mysqlHost: mysql.host,
    mysqlDatabase: mysql.database,
    appPort: app.port,
  };
};

function readFromFile(path: string) {
  return fs.readFileSync(path, "utf-8");
}
