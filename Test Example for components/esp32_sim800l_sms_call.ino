#include <HardwareSerial.h>

// Define Serial pins for SIM800L communication
#define RX_PIN 16  // ESP32 RX pin connected to SIM800L TX
#define TX_PIN 17  // ESP32 TX pin connected to SIM800L RX
#define BAUD_RATE 9600

// Create hardware serial for SIM800L
HardwareSerial simSerial(1);

// Buffer for incoming data
String incomingData = "";
String serialInput = "";

// Variables for tracking state
bool simReady = false;
String lastReceivedSMS = "";

void setup() {
  // Add delay for debugger/uploader to connect
  delay(2000);
  
  // Initialize Serial Monitor (USB)
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n╔══════════════════════════════════════╗");
  Serial.println("║  ESP32 SIM800L SMS & Call Control   ║");
  Serial.println("╚══════════════════════════════════════╝");
  Serial.println("\nInitializing SIM800L module...\n");
  
  // Initialize SIM800L Serial
  simSerial.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
  
  delay(3000);
  
  // Initialize SIM800L module
  initializeSIM800L();
  
  // Print available commands
  printCommands();
}

void loop() {
  // Check for incoming data from SIM800L
  while (simSerial.available()) {
    char c = simSerial.read();
    incomingData += c;
    
    // Check for complete lines
    if (c == '\n') {
      handleSimResponse(incomingData);
      incomingData = "";
    }
  }
  
  // Check for Serial Monitor input (commands)
  while (Serial.available()) {
    char c = Serial.read();
    serialInput += c;
    Serial.write(c);  // Echo back what we received
    
    if (c == '\r' || c == '\n') {
      Serial.println();  // New line for readability
      if (serialInput.length() > 1) {  // Ignore empty commands
        processCommand(serialInput);
      }
      serialInput = "";
    }
  }
  
  delay(10);
}

// ============= INITIALIZATION =============

void initializeSIM800L() {
  // Send AT command to test communication
  sendCommand("AT", 1000);
  
  // Disable echo
  sendCommand("ATE0", 1000);
  
  // Get module info
  sendCommand("ATI", 1000);
  
  // Check SIM status
  sendCommand("AT+CPIN?", 1000);
  
  // Get signal quality
  sendCommand("AT+CSQ", 1000);
  
  // Set text mode for SMS
  sendCommand("AT+CMGF=1", 1000);
  
  // Enable unsolicited result codes for SMS and calls
  sendCommand("AT+CNMI=2,1,0,1", 1000);
  
  // Set caller ID notification
  sendCommand("AT+CLIP=1", 1000);
  
  simReady = true;
  Serial.println("✓ SIM800L initialized successfully!\n");
}

// ============= COMMAND PROCESSING =============

void processCommand(String cmd) {
  cmd.trim();
  
  if (cmd.length() == 0) {
    Serial.println("✗ Empty command received");
    return;
  }
  
  Serial.print("\n>> Received: '");
  Serial.print(cmd);
  Serial.println("'");
  
  // Convert to uppercase for comparison but keep original for phone/message
  String cmdUpper = cmd;
  cmdUpper.toUpperCase();
  
  Serial.print(">> Processing as: '");
  Serial.print(cmdUpper);
  Serial.println("'");
  
  if (cmdUpper.startsWith("SMS:")) {
    // Format: SMS:+1234567890:Hello World
    int firstColon = cmd.indexOf(':');
    int secondColon = cmd.indexOf(':', firstColon + 1);
    
    if (secondColon > 0) {
      String phone = cmd.substring(firstColon + 1, secondColon);
      phone.trim();
      String message = cmd.substring(secondColon + 1);
      message.trim();
      sendSMS(phone, message);
    } else {
      Serial.println("✗ Invalid format. Use: SMS:+1234567890:Message");
    }
  }
  else if (cmdUpper.startsWith("CALL:")) {
    // Format: CALL:+1234567890
    String phone = cmd.substring(5);
    phone.trim();
    makeCall(phone);
  }
  else if (cmdUpper == "HANGUP" || cmdUpper == "CANCEL" || cmdUpper == "H") {
    hangupCall();
  }
  else if (cmdUpper.startsWith("USSD:")) {
    // Format: USSD:*100#
    String ussd = cmd.substring(5);
    ussd.trim();
    sendUSSD(ussd);
  }
  else if (cmdUpper == "READ SMS" || cmdUpper == "READSMS" || cmdUpper == "R") {
    readAllSMS();
  }
  else if (cmdUpper.startsWith("DEL SMS:")) {
    // Format: DEL SMS:1 (delete SMS at index 1)
    int index = cmd.substring(8).toInt();
    deleteSMS(index);
  }
  else if (cmdUpper == "BATTERY" || cmdUpper == "BAT") {
    checkBattery();
  }
  else if (cmdUpper == "SIGNAL" || cmdUpper == "SIG") {
    checkSignal();
  }
  else if (cmdUpper == "STATUS" || cmdUpper == "S") {
    getStatus();
  }
  else if (cmdUpper == "HELP" || cmdUpper == "?" || cmdUpper == "H") {
    printCommands();
  }
  else if (cmdUpper == "DEBUG") {
    debugInfo();
  }
  else if (cmdUpper.startsWith("AT")) {
    // Direct AT command
    sendCommand(cmd, 1000);
  }
  else {
    Serial.print("✗ Unknown command: '");
    Serial.print(cmdUpper);
    Serial.println("' - Type HELP for available commands.");
  }
}

// ============= SMS FUNCTIONS =============

void sendSMS(String phoneNumber, String message) {
  Serial.println("\n--- Sending SMS ---");
  Serial.print("Phone: ");
  Serial.println(phoneNumber);
  Serial.print("Message: ");
  Serial.println(message);
  
  incomingData = "";
  
  // Step 1: Send AT+CMGS command to enter SMS composition mode
  Serial.println("\n[1] Sending AT+CMGS command...");
  simSerial.print("AT+CMGS=\"");
  simSerial.print(phoneNumber);
  simSerial.println("\"");
  
  // Step 2: Wait for ">" prompt (very important!)
  Serial.println("[2] Waiting for > prompt...");
  unsigned long startTime = millis();
  while (millis() - startTime < 3000) {
    if (simSerial.available()) {
      char c = simSerial.read();
      incomingData += c;
      
      if (c == '>') {
        Serial.println("    ✓ Got > prompt!");
        delay(100);
        break;
      }
    }
  }
  
  if (incomingData.indexOf('>') < 0) {
    Serial.println("    ✗ No > prompt received!");
    Serial.print("    Response was: ");
    Serial.println(incomingData);
    return;
  }
  
  // Step 3: Now send the actual message
  Serial.println("[3] Sending message text...");
  simSerial.print(message);
  delay(100);
  
  // Step 4: Send Ctrl+Z to send the SMS
  Serial.println("[4] Sending Ctrl+Z (SMS trigger)...");
  simSerial.write(26);  // Ctrl+Z (ASCII 26)
  
  // Step 5: Wait for final response (OK or +CMGS)
  Serial.println("[5] Waiting for OK/+CMGS response...");
  incomingData = "";
  startTime = millis();
  while (millis() - startTime < 5000) {
    if (simSerial.available()) {
      char c = simSerial.read();
      incomingData += c;
    }
  }
  
  // Step 6: Check if SMS was sent
  if (incomingData.indexOf("OK") >= 0) {
    Serial.println("\n✓✓✓ SMS SENT SUCCESSFULLY! ✓✓✓");
    Serial.print("Response: ");
    Serial.println(incomingData);
  } else if (incomingData.indexOf("+CMGS") >= 0) {
    Serial.println("\n✓✓✓ SMS SENT SUCCESSFULLY! ✓✓✓");
    Serial.print("Response: ");
    Serial.println(incomingData);
  } else {
    Serial.println("\n✗✗✗ FAILED TO SEND SMS ✗✗✗");
    Serial.print("Response: ");
    Serial.println(incomingData);
    Serial.println("\nTroubleshooting:");
    Serial.println("- Check phone number format (include country code)");
    Serial.println("- Check SMS credit on SIM card");
    Serial.println("- Try again in 5 seconds");
  }
}

void readAllSMS() {
  Serial.println("\nReading all SMS messages...");
  sendCommand("AT+CMGL=\"ALL\"", 2000);
}

void deleteSMS(int index) {
  String cmd = "AT+CMGD=" + String(index);
  sendCommand(cmd, 1000);
  Serial.print("SMS message ");
  Serial.print(index);
  Serial.println(" deleted.");
}

// ============= CALL FUNCTIONS =============

void makeCall(String phoneNumber) {
  Serial.println("\n--- Making Call ---");
  Serial.print("Phone: ");
  Serial.println(phoneNumber);
  
  String cmd = "ATD" + phoneNumber + ";";
  Serial.print("Sending: ");
  Serial.println(cmd);
  
  sendCommand(cmd, 1500);
  Serial.println("Call initiated... waiting for response");
}

void hangupCall() {
  Serial.println("\n--- Hanging Up Call ---");
  incomingData = "";
  
  Serial.println("Sending ATH (hang up) command...");
  simSerial.println("ATH");
  
  unsigned long startTime = millis();
  while (millis() - startTime < 2000) {
    if (simSerial.available()) {
      char c = simSerial.read();
      incomingData += c;
    }
  }
  
  if (incomingData.indexOf("OK") >= 0) {
    Serial.println("✓ Call hung up successfully");
  } else {
    Serial.println("Response: " + incomingData);
  }
}

// ============= USSD FUNCTIONS =============

void sendUSSD(String ussdCode) {
  Serial.print("Sending USSD: ");
  Serial.println(ussdCode);
  
  String cmd = "AT+CUSD=1,\"" + ussdCode + "\",15";
  sendCommand(cmd, 2000);
}

// ============= STATUS FUNCTIONS =============

void checkSignal() {
  Serial.println("Checking signal quality...");
  sendCommand("AT+CSQ", 1000);
}

void checkBattery() {
  Serial.println("Checking battery level...");
  sendCommand("AT+CBC", 1000);
}

void getStatus() {
  Serial.println("\n=== Module Status ===");
  sendCommand("ATI", 500);
  sendCommand("AT+CPIN?", 500);
  sendCommand("AT+COPS?", 500);
  sendCommand("AT+CREG?", 500);
  sendCommand("AT+CSQ", 500);
  sendCommand("AT+CBC", 500);
}

// ============= COMMUNICATION FUNCTIONS =============

void sendCommand(String cmd, unsigned long timeout) {
  incomingData = "";
  
  Serial.print(">> AT CMD: ");
  Serial.println(cmd);
  
  simSerial.println(cmd);
  
  unsigned long startTime = millis();
  while (millis() - startTime < timeout) {
    if (simSerial.available()) {
      char c = simSerial.read();
      incomingData += c;
    }
  }
  
  if (incomingData.length() > 0) {
    Serial.print("<< RESPONSE:\n");
    Serial.println(incomingData);
    Serial.println("---");
  } else {
    Serial.println("<< No response (timeout)");
  }
}

void handleSimResponse(String response) {
  response.trim();
  
  if (response.length() == 0) return;
  
  // Only print if not empty
  if (response.indexOf("OK") < 0 && response.indexOf("CONNECT") < 0) {
    Serial.print("[SIM] ");
    Serial.println(response);
  }
  
  // Handle incoming SMS
  if (response.startsWith("+CMT:")) {
    Serial.println("\n╔════════════════════════════════════════╗");
    Serial.println("║      ⬇️  INCOMING SMS DETECTED  ⬇️      ║");
    Serial.println("╚════════════════════════════════════════╝");
    Serial.println(response);
  }
  
  // Handle incoming call
  if (response.startsWith("+CLIP:")) {
    Serial.println("\n╔════════════════════════════════════════╗");
    Serial.println("║      📞 INCOMING CALL DETECTED  📞     ║");
    Serial.println("╚════════════════════════════════════════╝");
    int quotePos = response.indexOf("\"");
    if (quotePos > 0) {
      int secondQuote = response.indexOf("\"", quotePos + 1);
      String callerID = response.substring(quotePos + 1, secondQuote);
      Serial.print("From: ");
      Serial.println(callerID);
    }
  }
  
  // Handle call connected
  if (response.indexOf("CONNECT") >= 0) {
    Serial.println("✓ Call connected");
  }
  
  // Handle call ended
  if (response.indexOf("NO CARRIER") >= 0) {
    Serial.println("✗ Call ended / No carrier");
  }
}

// ============= UTILITY FUNCTIONS =============

void printCommands() {
  Serial.println("\n╔════════════════════════════════════════════╗");
  Serial.println("║    ESP32 SIM800L Control Commands          ║");
  Serial.println("╚════════════════════════════════════════════╝");
  
  Serial.println("\n📱 SMS Commands:");
  Serial.println("  SMS:+919876543210:Hello World  - Send SMS (use your country code)");
  Serial.println("  SMS:+919876543210:Test         - Send test SMS");
  Serial.println("  R or READ SMS                  - Read all SMS messages");
  Serial.println("  DEL SMS:1                      - Delete SMS at index 1");
  
  Serial.println("\n📞 Call Commands:");
  Serial.println("  CALL:+919876543210             - Make call");
  Serial.println("  CALL:+919876543210             - Call another number");
  Serial.println("  H or HANGUP or CANCEL          - Hang up call");
  
  Serial.println("\n🔧 Other Commands:");
  Serial.println("  USSD:*100#                     - Send USSD code");
  Serial.println("  SIG or SIGNAL                  - Check signal quality (0-31)");
  Serial.println("  BAT or BATTERY                 - Check battery level");
  Serial.println("  S or STATUS                    - Get full module status");
  Serial.println("  DEBUG                          - Show debug info");
  Serial.println("  AT+CPIN?                       - Send raw AT command");
  Serial.println("  HELP or ? or H                 - Show this help menu");
  
  Serial.println("\n⚙️  Arduino Serial Settings:");
  Serial.println("  - Baud Rate: 115200");
  Serial.println("  - Line Ending: NL or CR+LF");
  
  Serial.println("\n📋 Example Sequence:");
  Serial.println("  1. STATUS              (check if SIM is ready)");
  Serial.println("  2. SIGNAL              (check signal strength)");
  Serial.println("  3. SMS:+919876543210:Hi  (send test SMS)");
  Serial.println("  4. READ SMS            (check incoming messages)");
  Serial.println("\n");
}

// ============= DIAGNOSTIC FUNCTIONS =============

void debugInfo() {
  Serial.println("\n=== Debug Information ===");
  Serial.print("SIM Ready: ");
  Serial.println(simReady ? "Yes" : "No");
  Serial.print("Incoming Data Buffer: ");
  Serial.println(incomingData);
  Serial.print("Serial Input Buffer: ");
  Serial.println(serialInput);
}
