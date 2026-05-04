package org.example.web;


import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.example.logger.LogWriter;
import org.example.models.User;
import org.example.service.UserChecker;
import org.example.service.UserService;
import org.example.util.CorsConfig;
import org.example.util.Utility;


import java.io.*;
import java.nio.charset.StandardCharsets;

public class LoginHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        CorsConfig.apply(exchange);

        // Обробка preflight-запиту
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            Utility.sendResponse(exchange, "{\"error\":\"Method Not Allowed\"}", 405);
            return;
        }

        String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        System.out.println("Request body: " + body); // Для дебагу

        try {
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            String email = Utility.getString(json, "emailText");
            String password = Utility.getString(json, "passwordText");
            new LogWriter(new LoginHandler()).logInfo("Parsed emailText: " + email);
            new LogWriter(new LoginHandler()).logInfo("Parsed passwordText: " + password);

            if (email == null || email.isEmpty() || password == null || password.isEmpty()){

                Utility.sendResponse(exchange, "{\"error\":\"Missing required fields\"}", 400);
                return;
            }

            User user = new User(email, password);
            boolean isLogined = UserService.checkUser(user);
            String name = UserChecker.findNameByLogin(email);
            int id = UserChecker.getUserIdByLogin(email);
            new LogWriter(new LoginHandler()).logInfo("Logined: " + isLogined);
            new LogWriter(new LoginHandler()).logInfo("Id: " + id);
            new LogWriter(new LoginHandler()).logInfo("name " + name);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("isLogined", isLogined);
            responseJson.addProperty("id", id);
            responseJson.addProperty("name", name);

            Utility.sendResponse(exchange, new Gson().toJson(responseJson), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
