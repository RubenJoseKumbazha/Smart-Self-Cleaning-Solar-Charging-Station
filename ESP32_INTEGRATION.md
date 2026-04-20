# ESP32 & SIM800L Integration with Backend & Token Payment

## Overview

The ESP32 communicates with the backend API to:
1. Register/update bench data
2. Send telemetry data (battery, solar watts, temperature)
3. Request charging sessions
4. Deduct tokens for payment
5. Receive charging authorization

---

## Quick Start

### Configuration

Update these values in your ESP32 firmware:

```cpp
// Backend Server Configuration
const char* BACKEND_SERVER = "192.168.1.x";           // Local IP (testing)
const char* BACKEND_DOMAIN = "solarchargingstation.xyz"; // External domain
const int BACKEND_PORT = 5000;
const char* BENCH_ID = "PARK-001";                    // Unique bench identifier

// For Cloudflare Tunnel:
// const char* BACKEND_SERVER = "solarchargingstation.xyz";
```

---

## API Endpoints Reference

### 1. Register/Update Bench

**Request:**
```
POST /api/benches HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "bench_id": "PARK-001",
  "location": "Downtown Park",
  "latitude": 40.7128,
  "longitude": -74.006,
  "battery_percent": 87,
  "solar_watts": 245.5,
  "temperature": 32,
  "status": "online"
}
```

**Response:**
```json
{
  "id": "1",
  "bench_id": "PARK-001",
  "status": "online",
  "created_at": "2026-04-20T09:30:00Z",
  "message": "Bench registered/updated"
}
```

**ESP32 Code:**
```cpp
void registerBench() {
  String payload = "{\"bench_id\":\"" + String(BENCH_ID) + 
                   "\",\"battery_percent\":" + String(batteryLevel) + 
                   ",\"temperature\":" + String(temperature) + 
                   ",\"status\":\"online\"}";
  
  // Send POST request to /api/benches
  // Update every 5 minutes
}
```

---

### 2. Request Charging Session (Token Payment)

**Request:**
```
POST /api/sessions/start HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "bench_id": "PARK-001",
  "user_id": "2",
  "duration_hours": 1,
  "tokens_required": 3
}
```

**Response: Success (200)**
```json
{
  "session_id": "sess_12345",
  "bench_id": "PARK-001",
  "status": "active",
  "charging": true,
  "tokens_deducted": 3,
  "expires_at": "2026-04-20T10:30:00Z",
  "message": "Charging session started - tokens deducted"
}
```

**Response: Insufficient Tokens (400)**
```json
{
  "error": "Insufficient tokens",
  "user_id": "2",
  "available_tokens": 2,
  "required_tokens": 3
}
```

**Response: Bench Offline (400)**
```json
{
  "error": "Bench not available",
  "bench_id": "PARK-001",
  "status": "offline"
}
```

**ESP32 Code:**
```cpp
bool startChargingSession(const char* userId) {
  String payload = "{\"bench_id\":\"" + String(BENCH_ID) + 
                   "\",\"user_id\":\"" + String(userId) + 
                   "\",\"duration_hours\":1,\"tokens_required\":3}";
  
  // Send POST to /api/sessions/start
  // If success → Turn on relay (start charging)
  // Store session_id for tracking
  
  return success;
}
```

---

### 3. End Charging Session

**Request:**
```
POST /api/sessions/end HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "session_id": "sess_12345",
  "bench_id": "PARK-001",
  "user_id": "2"
}
```

**Response:**
```json
{
  "session_id": "sess_12345",
  "status": "completed",
  "charging": false,
  "duration": 60,
  "tokens_used": 3,
  "message": "Session ended"
}
```

**ESP32 Code:**
```cpp
void endChargingSession(const char* sessionId) {
  String payload = "{\"session_id\":\"" + String(sessionId) + 
                   "\",\"bench_id\":\"" + String(BENCH_ID) + "\"}";
  
  // Send POST to /api/sessions/end
  // Turn off relay (stop charging)
}
```

---

### 4. Check Bench Status

**Request:**
```
GET /api/benches/PARK-001 HTTP/1.1
Host: localhost:5000
```

**Response:**
```json
{
  "id": "1",
  "bench_id": "PARK-001",
  "status": "online",
  "battery_percent": 87,
  "solar_watts": 245.5,
  "temperature": 32,
  "active_sessions": 3,
  "can_charge": true,
  "available": true
}
```

**ESP32 Code:**
```cpp
bool checkBenchAvailable() {
  // GET request to /api/benches/PARK-001
  // Check if status == "online" and active_sessions < max_sessions
  return available;
}
```

---

### 5. Get Active Sessions (for Monitoring)

**Request:**
```
GET /api/benches/PARK-001/sessions HTTP/1.1
Host: localhost:5000
```

**Response:**
```json
[
  {
    "session_id": "sess_12345",
    "user_id": "2",
    "bench_id": "PARK-001",
    "started_at": "2026-04-20T09:30:00Z",
    "expires_at": "2026-04-20T10:30:00Z",
    "tokens_deducted": 3,
    "status": "active"
  }
]
```

---

## Complete ESP32 Implementation Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuration
const char* BENCH_ID = "PARK-001";
const char* BACKEND_URL = "http://192.168.1.100:5000"; // Update with your IP
const char* RELAY_PIN = 12;

// Global variables
String currentSessionId = "";
unsigned long lastUpdateTime = 0;
const unsigned long UPDATE_INTERVAL = 300000; // 5 minutes
unsigned long sessionStartTime = 0;
const unsigned long SESSION_DURATION = 3600000; // 1 hour

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relay OFF initially
  
  // Connect to WiFi/GSM
  connectToNetwork();
}

void loop() {
  // Update bench status every 5 minutes
  if (millis() - lastUpdateTime > UPDATE_INTERVAL) {
    updateBenchStatus();
    lastUpdateTime = millis();
  }
  
  // Check if charging session should be ended
  if (currentSessionId != "" && (millis() - sessionStartTime > SESSION_DURATION)) {
    endSession();
  }
  
  // Check relay state from backend
  checkRelayState();
  
  delay(100);
}

void updateBenchStatus() {
  if (!WiFi.isConnected()) {
    connectToNetwork();
    return;
  }
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/benches";
  
  DynamicJsonDocument doc(1024);
  doc["bench_id"] = BENCH_ID;
  doc["battery_percent"] = getBatteryLevel();
  doc["solar_watts"] = getSolarOutput();
  doc["temperature"] = getTemperature();
  doc["status"] = "online";
  
  String payloadStr;
  serializeJson(doc, payloadStr);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payloadStr);
  
  if (httpCode == 200) {
    Serial.println("Bench status updated");
  } else {
    Serial.print("Error: ");
    Serial.println(httpCode);
  }
  
  http.end();
}

bool requestChargingSession(const char* userId) {
  if (!WiFi.isConnected()) return false;
  
  // First, check if bench is available
  if (!checkBenchAvailable()) {
    Serial.println("Bench not available");
    return false;
  }
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/sessions/start";
  
  DynamicJsonDocument doc(1024);
  doc["bench_id"] = BENCH_ID;
  doc["user_id"] = userId;
  doc["duration_hours"] = 1;
  doc["tokens_required"] = 3;
  
  String payloadStr;
  serializeJson(doc, payloadStr);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payloadStr);
  
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument responseDoc(1024);
    deserializeJson(responseDoc, response);
    
    currentSessionId = responseDoc["session_id"].as<String>();
    sessionStartTime = millis();
    
    // Turn on relay to allow charging
    digitalWrite(RELAY_PIN, HIGH);
    
    Serial.println("Charging session started");
    http.end();
    return true;
  } else {
    String response = http.getString();
    Serial.print("Session request failed: ");
    Serial.println(response);
    http.end();
    return false;
  }
}

bool checkBenchAvailable() {
  if (!WiFi.isConnected()) return false;
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/benches/" + String(BENCH_ID);
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);
    
    bool available = doc["available"].as<bool>();
    http.end();
    return available;
  }
  
  http.end();
  return false;
}

void endSession() {
  if (currentSessionId == "") return;
  if (!WiFi.isConnected()) return;
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/sessions/end";
  
  DynamicJsonDocument doc(1024);
  doc["session_id"] = currentSessionId;
  doc["bench_id"] = BENCH_ID;
  
  String payloadStr;
  serializeJson(doc, payloadStr);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payloadStr);
  
  if (httpCode == 200) {
    // Turn off relay
    digitalWrite(RELAY_PIN, LOW);
    currentSessionId = "";
    Serial.println("Session ended");
  }
  
  http.end();
}

void checkRelayState() {
  if (!WiFi.isConnected()) return;
  
  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/relay/state";
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String response = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);
    
    String state = doc["state"].as<String>();
    int relayValue = (state == "ON") ? HIGH : LOW;
    
    digitalWrite(RELAY_PIN, relayValue);
  }
  
  http.end();
}

int getBatteryLevel() {
  // Read from ADC
  return analogRead(34) / 40.95;
}

float getSolarOutput() {
  // Read from solar panel sensor
  return 245.5; // Placeholder
}

float getTemperature() {
  // Read from temperature sensor
  return 32.0; // Placeholder
}

void connectToNetwork() {
  // Implement WiFi or GSM connection
  // This is pseudo-code
  Serial.println("Connecting to network...");
}
```

---

## Data Flow Diagram

```
┌─────────────────┐
│   ESP32/Bench   │
└────────┬────────┘
         │
         ├─► POST /api/benches (every 5 min)
         │   └─► Battery, Solar, Temp, Status
         │
         ├─► GET /api/benches/{id} (check available)
         │   └─► Available sessions, status
         │
         ├─► POST /api/sessions/start (user request)
         │   ├─► Check: tokens ≥ 3
         │   ├─► Check: bench online
         │   ├─► Deduct 3 tokens
         │   └─► Return session_id → Enable relay
         │
         ├─► POST /api/sessions/end (1 hour elapsed)
         │   └─► Disable relay
         │
         └─► GET /api/relay/state (check command)
             └─► Dashboard control

┌──────────────────┐
│  Backend API     │
│  (Node.js)       │
└────────┬─────────┘
         │
         ├─► Store bench telemetry
         ├─► Manage sessions
         ├─► Deduct tokens from users
         ├─► Store session history
         └─► Control relay state

┌──────────────────┐
│  Frontend UI     │
│  (React)         │
└────────┬─────────┘
         │
         ├─► Display bench status
         ├─► Show active sessions
         ├─► Monitor tokens
         └─► Control relay (ON/OFF)
```

---

## Testing

### Test 1: Register Bench

```bash
curl -X POST http://localhost:5000/api/benches \
  -H "Content-Type: application/json" \
  -d '{
    "bench_id": "PARK-001",
    "location": "Downtown Park",
    "battery_percent": 85,
    "solar_watts": 240,
    "temperature": 30,
    "status": "online"
  }'
```

### Test 2: Request Charging Session

```bash
curl -X POST http://localhost:5000/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{
    "bench_id": "PARK-001",
    "user_id": "2",
    "duration_hours": 1,
    "tokens_required": 3
  }'
```

### Test 3: End Session

```bash
curl -X POST http://localhost:5000/api/sessions/end \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "sess_12345",
    "bench_id": "PARK-001"
  }'
```

### Test 4: Check Bench Status

```bash
curl http://localhost:5000/api/benches/PARK-001
```

---

## Token Payment System

### Payment Model

- **Cost**: 3 tokens per 1 hour of charging
- **Token Source**: Users receive 10 tokens per day (refreshes daily)
- **Deduction**: Happens immediately when session starts
- **Refund**: If session fails (bench offline), tokens are refunded
- **Priority**: Users with more tokens get priority access

### Transaction Flow

```
1. User requests charging
↓
2. Backend checks: bench available?
↓
3. Backend checks: user has ≥3 tokens?
↓
4. If NO → Return error, no tokens deducted
↓
5. If YES → Deduct 3 tokens, create session
↓
6. Backend enables relay (charging starts)
↓
7. After 1 hour (or manual stop) → End session
↓
8. Update bench session counter
```

---

## Error Handling

### Common Errors and Responses

**Insufficient Tokens**
```json
{
  "error": "Insufficient tokens",
  "available": 2,
  "required": 3,
  "code": 400
}
```

**Bench Offline**
```json
{
  "error": "Bench not available",
  "bench_id": "PARK-001",
  "status": "offline",
  "code": 400
}
```

**Session Already Active**
```json
{
  "error": "Bench currently charging",
  "current_session": "sess_12345",
  "expires_at": "2026-04-20T10:30:00Z",
  "code": 400
}
```

**Network Error (ESP32 Side)**
```cpp
// Retry logic
int maxRetries = 3;
int retryDelay = 5000; // 5 seconds

for (int i = 0; i < maxRetries; i++) {
  if (requestChargingSession(userId)) {
    break;
  }
  delay(retryDelay);
}
```

---

## Security Considerations

1. **Authentication**: Use API keys or JWT tokens for production
2. **HTTPS**: Always use HTTPS in production (Cloudflare Tunnel provides this)
3. **Rate Limiting**: Implement rate limiting on backend to prevent abuse
4. **Bench ID Validation**: Store bench_id in ESP32 EEPROM (cannot be changed)
5. **Token Verification**: Backend validates token count before deduction
6. **Session Timeout**: Sessions auto-expire after 1 hour
7. **Relay Safety**: Relay turns off if command not received for 2 hours

---

## Production Setup

### Step 1: ESP32 Configuration
- Assign unique BENCH_ID to each ESP32
- Store in EEPROM for persistence
- Update backend URL to your Cloudflare domain

### Step 2: Backend Configuration
- Set up payment system (3 tokens per hour)
- Configure token refresh (10 tokens per day)
- Set up database for sessions
- Enable rate limiting

### Step 3: Network Setup
- Deploy Cloudflare Tunnel for public access
- Update DNS records
- Test connectivity from ESP32s

### Step 4: Monitoring
- Set up logs for all sessions
- Monitor token usage
- Alert on offline benches
- Track charging statistics

---

## Troubleshooting

**ESP32 can't connect to backend**
- Check WiFi/GSM signal
- Verify backend URL is correct
- Check firewall rules
- Test with curl from your computer

**Relay not turning on after session starts**
- Check HTTP response from /api/sessions/start
- Verify session_id was received
- Check relay pin configuration
- Test relay directly with digitalWrite()

**Tokens not being deducted**
- Check user has sufficient tokens
- Verify backend is running
- Check session creation response
- Review backend logs

---

## Next Steps

1. Implement token system in backend (see below)
2. Create sessions API endpoints
3. Connect frontend to new endpoints
4. Test with multiple ESP32s
5. Deploy to production with Cloudflare Tunnel

# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig | findstr "IPv4"
```

#### External Access (Production)

For ESP32 to communicate over the internet, use Cloudflare Tunnel:
```
http://solarchargingstation.xyz/getRelay.php
```

### SIM800L AT Commands Example

```at
# For HTTP GET request (check relay state)
AT+HTTPINIT
AT+HTTPPARA="URL","http://solarchargingstation.xyz/getRelay.php"
AT+HTTPGET
AT+HTTPREAD

# For HTTP GET with parameters (set relay state)
AT+HTTPINIT
AT+HTTPPARA="URL","http://solarchargingstation.xyz/setRelay.php?state=1"
AT+HTTPGET
AT+HTTPREAD

AT+HTTPTERM
```

### SSL/HTTPS Support

Currently the relay server uses HTTP. For HTTPS in production:

1. **Enable SSL in Cloudflare** (automatic with Cloudflare Tunnel)
2. **Update ESP32 firmware** to support HTTPS communication
3. **Use HTTPS URLs:**
   ```
   https://solarchargingstation.xyz/getRelay.php
   ```

### Polling Strategy

**Recommended polling interval:** Every 30 seconds to save power

```cpp
// Pseudo-code for ESP32
unsigned long lastPoll = 0;
const unsigned long POLL_INTERVAL = 30000; // 30 seconds

void loop() {
    unsigned long currentTime = millis();
    
    if (currentTime - lastPoll >= POLL_INTERVAL) {
        int relayState = getRelayState();
        // Process state
        lastPoll = currentTime;
    }
}
```

### Error Handling

```cpp
// Handle connection failures
typedef enum {
    RELAY_OK = 0,
    RELAY_NO_NETWORK = -1,
    RELAY_CONNECT_FAILED = -2,
    RELAY_INVALID_RESPONSE = -3,
    RELAY_TIMEOUT = -4
} RelayStatus;

RelayStatus getRelayState() {
    // 1. Check GSM connection
    if (!GSM_connected) return RELAY_NO_NETWORK;
    
    // 2. Send HTTP request
    if (!HTTP_GET_success) return RELAY_CONNECT_FAILED;
    
    // 3. Validate response
    if (response != "0" && response != "1") return RELAY_INVALID_RESPONSE;
    
    // 4. Timeout handling
    if (timeout) return RELAY_TIMEOUT;
    
    return RELAY_OK;
}
```

### Bandwidth Optimization

Each HTTP request approximately uses:
- **GET request:** ~150-200 bytes
- **Response:** ~5 bytes

**Monthly data usage (polling every 30 seconds):**
- Requests per day: 2,880
- Requests per month: ~86,400
- Data per month: ~40-50 MB

### Troubleshooting

**Problem:** ESP32 can't connect to relay server
- Check GSM signal strength
- Verify Cloudflare tunnel is running
- Check firewall rules
- Verify DNS resolution

**Problem:** Getting "No such file" error
- Ensure PHP server is running on port 8000
- Check document root is set correctly
- Verify files exist in `/relay_server/` directory

**Problem:** Relay state not changing
- Check `state.txt` file permissions (should be writable)
- Verify PHP execution rights
- Check server logs: `/tmp/relay_server.log`

### Advanced: Custom Control Commands

The current implementation is simple (0/1 toggle). For more complex control:

1. Extend `setRelay.php` to accept different commands:
   ```php
   $command = $_GET['cmd']; // "start", "stop", "restart", "clean"
   file_put_contents("state.txt", $command);
   ```

2. Or create dedicated endpoints:
   ```
   /startCharging.php
   /stopCharging.php
   /startCleaning.php
   /getStatus.php
   ```

### Dashboard Integration

The relay state is automatically synchronized with the dashboard:
- Displayed in the Control Panel
- Can be updated from the admin interface
- Shows last update timestamp
- Alerts on connection loss
