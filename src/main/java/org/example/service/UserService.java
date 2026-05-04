package org.example.service;

import org.example.logger.LogWriter;
import org.example.models.User;
import org.example.util.BCrypt;
import org.example.util.Database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserService {

    public static boolean createUser(User s) {
        String hashedPassword = BCrypt.hashpw(s.getPassword(), BCrypt.gensalt());

        String sql = "INSERT INTO users (login, password, name) VALUES (?, ?, ?)";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getLogin());
            stmt.setString(2, hashedPassword);
            stmt.setString(3, s.getName());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            new LogWriter(new UserService()).logErr("Помилка при створенні користувача: " + e.getMessage());
            return false;
        }
    }

    public static boolean checkUser(User s) {
        String sql = "SELECT password FROM users WHERE login = ? LIMIT 1";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getLogin());
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String hashedPassword = rs.getString("password");
                    return BCrypt.checkpw(s.getPassword(), hashedPassword);
                }
            }
        } catch (SQLException e) {
            new LogWriter(new UserService()).logErr("Помилка при перевірці користувача: " + e.getMessage());
        }
        return false;
    }

    public static boolean deleteUser(User u) {
        String sql = "DELETE FROM users WHERE id = ?";
        try (Connection conn = Database.connect();PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, u.getId());
            stmt.executeUpdate();
            System.out.println("User deleted successfully!");
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public static boolean updateUser(User s) {
        String hashedPassword = BCrypt.hashpw(s.getPassword(), BCrypt.gensalt());

        String sql = "UPDATE users SET login = ?, name = ?, password = ? WHERE id = ?;";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getLogin());
            stmt.setString(2, s.getName());
            stmt.setString(3, hashedPassword);
            stmt.setInt(4, s.getId());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            new LogWriter(new UserService()).logErr("Помилка при оновленні користувача: " + e.getMessage());
            return false;
        }
    }
    public static boolean forgotPassword(User s) {
        String hashedPassword = BCrypt.hashpw(s.getPassword(), BCrypt.gensalt());

        String sql = "UPDATE users SET password = ? WHERE id = ?;";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, hashedPassword);
            stmt.setInt(2, s.getId());
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            new LogWriter(new UserService()).logErr("Помилка при оновленні паролю користувача: " + e.getMessage());
            return false;
        }
    }
    public static boolean setPassword(User s, String oldPassword) {
        String selectSql = "SELECT password FROM users WHERE login = ?";
        String updateSql = "UPDATE users SET password = ? WHERE login = ?";

        try (Connection conn = Database.connect();
             PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {

            selectStmt.setInt(1, s.getId());
            ResultSet rs = selectStmt.executeQuery();

            if (rs.next()) {
                String storedHashedPassword = rs.getString("password");

                if (BCrypt.checkpw(oldPassword, storedHashedPassword)) {
                    String newHashedPassword = BCrypt.hashpw(s.getPassword(), BCrypt.gensalt());

                    try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                        updateStmt.setString(1, newHashedPassword);
                        updateStmt.setString(2, s.getLogin());
                        updateStmt.executeUpdate();
                        return true;
                    }
                } else {
                    new LogWriter(new UserService()).logInfo("Старий пароль неправильний");
                    return false;
                }
            } else {
                new LogWriter(new UserService()).logInfo("Користувача не знайдено");
                return false;
            }

        } catch (SQLException e) {
            new LogWriter(new UserService()).logErr("Помилка при зміні паролю користувача: " + e.getMessage());
            return false;
        }
    }

}
