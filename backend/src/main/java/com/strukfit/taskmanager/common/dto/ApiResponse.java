package com.strukfit.taskmanager.common.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private String status;
    private T data;
    private String message;

    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setData(data);
        response.setMessage(message);
        return response;
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("error");
        response.setMessage(message);
        return response;
    }
}
