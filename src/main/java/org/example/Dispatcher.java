package org.example;
/**
 * starter class
 */

import java.io.IOException;
import java.net.InetSocketAddress;
import java.sql.SQLException;

import com.sun.net.httpserver.HttpServer;
import org.example.logger.LogWriter;
import org.example.util.Database;
import org.example.web.LoginHandler;
import org.example.web.RegisterHandler;

public class Dispatcher {
    public static void main(String[] args) throws IOException, NoSuchFieldException, IllegalAccessException, SQLException {
        new LogWriter(new Dispatcher()).logInfo("Ura zarabotalo");

        Database.connect();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/register", new RegisterHandler());
        server.createContext("/api/login", new LoginHandler());

        server.setExecutor(null); // за замовчуванням, потоки
        new LogWriter(new Dispatcher()).logInfo("Server started on http://localhost:8080");
        server.start();
    }
}