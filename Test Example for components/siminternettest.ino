HardwareSerial sim800(2); // UART2

void setup() {
  Serial.begin(115200);
  sim800.begin(9600, SERIAL_8N1, 16, 17); // RX, TX

  delay(3000);
  Serial.println("=== ESP32 + SIM800L TEST (Vi) ===");

  sendCommand("AT", 2000);
  sendCommand("AT+CSQ", 2000);
  sendCommand("AT+CREG?", 2000);
  sendCommand("AT+CGATT?", 2000);

  // GPRS setup
  sendCommand("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"", 2000);
  sendCommand("AT+SAPBR=3,1,\"APN\",\"www\"", 2000);

  sendCommand("AT+SAPBR=1,1", 5000);
  delay(3000);

  sendCommand("AT+SAPBR=2,1", 3000);

  // HTTP setup
  sendCommand("AT+HTTPINIT", 2000);
  sendCommand("AT+HTTPPARA=\"CID\",1", 2000);

  // 👉 Change URL if needed
  sendCommand("AT+HTTPPARA=\"URL\",\"http://httpbin.org/get?data=esp32test\"", 2000);

  // Start request
  sendCommand("AT+HTTPACTION=0", 8000);

  // Read response
  sendCommand("AT+HTTPREAD", 5000);

  // Close HTTP
  sendCommand("AT+HTTPTERM", 2000);

  Serial.println("=== DONE ===");
}

void loop() {
}

// Command function
void sendCommand(String cmd, int timeout) {
  Serial.println(">> " + cmd);
  sim800.println(cmd);

  long int time = millis();
  while ((time + timeout) > millis()) {
    while (sim800.available()) {
      char c = sim800.read();
      Serial.write(c);
    }
  }
  Serial.println();
}