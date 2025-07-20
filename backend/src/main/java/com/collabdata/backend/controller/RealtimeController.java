package com.collabdata.backend.controller;

import com.collabdata.backend.dto.ChartUpdateMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RealtimeController {

    @MessageMapping("/chart/update") // client sends to /app/chart/update
    @SendTo("/topic/chart-updates")  // broadcast to all subscribed clients
    public ChartUpdateMessage broadcast(ChartUpdateMessage message) {
        return message;
    }
}
