package org.example.web;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;
import org.example.logger.LogWriter;
import org.example.service.UserChecker;
import org.example.service.UserService;
import org.example.models.User;
import org.example.util.CorsConfig;
import org.example.util.Utility;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RegisterHandler implements HttpHandler {
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
        new LogWriter(new RegisterHandler()).logInfo("Request body: " + body); // Для дебагу

        try {
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            String email = Utility.getString(json, "emailText");
            String password = Utility.getString(json, "passwordText");
            String name = Utility.getString(json, "nameText");

            new LogWriter(new RegisterHandler()).logInfo("Parsed emailText: " + email);
            new LogWriter(new RegisterHandler()).logInfo("Parsed passwordText: " + password);
            new LogWriter(new RegisterHandler()).logInfo("Parsed nameText: " + name);

            if (email == null || email.isEmpty() || password == null || password.isEmpty() || name == null || name.isEmpty()){

                Utility.sendResponse(exchange, "{\"error\":\"Missing required fields\"}", 400);
                return;
            }

            User user = new User(email, password,name);
            boolean isCreated = UserService.createUser(user);
            int id = UserChecker.getUserIdByLogin(email);

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("isCreated", isCreated);
            responseJson.addProperty("id", id);

            Utility.sendResponse(exchange, new Gson().toJson(responseJson), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
