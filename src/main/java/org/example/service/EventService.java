package org.example.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.example.models.Event;
import org.example.util.Database;
import org.example.util.LocalDateAdapter;
import org.example.util.LocalTimeAdapter;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EventService {

    public static boolean createEvent(Event s) {
        String sql = "INSERT INTO events (orgId, title, content, date, time, location, participants, importancy, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1,s.getOrgId());
            stmt.setString(2, s.getTitle());
            stmt.setString(3, s.getContent());
            stmt.setDate(4, Date.valueOf(s.getDate()));
            stmt.setTime(5, Time.valueOf(s.getTime()));
            stmt.setString(6, s.getLocation());
            String json = new Gson().toJson(s.getParticipants());
            stmt.setString(7, json);
            stmt.setString(8, s.getImportancy());
            stmt.setString(9,s.getColor());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println("Помилка при створенні події: " + e.getMessage());
            return false;
        }
    }

    public static String renderEvent(int orgId) {
        String sql = "SELECT * FROM events WHERE orgId = ? OR JSON_CONTAINS(participants, CAST(? AS JSON), '$');";
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
                .registerTypeAdapter(LocalTime.class, new LocalTimeAdapter())
                .create();

        Map<Integer, List<Event>> map = new HashMap<>();

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1,orgId);
            stmt.setString(2, String.valueOf(orgId));
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Event event = new Event();
                    event.setId(rs.getInt("id"));
                    event.setOrgId(rs.getInt("orgId"));
                    System.out.println(rs.getInt("orgId"));
                    event.setTitle(rs.getString("title"));
                    event.setContent(rs.getString("content"));
                    event.setDate(rs.getDate("date").toLocalDate());
                    event.setTime(rs.getTime("time").toLocalTime());
                    event.setLocation(rs.getString("location"));
                    event.setColor(rs.getString("color"));

                    String participantsJson = rs.getString("participants");
                    List<Integer> participants = gson.fromJson(
                            participantsJson, new TypeToken<List<Integer>>(){}.getType());
                    event.setParticipants(participants);

                    event.setIsPinned(rs.getBoolean("isPinned"));
                    event.setImportancy(rs.getString("importancy"));

                    // Додаємо event в map під ключем id події
                    map.computeIfAbsent(event.getId(), k -> new ArrayList<>()).add(event);
                }
            }
        } catch (SQLException e) {
            System.out.println("Помилка при створенні події: " + e.getMessage());
        }
        return gson.toJson(map);
    }

    public static boolean delteEvent(Event s) {
        String sql = "DELETE FROM events WHERE id = ?;";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1,s.getId());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println("Помилка при видалення події: " + e.getMessage());
            return false;
        }
    }

    public static boolean updateEvent(Event s) {
        String sql = "UPDATE events SET title = ?, content = ?, date = ?, time = ?, location = ?, participants = ?, importancy = ?, color = ? WHERE id = ?;";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getTitle());
            stmt.setString(2, s.getContent());
            stmt.setDate(3, Date.valueOf(s.getDate()));
            stmt.setTime(4, Time.valueOf(s.getTime()));
            stmt.setString(5, s.getLocation());
            String json = new Gson().toJson(s.getParticipants());
            stmt.setString(6, json);
            stmt.setString(7, s.getImportancy());
            stmt.setString(8,s.getColor());
            stmt.setInt(9,s.getId());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println("Помилка при редагуванню події: " + e.getMessage());
            return false;
        }
    }
}