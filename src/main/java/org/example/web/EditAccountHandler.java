package org.example.web;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import org.example.service.UserService;
import org.example.models.User;
import org.example.util.Utility;

public class EditAccountHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Дозволити CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

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
            String name = Utility.getString(json, "nameText");
            int id = Utility.getInt(json, "idText");

            System.out.println("Parsed emailText: " + email);
            System.out.println("Parsed passwordText: " + password);
            System.out.println("Parsed nameText: " + name);
            System.out.println("Parsed idText: " + id);

            if (email == null || email.isEmpty() || password == null || password.isEmpty() || name == null || name.isEmpty()){

                Utility.sendResponse(exchange, "{\"error\":\"Missing required fields\"}", 400);
                return;
            }

            User user = new User(email, password,name,id);
            boolean isUpdated = UserService.updateUser(user);

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("isUpdated", isUpdated);

            Utility.sendResponse(exchange, new Gson().toJson(responseJson), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
