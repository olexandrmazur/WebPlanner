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

public class DeleteAccounttHandler implements HttpHandler {
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

            int userId = Utility.getInt(json, "userId");
            System.out.println("Parsed eventId: " + userId);

            User user = new User();
            user.setId(userId);
            boolean isDeleted = UserService.deleteUser(user);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("isDeleted", isDeleted);

            Utility.sendResponse(exchange, new Gson().toJson(responseJson), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
