package org.example.util;

import org.example.Dispatcher;
import org.example.logger.LogWriter;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final String URL = "jdbc:sqlite:database.db";

    public static Connection connect() throws SQLException {
        new LogWriter(new Database()).logInfo("Підключено до SQLite!");
        return DriverManager.getConnection(URL);
    }
}
