package com.pk.mobywatel.response;

import java.sql.Timestamp;

public record LogResponse(Integer logID,
                          Integer userID,
                          Timestamp accessTimestamp,
                          String description) {
}
